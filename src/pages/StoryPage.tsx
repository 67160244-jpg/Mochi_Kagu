import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChapterSection } from '../components/ChapterSection';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { DataBadge } from '../components/DataBadge';
import { MochiSparkle, MochiCloud } from '../components/CuteDoodles';
import {
  CurrencyMode,
  formatCurrency,
  formatNumber,
  formatPct,
  sarToThb,
  CONFIG,
} from '../config/fx';
import {
  loadIkeaSummary,
  loadIkeaClean,
  loadTimberMonthly,
  loadRetailerSummary,
  loadThaiExport,
  loadReicHousing,
  loadPricingModel,
} from '../data/dataLoader';
import {
  CategorySummary,
  IkeaItem,
  TimberMonthlyPayload,
  RetailerSummary as RetailerSummaryType,
  ThaiExportData,
  ReicHousingData,
  PricingModel,
} from '../data/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  ArrowDown,
  Layers,
  TrendingUp,
  Truck,
  Sliders,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Sparkles,
  PackageCheck,
  Building2,
  TreePine,
  CheckCircle,
} from 'lucide-react';

interface StoryPageProps {
  currency: CurrencyMode;
}

export const StoryPage: React.FC<StoryPageProps> = ({ currency }) => {
  // Data states
  const [ikeaSummary, setIkeaSummary] = useState<CategorySummary[]>([]);
  const [ikeaItems, setIkeaItems] = useState<IkeaItem[]>([]);
  const [timberData, setTimberData] = useState<TimberMonthlyPayload | null>(null);
  const [retailerData, setRetailerData] = useState<RetailerSummaryType | null>(null);
  const [thaiExport, setThaiExport] = useState<ThaiExportData | null>(null);
  const [reicData, setReicData] = useState<ReicHousingData | null>(null);
  const [pricingModel, setPricingModel] = useState<PricingModel | null>(null);
  const [loading, setLoading] = useState(true);

  // Chapter 2 Filter State
  const [maxFootprintFilter, setMaxFootprintFilter] = useState<number>(2.0); // m²

  // Chapter 3 Timber Time Range Filter
  const [timberRange, setTimberRange] = useState<'all' | '2000' | '5y'>('2000');

  // Chapter 4 Embedded Mini Price Lab State
  const [simCategory, setSimCategory] = useState<string>('Tables & desks');
  const [simWidth, setSimWidth] = useState<number>(120); // cm
  const [simDepth, setSimDepth] = useState<number>(60); // cm
  const [simHeight, setSimHeight] = useState<number>(75); // cm
  const [simWoodChangePct, setSimWoodChangePct] = useState<number>(0);
  const [simWoodCostShare, setSimWoodCostShare] = useState<number>(CONFIG.DEFAULT_WOOD_COST_SHARE);

  // Load all datasets
  useEffect(() => {
    async function init() {
      try {
        const [sum, clean, timber, ret, thEx, reic, pModel] = await Promise.all([
          loadIkeaSummary(),
          loadIkeaClean(),
          loadTimberMonthly(),
          loadRetailerSummary(),
          loadThaiExport(),
          loadReicHousing(),
          loadPricingModel(),
        ]);
        setIkeaSummary(sum);
        setIkeaItems(clean);
        setTimberData(timber);
        setRetailerData(ret);
        setThaiExport(thEx);
        setReicData(reic);
        setPricingModel(pModel);
      } catch (err) {
        console.error('Error loading story page data:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Format price helper based on current currency
  const getPrice = (sar: number | null | undefined): number | null => {
    if (sar === null || sar === undefined) return null;
    return currency === 'THB' ? sarToThb(sar) : sar;
  };

  // Convert USD to THB / USD
  const getUsdPrice = (usd: number | null | undefined): string => {
    if (usd === null || usd === undefined) return '-';
    if (currency === 'THB') {
      return formatCurrency(usd * CONFIG.USD_TO_THB, 'THB', 0);
    }
    return formatCurrency(usd, 'USD', 1);
  };

  // Chapter 1 Charts data: Thai export
  const thaiExportChartData = useMemo(() => {
    if (!thaiExport) return [];
    return thaiExport.figures.annual_history.map(item => ({
      yearLabel: `ปี ${item.year_be} (${item.year_ce})`,
      valueUSD: item.value,
      note: item.note,
    }));
  }, [thaiExport]);

  // Chapter 2: Sample points for scatter plot (filter to footprint <= maxFootprintFilter)
  const scatterData = useMemo(() => {
    return ikeaItems
      .filter(item => item.is_main_furniture && item.footprint_m2 !== null && item.footprint_m2 <= maxFootprintFilter)
      .slice(0, 450)
      .map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        footprint: item.footprint_m2,
        priceDisplay: getPrice(item.price),
        rawPriceSar: item.price,
      }));
  }, [ikeaItems, maxFootprintFilter, currency]);

  // Chapter 2: Category bar chart data
  const categoryBarData = useMemo(() => {
    return ikeaSummary
      .filter(c => c.main_items > 20)
      .map(c => ({
        category: c.category,
        shortCat: c.category.split('&')[0].trim(),
        priceMedian: getPrice(c.price_median),
        pricePerM3Median: getPrice(c.price_per_m3_median),
        footprintMedian: c.footprint_median,
        mainItems: c.main_items,
      }))
      .sort((a, b) => (b.priceMedian || 0) - (a.priceMedian || 0));
  }, [ikeaSummary, currency]);

  // Chapter 3: Timber series filtered by range
  const filteredTimberSeries = useMemo(() => {
    if (!timberData) return [];
    const all = timberData.series;
    if (timberRange === '5y') {
      return all.filter(d => d.year >= 2021);
    }
    if (timberRange === '2000') {
      return all.filter(d => d.year >= 2000);
    }
    return all;
  }, [timberData, timberRange]);

  // Chapter 4: Mini Price Lab calculations
  const simResults = useMemo(() => {
    if (!pricingModel) return null;
    const catData = pricingModel.categories[simCategory] || pricingModel.categories['Tables & desks'];
    if (!catData) return null;

    const volume_m3 = (simWidth * simDepth * simHeight) / 1000000;
    const basePriceSar = volume_m3 * catData.price_per_m3_median;
    const p25PriceSar = volume_m3 * catData.price_per_m3_p25;
    const p75PriceSar = volume_m3 * catData.price_per_m3_p75;

    // Adjusted price with timber volatility formula
    // Adjusted = base * (1 + wood_cost_share * change_pct/100)
    const multiplier = 1 + simWoodCostShare * (simWoodChangePct / 100);
    const adjustedPriceSar = basePriceSar * multiplier;
    const adjustedP25Sar = p25PriceSar * multiplier;
    const adjustedP75Sar = p75PriceSar * multiplier;

    return {
      volume_m3: Number(volume_m3.toFixed(3)),
      footprint_m2: Number(((simWidth * simDepth) / 10000).toFixed(2)),
      basePrice: getPrice(basePriceSar),
      adjustedPrice: getPrice(adjustedPriceSar),
      adjustedP25: getPrice(adjustedP25Sar),
      adjustedP75: getPrice(adjustedP75Sar),
      deltaPrice: getPrice(adjustedPriceSar - basePriceSar),
    };
  }, [pricingModel, simCategory, simWidth, simDepth, simHeight, simWoodChangePct, simWoodCostShare, currency]);

  // Chapter 5: Retailer status pie colors
  const statusColors = ['#C79B6E', '#E07897', '#9F82B8', '#F3B8C9', '#6B7280', '#D1D5DB'];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="text-4xl animate-bounce mb-3">🍡</div>
        <div className="font-display font-medium text-lg text-mochi-brown">
          กำลังจัดเตรียมข้อมูลและโหลดโมเดล Mochi Kagu...
        </div>
        <div className="text-xs text-mochi-brown/60 mt-1">
          โหลดสถิติ IKEA, World Bank Pink Sheet และข้อมูลตลาดอสังหาฯ
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Sticky Chapter Pill Nav Bar */}
      <div className="sticky top-18 z-40 bg-mochi-cream/95 backdrop-blur-md border-b border-mochi-lavender/30 py-2.5 px-4 hidden md:block">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <span className="font-display font-semibold text-mochi-brown-dark shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-mochi-pink-deep" />
            บทนำเรื่อง:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <a href="#ch-0" className="px-3 py-1 rounded-full bg-white hover:bg-mochi-lavender-light border border-mochi-lavender/40 text-mochi-brown transition-colors">
              0. Hero
            </a>
            <a href="#ch-1" className="px-3 py-1 rounded-full bg-white hover:bg-mochi-lavender-light border border-mochi-lavender/40 text-mochi-brown transition-colors">
              1. โอกาสตลาด
            </a>
            <a href="#ch-2" className="px-3 py-1 rounded-full bg-white hover:bg-mochi-lavender-light border border-mochi-lavender/40 text-mochi-brown transition-colors">
              2. ขนาด vs ราคา
            </a>
            <a href="#ch-3" className="px-3 py-1 rounded-full bg-white hover:bg-mochi-lavender-light border border-mochi-lavender/40 text-mochi-brown transition-colors">
              3. ความเสี่ยงราคาไม้
            </a>
            <a href="#ch-4" className="px-3 py-1 rounded-full bg-white hover:bg-mochi-lavender-light border border-mochi-lavender/40 text-mochi-brown transition-colors">
              4. จำลองราคา
            </a>
            <a href="#ch-5" className="px-3 py-1 rounded-full bg-white hover:bg-mochi-lavender-light border border-mochi-lavender/40 text-mochi-brown transition-colors">
              5. หลังบ้านจัดส่ง
            </a>
            <a href="#ch-6" className="px-3 py-1 rounded-full bg-white hover:bg-mochi-lavender-light border border-mochi-lavender/40 text-mochi-brown transition-colors">
              6. บทสรุป
            </a>
          </div>
          <Link
            to="/price-lab"
            className="shrink-0 px-3 py-1 rounded-full bg-mochi-pink hover:bg-mochi-pink-dark text-mochi-brown-dark font-medium transition-colors ml-auto"
          >
            เปิด Full Price Lab →
          </Link>
        </div>
      </div>

      {/* ========================================================
          CHAPTER 0: HERO SECTION
          ======================================================== */}
      <section id="ch-0" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-mochi-lavender/30">
        <div className="absolute top-12 left-10 opacity-40 pointer-events-none hidden sm:block">
          <MochiCloud className="w-24 h-16 text-mochi-lavender" />
        </div>
        <div className="absolute top-20 right-12 opacity-50 pointer-events-none hidden sm:block">
          <MochiSparkle className="w-10 h-10 text-mochi-pink" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Brand & Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mochi-lavender-light text-mochi-brown-dark text-xs sm:text-sm font-medium mb-6 border border-mochi-lavender/60 shadow-xs">
            <span className="text-base">🍡</span>
            <span>Mochi Kagu (โมจิ คากุ) — Custom Furniture With AI Co-Design & 3D</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-mochi-brown-dark tracking-tight leading-tight max-w-4xl mx-auto">
            Storytelling Dashboard
          </h1>

          {/* Core Question Highlight Box */}
          <div className="mt-6 mb-8 max-w-3xl mx-auto p-6 rounded-mochi bg-white/90 border-2 border-mochi-pink shadow-mochi relative">
            <div className="text-xs font-semibold uppercase tracking-wider text-mochi-pink-deep mb-2 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              คำถามหลักในการเล่าเรื่อง (Core Storytelling Question)
            </div>
            <p className="text-lg sm:text-2xl font-display font-medium text-mochi-brown-dark leading-relaxed">
              &ldquo;ถ้าลูกค้าอยากได้เฟอร์นิเจอร์ที่พอดีกับห้องเล็ก ราคาควรเป็นเท่าไร และต้นทุนไม้ที่ผันผวนจะกระทบราคานั้นแค่ไหน&rdquo;
            </p>
          </div>

          <p className="text-sm sm:text-base text-mochi-brown/80 max-w-2xl mx-auto leading-relaxed mb-10">
            วิเคราะห์โอกาสทางธุรกิจและความเสี่ยงเชิงโครงสร้างต้นทุน ผ่านข้อมูลจริงจาก World Bank, IKEA Benchmark, ข้อมูลส่งออก และศูนย์ข้อมูลอสังหาริมทรัพย์ไทย
          </p>

          {/* 3 Real-data Hero KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
            <KpiCard
              title="ราคา Median เฟอร์นิเจอร์ Benchmark"
              value={formatCurrency(getPrice(545), currency, 0)}
              subtext="จากข้อมูล IKEA Saudi Arabia (3,694 ชิ้น)"
              dataType="real"
              dataLabel="IKEA (2020)"
              icon={<Building2 className="w-4 h-4 text-mochi-brown" />}
            />
            <KpiCard
              title="ราคาไม้แปรรูปล่าสุด (S.E. Asia)"
              value={timberData ? `$${timberData.summary.latest.sawnwood_malaysian_usd_m3}/m³` : '-'}
              changePct={timberData?.summary.latest.yoy_pct}
              changeText="YoY (เทียบ ก.ย. 2025)"
              subtext="World Bank Pink Sheet (ก.ย. 2026)"
              dataType="real"
              dataLabel="World Bank"
              icon={<TreePine className="w-4 h-4 text-mochi-wood-dark" />}
              highlight={true}
            />
            <KpiCard
              title="มูลค่าส่งออกเฟอร์นิเจอร์ไทย"
              value={thaiExport ? `$${formatNumber(thaiExport.figures.export_value_full_year_2023_usd_million)}M` : '-'}
              subtext="ปี 2566 (ล่าสุด 10M/67 = $1,197.8M)"
              dataType="secondary"
              dataLabel="ก.พาณิชย์ / BBL Research"
              icon={<TrendingUp className="w-4 h-4 text-blue-700" />}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#ch-1"
              className="mochi-button-primary px-8 py-3.5 text-base flex items-center gap-2 group"
            >
              <span>เริ่มเล่าเรื่องทีละบท</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </a>
            <Link
              to="/explorer"
              className="mochi-button-secondary px-6 py-3 text-sm flex items-center gap-2"
            >
              <span>ข้ามไปสำรวจข้อมูลดิบ</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          CHAPTER 1: MARKET OPPORTUNITY & THAI BASE
          ======================================================== */}
      <ChapterSection
        id="ch-1"
        chapterNumber={1}
        title="โอกาสในตลาด: บ้านเล็กลง แต่ไทยมีฐานช่างไม้พร้อมรองรับ"
        subtitle="วิเคราะห์แนวโน้มที่อยู่อาศัยในเขตเมือง และศักยภาพอุตสาหกรรมผลิตเฟอร์นิเจอร์ของไทย"
        dataType="real"
        dataLabel="ข้อมูลจริง + ทุติยภูมิ"
        bmcReference="Customer Segments & Key Partners"
        soWhatContent={
          <>
            <p>
              <strong>1. โอกาสจาก Small-space Living:</strong> ข้อมูล REIC สะท้อนว่าที่อยู่อาศัยใหม่ใน กทม.-ปริมณฑล มีราคาเฉลี่ยต่อหน่วยสูงขึ้นกว่า <strong>+29.9%</strong> (คำนวณจากยอดเปิดตัว Q1/2569) แม้จำนวนหน่วยจะหดตัวลง 31.1% กลุ่มลูกค้าคอนโดและบ้านในเมืองจำเป็นต้องใช้ประโยชน์จากทุกตารางเมตร เฟอร์นิเจอร์สำเร็จรูปขนาดมาตรฐานจึงมักวางไม่พอดี
            </p>
            <p>
              <strong>2. พันธมิตรโรงงานท้องถิ่น (Key Partners):</strong> ยอดส่งออกเฟอร์นิเจอร์ไทยระดับ <strong>1.3–1.6 พันล้านดอลลาร์สหรัฐ/ปี</strong> ยืนยันว่าไทยมีช่างไม้ฝีมือดีและโรงงาน OEM กระจายตัวอยู่ทั่วประเทศ ซึ่งเป็นฐานผลิตที่ Mochi Kagu สามารถเชื่อมต่อระบบ AI สเปกส่งตรงให้โรงงานผลิตได้ทันที โดยไม่ต้องลงทุนสร้างโรงงานเอง
            </p>
            <p className="text-xs text-mochi-brown/70 italic">
              * ข้อควรระวัง: ข้อมูลส่งออกและ REIC เป็นตัวเลขสะท้อนบริบทตลาดภาพรวม ไม่ได้เป็นข้อพิสูจน์โดยตรงว่าผู้ซื้อทุกคนต้องการเฟอร์นิเจอร์ Custom
            </p>
          </>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Chart: Thai Export History */}
          <div className="lg:col-span-7">
            <ChartCard
              title="มูลค่าส่งออกเฟอร์นิเจอร์ไทยรายปี (USD ล้าน)"
              subtitle="สถิติต่ำสุด สูงสุด และปีล่าสุด จากบทวิเคราะห์ Bangkok Bank Research"
              unit="ล้านดอลลาร์สหรัฐ (USD Million)"
              source="กระทรวงพาณิชย์ จัดทำโดย Bangkok Bank Research (27 พ.ย. 2567)"
              dataType="secondary"
            >
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={thaiExportChartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEE6F5" vertical={false} />
                    <XAxis dataKey="yearLabel" tick={{ fill: '#593432', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#593432', fontSize: 12 }} domain={[0, 2000]} />
                    <Tooltip
                      formatter={(val: number) => [`$${formatNumber(val)} ล้าน`, 'มูลค่าส่งออก']}
                      contentStyle={{ backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #D9CBE8' }}
                    />
                    <Bar dataKey="valueUSD" fill="#C79B6E" radius={[8, 8, 0, 0]}>
                      {thaiExportChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 1 ? '#D86A88' : index === 3 ? '#9A6A3A' : '#C79B6E'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 text-xs text-mochi-brown/70">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D86A88]" /> สูงสุด: ปี 2564 ($1,671.6M ยุค WFH)
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C79B6E]" /> ต่ำสุด: ปี 2558 ($1,050.9M)
                </span>
              </div>
            </ChartCard>
          </div>

          {/* Right Cards: REIC & Top Markets */}
          <div className="lg:col-span-5 space-y-4">
            {/* REIC Housing Box */}
            <div className="mochi-card bg-mochi-lavender-light/50 border-mochi-lavender">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-semibold text-mochi-brown-dark text-sm">
                  สถานการณ์ที่อยู่อาศัย กทม.-ปริมณฑล
                </span>
                <DataBadge type="secondary" label="REIC (ผ่านข่าว)" size="sm" />
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-mochi-brown">
                <div className="p-3 bg-white rounded-mochi-sm border border-mochi-lavender/40">
                  <div className="text-xs text-mochi-brown/70">เปิดขายใหม่ Q1/2569 (8,370 หน่วย)</div>
                  <div className="text-base font-bold text-rose-700 mt-0.5">
                    จำนวนหน่วยลดลง -31.1% YoY
                  </div>
                  <div className="text-[11px] text-mochi-brown/60 mt-0.5">
                    แต่มูลค่าลดลงเพียง -10.4% (59,782 ลบ.)
                  </div>
                </div>

                <div className="p-3 bg-white rounded-mochi-sm border border-mochi-lavender/40">
                  <div className="text-xs text-mochi-brown/70">การคำนวณมูลค่าต่อหน่วยเฉลี่ย</div>
                  <div className="text-base font-bold text-emerald-800 mt-0.5">
                    ราคาเฉลี่ยต่อหน่วยเพิ่มขึ้น +29.9%
                  </div>
                  <div className="text-[11px] text-mochi-brown/60 mt-0.5">
                    จาก ~5.50 ล้านบาท เป็น ~7.14 ล้านบาท/หน่วย (คำนวณเอง)
                  </div>
                </div>
              </div>
            </div>

            {/* Top 5 Export Markets */}
            <div className="mochi-card bg-white">
              <span className="font-display font-semibold text-mochi-brown-dark text-xs block mb-2">
                5 ตลาดส่งออกเฟอร์นิเจอร์หลักของไทย (ต.ค. 2567)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {thaiExport?.figures.top_5_export_markets.map(m => (
                  <span
                    key={m.country}
                    className="px-2.5 py-1 rounded-full bg-mochi-wood-light/60 text-mochi-brown-dark text-xs font-medium"
                  >
                    #{m.rank} {m.country}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* ========================================================
          CHAPTER 2: CUSTOMER DEMAND (DIMENSION VS PRICE)
          ======================================================== */}
      <ChapterSection
        id="ch-2"
        chapterNumber={2}
        title="ลูกค้าอยากได้อะไร: ความสัมพันธ์ระหว่างขนาดห้องกับราคา"
        subtitle="สำรวจสินค้าเฟอร์นิเจอร์หลักกว่า 1,734 ชิ้น ว่าพื้นที่ใช้สอย (Footprint m²) มีผลต่อราคาอย่างไร"
        dataType="real"
        dataLabel="Benchmark IKEA (2020)"
        bmcReference="Value Proposition #1 (ออกแบบเอง คุมงบได้จริง)"
        soWhatContent={
          <>
            <p>
              <strong>1. ขนาดเล็กลง ราคาลดลงอย่างมีนัยสำคัญ:</strong> ข้อมูลกระจายตัวชี้ชัดว่าเฟอร์นิเจอร์ที่มีพื้นที่จัดวาง (Footprint) ต่ำกว่า 0.8 ตร.ม. กระจุกตัวอยู่ในช่วงราคาต่ำถึงปานกลาง การเลือกขนาดที่พอดีกับห้องจึงช่วยประหยัดงบได้จริง
            </p>
            <p>
              <strong>2. ความเหลื่อมล้ำของราคาต่อลูกบาศก์เมตร:</strong> แต่ละหมวดหมู่มีค่า <em>Price per m³</em> แตกต่างกันมาก เช่น หมวดเก้าอี้และโต๊ะมีค่าต่อปริมาตรสูงกว่าตู้เสื้อผ้าขนาดใหญ่ การคิดราคาแบบเรียลไทม์ของ Mochi Kagu จึงต้องอิงตามสถิติความหนาแน่นของแต่ละหมวดหมู่
            </p>
          </>
        }
      >
        {/* Footprint Interactive Slider Control */}
        <div className="mochi-card bg-white mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-display font-semibold text-sm text-mochi-brown-dark block">
                ทดลองปรับพื้นที่จัดวางห้องที่มีจำกัด (Footprint Slider)
              </span>
              <span className="text-xs text-mochi-brown/70">
                กรองดูเฟอร์นิเจอร์ที่ขนาดไม่เกินพื้นที่ของคุณ (ปัจจุบัน: ไม่เกิน {maxFootprintFilter.toFixed(1)} ตร.ม.)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.3"
                max="4.0"
                step="0.1"
                value={maxFootprintFilter}
                onChange={e => setMaxFootprintFilter(parseFloat(e.target.value))}
                className="w-40 sm:w-56 accent-mochi-pink cursor-pointer"
                aria-label="ตัวกรองขนาดพื้นที่จัดวางสูงสุด"
              />
              <span className="px-3 py-1 rounded-full bg-mochi-pink text-mochi-brown-dark font-display font-bold text-xs shrink-0">
                ≤ {maxFootprintFilter.toFixed(1)} m²
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scatter Plot */}
          <div className="lg:col-span-7">
            <ChartCard
              title="การกระจายตัวของพื้นที่จัดวาง (ตร.ม.) เทียบกับราคา"
              subtitle={`แสดงสินค้าเฟอร์นิเจอร์หลักที่มีขนาด ≤ ${maxFootprintFilter.toFixed(1)} ตร.ม. (${scatterData.length} ชิ้น)`}
              unit={`แกน X: ตร.ม. | แกน Y: ${currency}`}
              source="IKEA Furniture Dataset (TidyTuesday, กรองเฉพาะ is_main_furniture)"
              dataType="real"
            >
              <div className="h-72 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEE6F5" />
                    <XAxis
                      type="number"
                      dataKey="footprint"
                      name="Footprint (m²)"
                      domain={[0, maxFootprintFilter]}
                      tick={{ fill: '#593432', fontSize: 11 }}
                      unit=" m²"
                    />
                    <YAxis
                      type="number"
                      dataKey="priceDisplay"
                      name="ราคา"
                      tick={{ fill: '#593432', fontSize: 11 }}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ payload }) => {
                        if (!payload || !payload.length) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-white rounded-mochi-sm shadow-md border border-mochi-lavender text-xs space-y-1">
                            <div className="font-bold text-mochi-brown-dark">{data.name}</div>
                            <div className="text-mochi-brown/70">{data.category}</div>
                            <div className="text-mochi-wood-dark font-medium">
                              ขนาดพื้นที่: {data.footprint} ตร.ม.
                            </div>
                            <div className="text-mochi-pink-deep font-bold">
                              ราคา: {formatCurrency(data.priceDisplay, currency, 0)}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Scatter name="เฟอร์นิเจอร์" data={scatterData} fill="#D86A88" opacity={0.65} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Category Median Bar Chart */}
          <div className="lg:col-span-5">
            <ChartCard
              title="ราคา Median แยกตามหมวดหมู่หลัก"
              subtitle="เปรียบเทียบมิติราคาของแต่ละประเภทเฟอร์นิเจอร์"
              unit={currency}
              source="IKEA Benchmark (คำนวณ Median เฉพาะเฟอร์นิเจอร์หลักที่มี 3 มิติ)"
              dataType="real"
            >
              <div className="h-72 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryBarData.slice(0, 7)}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEE6F5" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#593432', fontSize: 10 }} />
                    <YAxis
                      dataKey="shortCat"
                      type="category"
                      tick={{ fill: '#593432', fontSize: 10 }}
                      width={80}
                    />
                    <Tooltip
                      formatter={(val: number) => [formatCurrency(val, currency, 0), 'ราคา Median']}
                      contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #D9CBE8' }}
                    />
                    <Bar dataKey="priceMedian" fill="#C79B6E" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      </ChapterSection>

      {/* ========================================================
          CHAPTER 3: COST RISK (TIMBER PRICE VOLATILITY)
          ======================================================== */}
      <ChapterSection
        id="ch-3"
        chapterNumber={3}
        title="ความเสี่ยงต้นทุน: ราคาไม้ในตลาดโลกผันผวนรุนแรง"
        subtitle="ข้อมูลราคาสินค้าโภคภัณฑ์หมวดไม้จริงจากธนาคารโลก (World Bank Pink Sheet) ย้อนหลังถึงปัจจุบัน"
        dataType="real"
        dataLabel="World Bank Pink Sheet (1980–2026)"
        bmcReference="Cost Structure & SWOT (Threat: วัตถุดิบผันผวน)"
        soWhatContent={
          <>
            <p>
              <strong>1. ความผันผวนคือภัยคุกคามโดยตรงต่อ Margin:</strong> ราคาไม้แปรรูปเอเชียตะวันออกเฉียงใต้ (Sawnwood Malaysian) เคยแตะจุดต่ำสุดที่ <strong>$453.6/m³</strong> และพุ่งสูงสุดถึง <strong>$824.9/m³</strong> (ส่วนต่างกว่า $371/m³) ในรอบตั้งแต่ปี 2000 เป็นต้นมา
            </p>
            <p>
              <strong>2. ทางออกเชิงกลยุทธ์ของ Mochi Kagu:</strong> แบรนด์ไม่สามารถตั้งราคาขายคงที่ตายตัวตลอดปีได้ จึงต้องมี <em>Dynamic Real-time Pricing Formula</em> ที่ปรับราคาสินค้าตามดัชนีต้นทุนไม้ พร้อมทำสัญญาล่วงหน้า (Forward Supply Contracts) กับช่างไม้ท้องถิ่นเพื่อล็อกราคาไม้เป็นรอบไตรมาส
            </p>
          </>
        }
      >
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <KpiCard
            title="ราคา Sawnwood ล่าสุด (ก.ย. 2026)"
            value={`$${timberData?.summary.latest.sawnwood_malaysian_usd_m3}/m³`}
            changePct={timberData?.summary.latest.yoy_pct}
            changeText="YoY (+1.8%)"
            subtext="ไม้แปรรูป S.E. Asia"
            dataType="real"
          />
          <KpiCard
            title="ราคา Logs ล่าสุด (ก.ย. 2026)"
            value={`$${timberData?.summary.latest.logs_malaysian_usd_m3}/m³`}
            subtext="ไม้ท่อน Logs Malaysian"
            dataType="real"
          />
          <KpiCard
            title="ราคา Plywood ล่าสุด (ก.ย. 2026)"
            value={`${timberData?.summary.latest.plywood_cents_sheet} ¢/แผ่น`}
            subtext="ไม้อัด (เซนต์ต่อแผ่น)"
            dataType="real"
          />
          <KpiCard
            title="ช่วงแกว่งตัวตั้งแต่ปี 2000"
            value={`$${timberData?.summary.post_2000_stats.range_spread}/m³`}
            subtext={`Min $${timberData?.summary.post_2000_stats.min_usd_m3} - Max $${timberData?.summary.post_2000_stats.max_usd_m3}`}
            dataType="real"
            highlight={true}
          />
        </div>

        {/* Timber Line Chart */}
        <ChartCard
          title="แนวโน้มราคาไม้แปรรูปและไม้ท่อน (USD ต่อลูกบาศก์เมตร)"
          subtitle="เปรียบเทียบ Sawnwood Malaysian กับ Logs Malaysian"
          unit="ดอลลาร์สหรัฐต่อ ลบ.ม. (USD / m³)"
          source="World Bank Commodity Price Data (The Pink Sheet, อัปเดต ต.ค. 2026)"
          dataType="real"
          headerAction={
            <div className="inline-flex p-1 bg-mochi-lavender-light rounded-full border border-mochi-lavender/40 text-xs">
              <button
                type="button"
                onClick={() => setTimberRange('5y')}
                className={`px-3 py-1 rounded-full transition-all ${
                  timberRange === '5y' ? 'bg-mochi-pink text-mochi-brown-dark font-semibold' : 'text-mochi-brown/70'
                }`}
              >
                5 ปีล่าสุด
              </button>
              <button
                type="button"
                onClick={() => setTimberRange('2000')}
                className={`px-3 py-1 rounded-full transition-all ${
                  timberRange === '2000' ? 'bg-mochi-pink text-mochi-brown-dark font-semibold' : 'text-mochi-brown/70'
                }`}
              >
                ตั้งแต่ปี 2000
              </button>
              <button
                type="button"
                onClick={() => setTimberRange('all')}
                className={`px-3 py-1 rounded-full transition-all ${
                  timberRange === 'all' ? 'bg-mochi-pink text-mochi-brown-dark font-semibold' : 'text-mochi-brown/70'
                }`}
              >
                ทั้งหมด (1980+)
              </button>
            </div>
          }
        >
          <div className="h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredTimberSeries} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEE6F5" />
                <XAxis
                  dataKey="code"
                  tick={{ fill: '#593432', fontSize: 10 }}
                  interval={Math.floor(filteredTimberSeries.length / 8)}
                />
                <YAxis tick={{ fill: '#593432', fontSize: 10 }} domain={['dataMin - 50', 'dataMax + 50']} />
                <Tooltip
                  formatter={(val: number, name: string) => [
                    `$${val} / m³`,
                    name === 'sawnwood_malaysian' ? 'Sawnwood (S.E. Asia)' : 'Logs (S.E. Asia)',
                  ]}
                  labelFormatter={code => `เดือน: ${code}`}
                  contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #D9CBE8' }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={value => (value === 'sawnwood_malaysian' ? 'ไม้แปรรูป (Sawnwood)' : 'ไม้ท่อน (Logs)')}
                />
                <Line
                  type="monotone"
                  dataKey="sawnwood_malaysian"
                  stroke="#C79B6E"
                  strokeWidth={2.5}
                  dot={false}
                  strokeLinecap="round"
                />
                <Line
                  type="monotone"
                  dataKey="logs_malaysian"
                  stroke="#9F82B8"
                  strokeWidth={2}
                  dot={false}
                  strokeLinecap="round"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Note on Plywood Axis Separation */}
        <div className="p-4 rounded-mochi bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>ข้อควรระวังเรื่องหน่วยวัด:</strong> ซีรีส์ <em>Plywood (ไม้อัด)</em> มีหน่วยเป็น <strong>เซนต์ต่อแผ่น (cents/sheet)</strong> ล่าสุดอยู่ที่ 349.1 ¢/แผ่น ไม่ใช่ $/ลบ.ม. จึงแยกการแสดงผลไม่นำไปพลอตบนแกนเดียวกับไม้แปรรูป เพื่อป้องกันการสับสนในระดับสเกลข้อมูล
          </div>
        </div>
      </ChapterSection>

      {/* ========================================================
          CHAPTER 4: TRANSPARENT REAL-TIME PRICING SIMULATION
          ======================================================== */}
      <ChapterSection
        id="ch-4"
        chapterNumber={4}
        title="ราคาที่โปร่งใส: ลองจำลองราคาตามขนาดจริงด้วยตัวเอง"
        subtitle="สัมผัส Value Proposition หลักของ Mochi Kagu เห็นราคาสินค้าเปลี่ยนทันทีตามขนาดห้องและความผันผวนของต้นทุนไม้"
        dataType="assumption"
        dataLabel="Benchmark + สมมติฐาน"
        bmcReference="Value Proposition #1 & #2 (ราคาเรียลไทม์ + AI Co-Design)"
        soWhatContent={
          <>
            <p>
              <strong>1. ความโปร่งใสสร้างความมั่นใจ:</strong> ลูกค้าคอนโดมักกลัวว่าการสั่งทำ Custom จะบานปลายและคิดราคาตามใจชอบ เครื่องมือจำลองราคานี้สาธิตว่าอัลกอริทึมของ Mochi Kagu คำนวณจากปริมาตรเนื้อไม้จริงอย่างเป็นธรรม
            </p>
            <p>
              <strong>2. การสะท้อนความผันผวนต้นทุนอย่างมีขอบเขต:</strong> เมื่อราคาไม้ในตลาดโลกขยับขึ้น +20% การมีสัดส่วนต้นทุนไม้ (Wood Cost Share) ที่ประมาณ 25% จะส่งผลกระทบต่อราคาขายสุทธิเพียง +5% เท่านั้น ช่วยให้ลูกค้าเข้าใจและยอมรับโครงสร้างราคาได้
            </p>
            <p className="text-xs text-mochi-brown/70 italic">
              * ตัวเลขนี้เป็นการคำนวณเพื่อสาธิตแนวคิดจากสถิติ Benchmark ของ IKEA และ World Bank ไม่ใช่ราคาขายจริงของบริษัท
            </p>
          </>
        }
      >
        <div className="mochi-card bg-gradient-to-br from-white via-mochi-cream to-mochi-pink-light/30 border-mochi-lavender">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Controls */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <label className="text-xs font-semibold text-mochi-brown-dark block mb-1">
                  1. เลือกหมวดหมู่เฟอร์นิเจอร์
                </label>
                <select
                  value={simCategory}
                  onChange={e => setSimCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-mochi-sm bg-white border border-mochi-lavender text-sm font-medium text-mochi-brown focus:outline-none focus:ring-2 focus:ring-mochi-pink"
                >
                  {pricingModel &&
                    Object.keys(pricingModel.categories).map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              {/* Dimensions: W x D x H */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-mochi-brown-dark flex justify-between">
                  <span>2. ขนาดเฟอร์นิเจอร์ (กว้าง × ลึก × สูง)</span>
                  <span className="text-mochi-wood-dark">
                    ปริมาตร: {simResults?.volume_m3} m³ | พื้นที่วาง: {simResults?.footprint_m2} m²
                  </span>
                </div>

                {/* Width */}
                <div>
                  <div className="flex justify-between text-xs text-mochi-brown/70 mb-1">
                    <span>ความกว้าง (Width)</span>
                    <span className="font-semibold text-mochi-brown-dark">{simWidth} ซม.</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="240"
                    step="5"
                    value={simWidth}
                    onChange={e => setSimWidth(parseInt(e.target.value))}
                    className="w-full accent-mochi-pink cursor-pointer"
                  />
                </div>

                {/* Depth */}
                <div>
                  <div className="flex justify-between text-xs text-mochi-brown/70 mb-1">
                    <span>ความลึก (Depth)</span>
                    <span className="font-semibold text-mochi-brown-dark">{simDepth} ซม.</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="120"
                    step="5"
                    value={simDepth}
                    onChange={e => setSimDepth(parseInt(e.target.value))}
                    className="w-full accent-mochi-pink cursor-pointer"
                  />
                </div>

                {/* Height */}
                <div>
                  <div className="flex justify-between text-xs text-mochi-brown/70 mb-1">
                    <span>ความสูง (Height)</span>
                    <span className="font-semibold text-mochi-brown-dark">{simHeight} ซม.</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="240"
                    step="5"
                    value={simHeight}
                    onChange={e => setSimHeight(parseInt(e.target.value))}
                    className="w-full accent-mochi-pink cursor-pointer"
                  />
                </div>
              </div>

              {/* Wood Price Change Slider */}
              <div className="pt-2 border-t border-mochi-lavender/40">
                <div className="flex justify-between text-xs font-semibold text-mochi-brown-dark mb-1">
                  <span>3. สมมติราคาไม้ในตลาดเปลี่ยนแปลง (%):</span>
                  <span className={simWoodChangePct > 0 ? 'text-rose-700' : simWoodChangePct < 0 ? 'text-emerald-700' : 'text-mochi-brown'}>
                    {formatPct(simWoodChangePct)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="5"
                  value={simWoodChangePct}
                  onChange={e => setSimWoodChangePct(parseInt(e.target.value))}
                  className="w-full accent-mochi-wood cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-mochi-brown/50 mt-0.5">
                  <span>-30% (ไม้ถูกลง)</span>
                  <span>0% (ราคาปัจจุบัน)</span>
                  <span>+30% (ไม้แพงขึ้น)</span>
                </div>
              </div>
            </div>

            {/* Right Output Card */}
            <div className="lg:col-span-6 flex flex-col justify-between p-6 rounded-mochi bg-white border border-mochi-pink/60 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-mochi-brown/70">
                    ราคาประมาณการแบบจำลอง (Estimated Price)
                  </span>
                  <DataBadge type="assumption" label="จำลองเพื่อสาธิต" size="sm" />
                </div>

                {/* Big Price */}
                <div className="mb-2">
                  <div className="text-4xl sm:text-5xl font-display font-bold text-mochi-brown-dark">
                    {formatCurrency(simResults?.adjustedPrice, currency, 0)}
                  </div>
                  {simWoodChangePct !== 0 && (
                    <div className="text-xs font-medium text-mochi-wood-dark mt-1">
                      ราคาฐานเดิม: {formatCurrency(simResults?.basePrice, currency, 0)} (ผลกระทบจากราคาไม้{' '}
                      {formatCurrency(simResults?.deltaPrice, currency, 0)})
                    </div>
                  )}
                </div>

                {/* Confidence / Uncertainty Range */}
                <div className="p-3.5 rounded-mochi-sm bg-mochi-lavender-light/60 border border-mochi-lavender/40 mt-4 text-xs space-y-1">
                  <div className="font-semibold text-mochi-brown-dark flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-mochi-pink-deep" />
                    ช่วงราคาอ้างอิงตามระดับความประณีต (p25 – p75 IQR)
                  </div>
                  <div className="text-sm font-bold text-mochi-brown">
                    {formatCurrency(simResults?.adjustedP25, currency, 0)} — {formatCurrency(simResults?.adjustedP75, currency, 0)}
                  </div>
                  <div className="text-[11px] text-mochi-brown/60 pt-0.5">
                    คำนวณจากช่วงเบี่ยงเบนควอร์ไทล์ที่ 25 ถึง 75 ของราคาต่อลูกบาศก์เมตรในหมวด {simCategory}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-mochi-lavender/30 flex items-center justify-between">
                <span className="text-xs text-mochi-brown/60">
                  ต้องการปรับพารามิเตอร์ลึกและเลือกชนิดไม้?
                </span>
                <Link
                  to="/price-lab"
                  className="mochi-button-primary text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  <span>เปิดเต็มรูปแบบ</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* ========================================================
          CHAPTER 5: BACK-OFFICE OPERATIONS (SIMULATED DATA)
          ======================================================== */}
      <ChapterSection
        id="ch-5"
        chapterNumber={5}
        title="หลังบ้านต้องไหว: การจัดส่ง ติดตั้ง และความพึงพอใจลูกค้า"
        subtitle="ตัวอย่างต้นแบบแดชบอร์ดติดตามคุณภาพงานจัดส่งและบริการประกอบเฟอร์นิเจอร์ สำหรับทีมปฏิบัติการ"
        dataType="simulated"
        dataLabel="ข้อมูลจำลอง (Simulated)"
        bmcReference="Key Activities & Weakness (การคุมคุณภาพและเวลาส่งมอบ)"
        soWhatContent={
          <>
            <p>
              <strong>1. ลูกค้าต้องการช่างประกอบถึงบ้าน:</strong> ในข้อมูลจำลองมีลูกค้าถึง <strong>{retailerData?.assembly_requested_rate_pct}%</strong> ที่เลือกบริการประกอบติดตั้ง สะท้อนสมมติฐานสำคัญของ Mochi Kagu ว่า "การบริการติดตั้งถึงบ้าน" เป็นส่วนประกอบสำคัญที่ขาดไม่ได้ในการปิดการขาย
            </p>
            <p>
              <strong>2. การจัดส่งล่าช้ากระทบเรตติ้งโดยตรง:</strong> ในโมเดลปฏิบัติการ เมื่อระยะเวลาจัดส่งยืดออกไปเกิน 14 วัน คะแนนความพึงพอใจมีแนวโน้มลดลงอย่างชัดเจน Mochi Kagu จึงต้องร่วมมือกับพันธมิตรขนส่งที่มี SLA แน่นอน
            </p>
            <p className="text-xs font-semibold text-amber-800 bg-amber-100/70 p-2 rounded-mochi-sm border border-amber-300">
              ⚠️ ข้อจำกัดสำคัญ: ข้อมูลในบทนี้เป็นชุดข้อมูลสังเคราะห์ (Synthetic Dataset) จาก Kaggle เพื่อสาธิตหน้าจอควบคุมของแดชบอร์ดหลังบ้านเท่านั้น ห้ามนำตัวเลขความล่าช้าไปอ้างว่าเป็นสถิติการจัดส่งจริงในตลาด
            </p>
          </>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Chart: Orders by Delivery Status */}
          <div className="lg:col-span-6">
            <ChartCard
              title="สัดส่วนสถานะการจัดส่งคำสั่งซื้อ"
              subtitle="จำลองสถานะออเดอร์ในระบบปฏิบัติการ (1,938 รายการ)"
              unit="เปอร์เซ็นต์ (%)"
              source="Kaggle Online Furniture Orders (ข้อมูลสังเคราะห์ / Synthetic)"
              dataType="simulated"
            >
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={retailerData?.orders_by_status}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      innerRadius={50}
                      paddingAngle={3}
                    >
                      {retailerData?.orders_by_status.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number, name: string) => [`${val} ออเดอร์`, name]}
                      contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #D9CBE8' }}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Right Chart: Rating by Delivery Window */}
          <div className="lg:col-span-6">
            <ChartCard
              title="คะแนนรีวิวเฉลี่ยเทียบกับระยะเวลาจัดส่ง"
              subtitle="ความพึงพอใจลูกค้าตามความรวดเร็วในการส่งมอบสินค้า"
              unit="คะแนนเฉลี่ย (เต็ม 5.0)"
              source="Kaggle Online Furniture Orders (ข้อมูลสังเคราะห์ / Synthetic)"
              dataType="simulated"
            >
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={retailerData?.rating_by_delivery_window}
                    margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEE6F5" vertical={false} />
                    <XAxis dataKey="bucket" tick={{ fill: '#593432', fontSize: 11 }} />
                    <YAxis domain={[0, 5]} tick={{ fill: '#593432', fontSize: 11 }} />
                    <Tooltip
                      formatter={(val: number) => [`${val} / 5.0`, 'เรตติ้งเฉลี่ย']}
                      contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #D9CBE8' }}
                    />
                    <Bar dataKey="avg_rating" fill="#9F82B8" radius={[8, 8, 0, 0]}>
                      {retailerData?.rating_by_delivery_window.map((entry, index) => (
                        <Cell
                          key={`cell-rat-${index}`}
                          fill={index === 0 ? '#C79B6E' : index === 3 ? '#E07897' : '#9F82B8'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      </ChapterSection>

      {/* ========================================================
          CHAPTER 6: STRATEGIC CONCLUSION & LIMITATIONS
          ======================================================== */}
      <ChapterSection
        id="ch-6"
        chapterNumber={6}
        title="บทสรุปเชิงกลยุทธ์และข้อจำกัดของแดชบอร์ด"
        subtitle="ข้อเสนอแนะเชิงธุรกิจ 3 ประการสำหรับ Mochi Kagu และข้อพึงระวังในการตีความข้อมูล"
        dataType="real"
        dataLabel="การสังเคราะห์เชิงกลยุทธ์"
        bmcReference="Business Model Synthesis"
        soWhatTitle="ข้อสรุปเชิงคุณค่า (Value Proposition)"
        soWhatContent={
          <p>
            การนำข้อมูลสถิติขนาด ปริมาตร และต้นทุนไม้มาผสานกับโมเดล AI Co-Design ทำให้ Mochi Kagu สามารถแก้ปัญหาความเจ็บปวด (Pain Point) ของกลุ่มคนเมืองที่มีพื้นที่จำกัด และเปลี่ยนความกลัวเรื่องงบบานปลายให้กลายเป็นความโปร่งใสที่ตรวจสอบได้
          </p>
        }
      >
        {/* 3 Strategic BMC Takeaways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="mochi-card bg-white border-t-4 border-t-mochi-pink">
            <div className="flex items-center gap-2 mb-2 text-mochi-pink-deep font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>1. Value Proposition</span>
            </div>
            <h4 className="font-display font-semibold text-base text-mochi-brown-dark mb-2">
              คุมขนาดพอดีห้อง คุมงบได้จริง
            </h4>
            <p className="text-xs sm:text-sm text-mochi-brown/80 leading-relaxed">
              ตอบโจทย์ห้องชุดขนาดกะทัดรัดด้วยเฟอร์นิเจอร์ที่ขนาดตรงสเปก และราคาคิดตามปริมาตรจริง โดยมี Median Benchmark ของตลาด (545 SAR / ~5,041 บาท) เป็นเพดานอ้างอิง
            </p>
          </div>

          {/* Card 2 */}
          <div className="mochi-card bg-white border-t-4 border-t-mochi-wood">
            <div className="flex items-center gap-2 mb-2 text-mochi-wood-dark font-semibold text-xs uppercase tracking-wider">
              <TreePine className="w-4 h-4" />
              <span>2. Cost Structure</span>
            </div>
            <h4 className="font-display font-semibold text-base text-mochi-brown-dark mb-2">
              ตั้งราคายืดหยุ่น บริหารสต็อกไม้
            </h4>
            <p className="text-xs sm:text-sm text-mochi-brown/80 leading-relaxed">
              รับมือความผันผวนของราคาไม้โลก (ซึ่งเคยแกว่งตัวกว้างกว่า $371/m³) ด้วยอัลกอริทึมสะท้อนราคาไม้รายไตรมาส และการกระจายความเสี่ยงด้วยวัสดุไม้อัดทดแทน
            </p>
          </div>

          {/* Card 3 */}
          <div className="mochi-card bg-white border-t-4 border-t-mochi-lavender-dark">
            <div className="flex items-center gap-2 mb-2 text-mochi-lavender-deep font-semibold text-xs uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>3. Key Partners</span>
            </div>
            <h4 className="font-display font-semibold text-base text-mochi-brown-dark mb-2">
              พึ่งพาฐานช่างไม้และโรงงานไทย
            </h4>
            <p className="text-xs sm:text-sm text-mochi-brown/80 leading-relaxed">
              ใช้ประโยชน์จากอุตสาหกรรมส่งออกเฟอร์นิเจอร์ไทยที่มีมูลค่ากว่า 1.3 พันล้านดอลลาร์ โดยทำสัญญาเป็นพันธมิตร OEM รับผลิตตามแบบจำลอง 3D โดยไม่ต้องสต็อกสินค้าสำเร็จรูป
            </p>
          </div>
        </div>

        {/* Dashboard Limitations Warning Box */}
        <div className="p-6 rounded-mochi bg-amber-50/80 border border-amber-300 text-xs sm:text-sm text-mochi-brown-dark space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-display font-bold text-base">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <span>ข้อจำกัดและข้อควรระวังของ Dashboard นี้ (Dashboard Limitations)</span>
          </div>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-amber-950/90 leading-relaxed">
            <li>
              <strong>ข้อมูล IKEA เป็นของสาขาซาอุดีอาระเบีย ปี 2020:</strong> โครงสร้างราคาและค่าเงิน SAR อาจมีความแตกต่างจากตลาดเฟอร์นิเจอร์ในประเทศไทย
            </li>
            <li>
              <strong>ข้อมูลการจัดส่งและรีวิวเป็นข้อมูลจำลอง (Synthetic):</strong> ตัวเลขในบทที่ 5 จัดทำขึ้นเพื่อสาธิตแนวคิดการออกแบบระบบหลังบ้านเท่านั้น ไม่ใช่ผลสำรวจพฤติกรรมจริงในตลาด
            </li>
            <li>
              <strong>ข้อมูลส่งออกเฟอร์นิเจอร์ไทยสิ้นสุด ณ ต.ค. 2567:</strong> ยังไม่มีการประมวลผลข้อมูลส่งออกของปี 2568–2569 จึงสะท้อนบริบทในอดีต
            </li>
            <li>
              <strong>ข้อมูล REIC เป็นข้อมูลทุติยภูมิจากข่าวเศรษฐกิจ:</strong> ผู้ใช้งานควรตรวจสอบเอกสารรายงานวิจัยฉบับเต็มโดยตรงจากศูนย์ข้อมูลอสังหาริมทรัพย์ ธนาคารอาคารสงเคราะห์
            </li>
            <li>
              <strong>สัดส่วนต้นทุนไม้ (25%) และอัตราแลกเปลี่ยน (9.25 บาท/SAR) เป็นสมมติฐาน:</strong> สามารถปรับเปลี่ยนได้ในหน้าเครื่องมือ Price Lab
            </li>
          </ul>
        </div>

        {/* Action Buttons to explore further */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/explorer"
            className="mochi-button-wood px-6 py-3 text-sm flex items-center gap-2"
          >
            <span>สำรวจตารางสินค้าละเอียด (Data Explorer)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            to="/price-lab"
            className="mochi-button-primary px-6 py-3 text-sm flex items-center gap-2"
          >
            <span>ทดลองคำนวณราคาเต็ม (Price Lab)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            to="/data"
            className="mochi-button-secondary px-6 py-3 text-sm flex items-center gap-2"
          >
            <span>อ่าน Data Dictionary & แหล่งข้อมูล</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </ChapterSection>
    </div>
  );
};
