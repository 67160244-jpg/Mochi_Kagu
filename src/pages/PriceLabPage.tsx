import React, { useState, useEffect, useMemo } from 'react';
import { loadPricingModel, loadRetailerSummary } from '../data/dataLoader';
import { PricingModel, RetailerSummary } from '../data/types';
import { DataBadge } from '../components/DataBadge';
import {
  CurrencyMode,
  formatCurrency,
  formatNumber,
  formatPct,
  sarToThb,
  CONFIG,
} from '../config/fx';
import {
  Sliders,
  Sparkles,
  TreePine,
  Layers,
  HelpCircle,
  Truck,
  Wrench,
  AlertCircle,
  Calculator,
  RotateCcw,
} from 'lucide-react';

interface PriceLabPageProps {
  currency: CurrencyMode;
}

export const PriceLabPage: React.FC<PriceLabPageProps> = ({ currency }) => {
  const [model, setModel] = useState<PricingModel | null>(null);
  const [retailer, setRetailer] = useState<RetailerSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Form Parameters
  const [selectedCategory, setSelectedCategory] = useState<string>('Tables & desks');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('hardwood');
  const [widthCm, setWidthCm] = useState<number>(140);
  const [depthCm, setDepthCm] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(75);

  // Assumption Sliders
  const [timberPriceChangePct, setTimberPriceChangePct] = useState<number>(0);
  const [woodCostShare, setWoodCostShare] = useState<number>(CONFIG.DEFAULT_WOOD_COST_SHARE);

  // Optional Operational Add-ons
  const [includeAssembly, setIncludeAssembly] = useState<boolean>(true);
  const [includeShipping, setIncludeShipping] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [pModel, ret] = await Promise.all([
          loadPricingModel(),
          loadRetailerSummary(),
        ]);
        setModel(pModel);
        setRetailer(ret);
      } catch (err) {
        console.error('Error loading pricing model:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getPrice = (sar: number | null | undefined): number | null => {
    if (sar === null || sar === undefined) return null;
    return currency === 'THB' ? sarToThb(sar) : sar;
  };

  const getUsdPrice = (usd: number | null | undefined): number => {
    if (usd === null || usd === undefined) return 0;
    if (currency === 'THB') return usd * CONFIG.USD_TO_THB;
    return (usd * CONFIG.USD_TO_THB) / CONFIG.SAR_TO_THB; // convert to SAR
  };

  // Calculations
  const calculated = useMemo(() => {
    if (!model) return null;
    const catData = model.categories[selectedCategory] || model.categories['Tables & desks'];
    if (!catData) return null;

    const volume_m3 = (widthCm * depthCm * heightCm) / 1000000;
    const footprint_m2 = (widthCm * depthCm) / 10000;

    // Material modifier (Hardwood 1.0, Plywood ~0.85)
    const materialModifier = selectedMaterial === 'plywood' ? 0.88 : 1.0;

    // Base price in SAR
    const baseSar = volume_m3 * catData.price_per_m3_median * materialModifier;
    const p25Sar = volume_m3 * catData.price_per_m3_p25 * materialModifier;
    const p75Sar = volume_m3 * catData.price_per_m3_p75 * materialModifier;

    // Volatility adjustment: Adjusted = Base * (1 + wood_cost_share * change_pct)
    const timberImpactFactor = 1 + woodCostShare * (timberPriceChangePct / 100);
    const adjustedBaseSar = baseSar * timberImpactFactor;
    const adjustedP25Sar = p25Sar * timberImpactFactor;
    const adjustedP75Sar = p75Sar * timberImpactFactor;

    // Delta due to wood price
    const woodDeltaSar = adjustedBaseSar - baseSar;

    // Add-ons from retailer synthetic dataset
    const assemblyUsd = includeAssembly ? 65 : 0;
    const shippingUsd = includeShipping ? 45 : 0;
    const assemblyAddon = getUsdPrice(assemblyUsd);
    const shippingAddon = getUsdPrice(shippingUsd);

    const totalEstimate = (getPrice(adjustedBaseSar) || 0) + assemblyAddon + shippingAddon;
    const totalP25 = (getPrice(adjustedP25Sar) || 0) + assemblyAddon + shippingAddon;
    const totalP75 = (getPrice(adjustedP75Sar) || 0) + assemblyAddon + shippingAddon;

    return {
      volume_m3: Number(volume_m3.toFixed(3)),
      footprint_m2: Number(footprint_m2.toFixed(2)),
      baseItemPrice: getPrice(baseSar),
      adjustedItemPrice: getPrice(adjustedBaseSar),
      woodDelta: getPrice(woodDeltaSar),
      assemblyFee: assemblyAddon,
      shippingFee: shippingAddon,
      totalEstimate: Math.round(totalEstimate),
      totalP25: Math.round(totalP25),
      totalP75: Math.round(totalP75),
    };
  }, [
    model,
    selectedCategory,
    selectedMaterial,
    widthCm,
    depthCm,
    heightCm,
    timberPriceChangePct,
    woodCostShare,
    includeAssembly,
    includeShipping,
    currency,
  ]);

  const handleReset = () => {
    setSelectedCategory('Tables & desks');
    setSelectedMaterial('hardwood');
    setWidthCm(140);
    setDepthCm(70);
    setHeightCm(75);
    setTimberPriceChangePct(0);
    setWoodCostShare(CONFIG.DEFAULT_WOOD_COST_SHARE);
    setIncludeAssembly(true);
    setIncludeShipping(true);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="text-3xl animate-bounce mb-3">📐</div>
        <div className="font-display font-medium text-lg text-mochi-brown">
          กำลังเตรียมห้องทดลองราคา (Price Lab)...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <DataBadge type="assumption" label="โมเดลจำลองเพื่อสาธิตแนวคิด" />
          <span className="text-xs text-mochi-brown/60">
            * สถิติอ้างอิงจาก IKEA Benchmark + World Bank Pink Sheet
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-mochi-brown-dark tracking-tight">
          ห้องทดลองราคาเฟอร์นิเจอร์ (Price Lab)
        </h1>
        <p className="mt-2 text-sm sm:text-base text-mochi-brown/80 max-w-3xl leading-relaxed">
          จำลองระบบคำนวณราคาเรียลไทม์ของ Mochi Kagu ทดลองปรับขนาดมิติเฟอร์นิเจอร์ เลือกชนิดวัสดุ และทดสอบความอ่อนไหวต่อความผันผวนของราคาไม้ในตลาดโลก
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Parameter Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Category & Material */}
          <div className="mochi-card bg-white border-mochi-lavender">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-semibold text-mochi-brown-dark text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-mochi-pink text-mochi-brown-dark flex items-center justify-center text-xs font-bold">
                  1
                </span>
                ประเภทเฟอร์นิเจอร์และวัสดุ
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-mochi-wood-dark hover:text-mochi-brown-dark flex items-center gap-1"
                title="รีเซ็ตเป็นค่าเริ่มต้น"
              >
                <RotateCcw className="w-3 h-3" />
                รีเซ็ต
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-mochi-brown-dark block mb-1">
                  หมวดหมู่ Benchmark
                </label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-mochi-sm bg-mochi-lavender-light/40 border border-mochi-lavender text-xs font-medium text-mochi-brown focus:ring-2 focus:ring-mochi-pink"
                >
                  {model &&
                    Object.keys(model.categories).map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-mochi-brown-dark block mb-1">
                  ประเภทวัสดุไม้
                </label>
                <select
                  value={selectedMaterial}
                  onChange={e => setSelectedMaterial(e.target.value)}
                  className="w-full px-3 py-2 rounded-mochi-sm bg-mochi-lavender-light/40 border border-mochi-lavender text-xs font-medium text-mochi-brown focus:ring-2 focus:ring-mochi-pink"
                >
                  <option value="hardwood">ไม้เนื้อแข็ง (Solid Hardwood)</option>
                  <option value="plywood">ไม้อัดเกรดพรีเมียม (Premium Plywood)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Dimensions */}
          <div className="mochi-card bg-white border-mochi-lavender">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-semibold text-mochi-brown-dark text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-mochi-pink text-mochi-brown-dark flex items-center justify-center text-xs font-bold">
                  2
                </span>
                กำหนดขนาดมิติตามห้องของคุณ (Dimensions)
              </span>
              <span className="text-xs text-mochi-wood-dark font-semibold">
                ปริมาตร: {calculated?.volume_m3} m³ | พื้นที่วาง: {calculated?.footprint_m2} m²
              </span>
            </div>

            <div className="space-y-4">
              {/* Width Slider */}
              <div>
                <div className="flex justify-between text-xs text-mochi-brown-dark mb-1">
                  <span>ความกว้าง (Width)</span>
                  <span className="font-bold">{widthCm} cm</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="280"
                  step="5"
                  value={widthCm}
                  onChange={e => setWidthCm(parseInt(e.target.value))}
                  className="w-full accent-mochi-pink cursor-pointer"
                />
              </div>

              {/* Depth Slider */}
              <div>
                <div className="flex justify-between text-xs text-mochi-brown-dark mb-1">
                  <span>ความลึก (Depth)</span>
                  <span className="font-bold">{depthCm} cm</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="150"
                  step="5"
                  value={depthCm}
                  onChange={e => setDepthCm(parseInt(e.target.value))}
                  className="w-full accent-mochi-pink cursor-pointer"
                />
              </div>

              {/* Height Slider */}
              <div>
                <div className="flex justify-between text-xs text-mochi-brown-dark mb-1">
                  <span>ความสูง (Height)</span>
                  <span className="font-bold">{heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="240"
                  step="5"
                  value={heightCm}
                  onChange={e => setHeightCm(parseInt(e.target.value))}
                  className="w-full accent-mochi-pink cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Market & Cost Assumptions */}
          <div className="mochi-card bg-white border-mochi-lavender">
            <span className="font-display font-semibold text-mochi-brown-dark text-sm flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-mochi-pink text-mochi-brown-dark flex items-center justify-center text-xs font-bold">
                3
              </span>
              สมมติฐานราคาไม้และการประกอบ (Assumptions)
            </span>

            <div className="space-y-4">
              {/* Timber Volatility Slider */}
              <div>
                <div className="flex justify-between text-xs text-mochi-brown-dark mb-1">
                  <span className="flex items-center gap-1">
                    การเปลี่ยนแปลงราคาไม้ในตลาดโลก (%)
                    <span className="text-[10px] text-mochi-brown/60">(World Bank Index)</span>
                  </span>
                  <span className={`font-bold ${timberPriceChangePct > 0 ? 'text-rose-700' : timberPriceChangePct < 0 ? 'text-emerald-700' : ''}`}>
                    {formatPct(timberPriceChangePct)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  step="5"
                  value={timberPriceChangePct}
                  onChange={e => setTimberPriceChangePct(parseInt(e.target.value))}
                  className="w-full accent-mochi-wood cursor-pointer"
                />
              </div>

              {/* Wood Cost Share Slider */}
              <div>
                <div className="flex justify-between text-xs text-mochi-brown-dark mb-1">
                  <span>สัดส่วนต้นทุนไม้ในราคาขาย (Wood Cost Share)</span>
                  <span className="font-bold">{(woodCostShare * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={woodCostShare}
                  onChange={e => setWoodCostShare(parseFloat(e.target.value))}
                  className="w-full accent-mochi-lavender-dark cursor-pointer"
                />
                <span className="text-[11px] text-mochi-brown/60 block mt-0.5">
                  * ค่าเริ่มต้น 25% เป็นสมมติฐานโครงสร้างต้นทุนมาตรฐานของงานช่างไม้
                </span>
              </div>

              {/* Add-ons Checkboxes */}
              <div className="pt-2 border-t border-mochi-lavender/30 flex flex-wrap gap-4 text-xs">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeAssembly}
                    onChange={e => setIncludeAssembly(e.target.checked)}
                    className="rounded accent-mochi-pink w-4 h-4"
                  />
                  <span>รวมบริการช่างประกอบถึงบ้าน (+{formatCurrency(calculated?.assemblyFee, currency, 0)})</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeShipping}
                    onChange={e => setIncludeShipping(e.target.checked)}
                    className="rounded accent-mochi-pink w-4 h-4"
                  />
                  <span>รวมค่าจัดส่งเฉพาะพื้นที่ (+{formatCurrency(calculated?.shippingFee, currency, 0)})</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output: Live Quote Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="mochi-card bg-gradient-to-br from-white via-mochi-cream to-mochi-pink-light/40 border-2 border-mochi-pink shadow-mochi relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-mochi-brown/70">
                ใบเสนอราคาจำลอง (Mock Quotation)
              </span>
              <DataBadge type="assumption" label="จำลองเพื่อสาธิต" size="sm" />
            </div>

            {/* Product Summary Title */}
            <div className="mb-4">
              <div className="text-xl font-display font-bold text-mochi-brown-dark">
                {selectedCategory}
              </div>
              <div className="text-xs text-mochi-brown/70">
                วัสดุ: {selectedMaterial === 'hardwood' ? 'ไม้เนื้อแข็งแท้' : 'ไม้อัดเกรดพรีเมียม'} • ขนาด {widthCm} × {depthCm} × {heightCm} ซม.
              </div>
            </div>

            {/* Big Price Display */}
            <div className="p-4 rounded-mochi bg-white/90 border border-mochi-pink/60 mb-5">
              <span className="text-xs text-mochi-brown/60 block">ราคาประมาณการสุทธิ</span>
              <div className="text-4xl sm:text-5xl font-display font-bold text-mochi-brown-dark my-1">
                {formatCurrency(calculated?.totalEstimate, currency, 0)}
              </div>
              <div className="text-xs text-mochi-wood-dark font-medium">
                ช่วงราคาอ้างอิงความประณีต (p25 – p75):<br />
                {formatCurrency(calculated?.totalP25, currency, 0)} — {formatCurrency(calculated?.totalP75, currency, 0)}
              </div>
            </div>

            {/* Line Items Breakdown */}
            <div className="space-y-2 text-xs border-t border-mochi-lavender/40 pt-4 mb-4">
              <div className="flex justify-between text-mochi-brown/80">
                <span>ราคาโครงสร้างฐานเฟอร์นิเจอร์ ({calculated?.volume_m3} m³):</span>
                <span className="font-semibold text-mochi-brown-dark">
                  {formatCurrency(calculated?.baseItemPrice, currency, 0)}
                </span>
              </div>

              {timberPriceChangePct !== 0 && (
                <div className="flex justify-between">
                  <span className="text-mochi-wood-dark">
                    ผลกระทบราคาไม้ ({formatPct(timberPriceChangePct)} × {(woodCostShare * 100).toFixed(0)}%):
                  </span>
                  <span className={`font-semibold ${calculated && calculated.woodDelta && calculated.woodDelta > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {formatCurrency(calculated?.woodDelta, currency, 0)}
                  </span>
                </div>
              )}

              {includeAssembly && (
                <div className="flex justify-between text-mochi-brown/80">
                  <span>บริการช่างไม้ประกอบและตรวจเช็ก:</span>
                  <span className="font-semibold text-mochi-brown-dark">
                    {formatCurrency(calculated?.assemblyFee, currency, 0)}
                  </span>
                </div>
              )}

              {includeShipping && (
                <div className="flex justify-between text-mochi-brown/80">
                  <span>ค่าบริการขนส่งและยกเข้าห้อง:</span>
                  <span className="font-semibold text-mochi-brown-dark">
                    {formatCurrency(calculated?.shippingFee, currency, 0)}
                  </span>
                </div>
              )}
            </div>

            {/* Caution Banner */}
            <div className="p-3 rounded-mochi-sm bg-amber-50/90 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>คำเตือน:</strong> ราคาจำลองนี้คำนวณจาก Benchmark มัธยฐานราคาต่อปริมาตรของ IKEA Saudi Arabia และดัชนีไม้ World Bank ไม่ใช่ราคาขายจริงของ Mochi Kagu
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
