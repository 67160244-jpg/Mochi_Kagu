import React, { useState, useEffect, useMemo } from 'react';
import { loadIkeaClean, loadIkeaSummary } from '../data/dataLoader';
import { IkeaItem, CategorySummary } from '../data/types';
import { DataBadge } from '../components/DataBadge';
import {
  CurrencyMode,
  formatCurrency,
  formatNumber,
  sarToThb,
  CONFIG,
} from '../config/fx';
import {
  Search,
  Filter,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  SlidersHorizontal,
  Table as TableIcon,
} from 'lucide-react';

interface ExplorerPageProps {
  currency: CurrencyMode;
}

export const ExplorerPage: React.FC<ExplorerPageProps> = ({ currency }) => {
  const [items, setItems] = useState<IkeaItem[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyMainFurniture, setOnlyMainFurniture] = useState<boolean>(true);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [maxFootprint, setMaxFootprint] = useState<number>(4.0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    async function loadData() {
      try {
        const [cleanItems, catSummary] = await Promise.all([
          loadIkeaClean(),
          loadIkeaSummary(),
        ]);
        setItems(cleanItems);
        setCategories(catSummary);
      } catch (err) {
        console.error('Error loading explorer data:', err);
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

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Main furniture filter
      if (onlyMainFurniture && !item.is_main_furniture) return false;

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Price filter
      const priceSar = item.price;
      if (priceSar !== null && priceSar > maxPrice) return false;

      // Footprint filter
      if (item.footprint_m2 !== null && item.footprint_m2 > maxFootprint) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.short_description.toLowerCase().includes(q);
        const matchDesigner = item.designer.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchDesigner && !matchCat) return false;
      }

      return true;
    });
  }, [items, onlyMainFurniture, selectedCategory, maxPrice, maxFootprint, searchQuery]);

  // Summary stats for filtered set
  const filteredStats = useMemo(() => {
    if (!filteredItems.length) return null;
    const prices = filteredItems.map(i => i.price).sort((a, b) => a - b);
    const footprints = filteredItems.map(i => i.footprint_m2).filter((f): f is number => f !== null).sort((a, b) => a - b);
    const medPriceSar = prices[Math.floor(prices.length / 2)];
    const medFootprint = footprints.length ? footprints[Math.floor(footprints.length / 2)] : 0;

    return {
      count: filteredItems.length,
      medianPrice: getPrice(medPriceSar),
      medianFootprint: Number(medFootprint.toFixed(2)),
    };
  }, [filteredItems, currency]);

  // Paginated items
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, onlyMainFurniture, maxPrice, maxFootprint, searchQuery]);

  // CSV Export handler
  const handleExportCsv = () => {
    const headers = [
      'item_id',
      'name',
      'category',
      'price_sar',
      'price_thb_estimated',
      'width_cm',
      'depth_cm',
      'height_cm',
      'footprint_m2',
      'volume_m3',
      'price_per_m3_sar',
      'is_main_furniture',
      'designer',
    ];

    const rows = filteredItems.map(item => [
      `"${item.item_id}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.category.replace(/"/g, '""')}"`,
      item.price,
      sarToThb(item.price),
      item.width || '',
      item.depth || '',
      item.height || '',
      item.footprint_m2 || '',
      item.volume_m3 || '',
      item.price_per_m3 || '',
      item.is_main_furniture,
      `"${item.designer.replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mochi_kagu_ikea_filtered_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="text-3xl animate-bounce mb-3">🔍</div>
        <div className="font-display font-medium text-lg text-mochi-brown">
          กำลังเตรียมฐานข้อมูลเฟอร์นิเจอร์ Benchmark 3,694 ชิ้น...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <DataBadge type="real" label="ข้อมูลจริง: IKEA Saudi Arabia" />
          <span className="text-xs text-mochi-brown/60">
            * อ้างอิง TidyTuesday (พ.ย. 2020)
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-mochi-brown-dark tracking-tight">
          สำรวจข้อมูลเฟอร์นิเจอร์ (Data Explorer)
        </h1>
        <p className="mt-2 text-sm sm:text-base text-mochi-brown/80 max-w-3xl leading-relaxed">
          ค้นหา กรอง และเปรียบเทียบขนาด พื้นที่จัดวาง (Footprint) ปริมาตร และราคาเฟอร์นิเจอร์ benchmark เพื่อใช้เป็นข้อมูลอ้างอิงในการออกแบบ Custom ของ Mochi Kagu
        </p>
      </div>

      {/* Filter Card */}
      <div className="mochi-card bg-white mb-8 border-mochi-lavender">
        <div className="flex items-center gap-2 font-display font-semibold text-mochi-brown-dark mb-4 text-sm">
          <SlidersHorizontal className="w-4 h-4 text-mochi-wood-dark" />
          <span>ตัวกรองการสำรวจข้อมูล (Data Filters)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search Box */}
          <div>
            <label className="text-xs font-semibold text-mochi-brown-dark block mb-1">
              ค้นหาชื่อ / นักออกแบบ / คำอธิบาย
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="เช่น KALLAX, desk, wood..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-mochi-sm bg-mochi-lavender-light/40 border border-mochi-lavender text-xs text-mochi-brown focus:outline-none focus:ring-2 focus:ring-mochi-pink"
              />
              <Search className="w-4 h-4 text-mochi-brown/50 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="text-xs font-semibold text-mochi-brown-dark block mb-1">
              หมวดหมู่เฟอร์นิเจอร์
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-mochi-sm bg-mochi-lavender-light/40 border border-mochi-lavender text-xs text-mochi-brown focus:outline-none focus:ring-2 focus:ring-mochi-pink"
            >
              <option value="all">ทุกหมวดหมู่ ({items.length} ชิ้น)</option>
              {categories.map(c => (
                <option key={c.category} value={c.category}>
                  {c.category} ({c.total_items} ชิ้น)
                </option>
              ))}
            </select>
          </div>

          {/* Max Footprint Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-mochi-brown-dark mb-1">
              <span>ขนาดพื้นที่วาง (Footprint)</span>
              <span className="text-mochi-wood-dark font-bold">≤ {maxFootprint.toFixed(1)} m²</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="5.0"
              step="0.1"
              value={maxFootprint}
              onChange={e => setMaxFootprint(parseFloat(e.target.value))}
              className="w-full accent-mochi-pink cursor-pointer mt-1"
            />
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-mochi-brown-dark mb-1">
              <span>ราคาสูงสุด</span>
              <span className="text-mochi-pink-deep font-bold">
                ≤ {formatCurrency(getPrice(maxPrice), currency, 0)}
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="10000"
              step="200"
              value={maxPrice}
              onChange={e => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-mochi-wood cursor-pointer mt-1"
            />
          </div>
        </div>

        {/* Bottom row: Checkbox & Export Button */}
        <div className="pt-3 border-t border-mochi-lavender/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyMainFurniture}
              onChange={e => setOnlyMainFurniture(e.target.checked)}
              className="rounded accent-mochi-pink w-4 h-4"
            />
            <span className="text-mochi-brown font-medium">
              แสดงเฉพาะเฟอร์นิเจอร์หลัก (มีมิติครบ 3 ด้าน, ราคา ≥ 50 SAR และไม่ใช่อุปกรณ์เสริม)
            </span>
          </label>

          <button
            type="button"
            onClick={handleExportCsv}
            className="mochi-button-secondary text-xs px-3.5 py-1.5 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-mochi-wood-dark" />
            <span>ดาวน์โหลด CSV ที่กรองแล้ว ({filteredItems.length} แถว)</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Pills */}
      {filteredStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-xs">
          <div className="p-3 rounded-mochi-sm bg-white border border-mochi-lavender/50 shadow-2xs">
            <div className="text-mochi-brown/70">จำนวนสินค้าที่พบ</div>
            <div className="text-lg font-bold text-mochi-brown-dark mt-0.5">
              {formatNumber(filteredStats.count)} ชิ้น
            </div>
          </div>
          <div className="p-3 rounded-mochi-sm bg-white border border-mochi-lavender/50 shadow-2xs">
            <div className="text-mochi-brown/70">ราคา Median</div>
            <div className="text-lg font-bold text-mochi-pink-deep mt-0.5">
              {formatCurrency(filteredStats.medianPrice, currency, 0)}
            </div>
          </div>
          <div className="p-3 rounded-mochi-sm bg-white border border-mochi-lavender/50 shadow-2xs">
            <div className="text-mochi-brown/70">Footprint Median</div>
            <div className="text-lg font-bold text-mochi-wood-dark mt-0.5">
              {filteredStats.medianFootprint} m²
            </div>
          </div>
          <div className="p-3 rounded-mochi-sm bg-white border border-mochi-lavender/50 shadow-2xs">
            <div className="text-mochi-brown/70">สกุลเงินแสดงผล</div>
            <div className="text-lg font-bold text-mochi-brown-dark mt-0.5">
              {currency === 'THB' ? 'บาทไทย (THB)' : 'ริยาลซาอุฯ (SAR)'}
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="mochi-card p-0 overflow-hidden bg-white border-mochi-lavender">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-mochi-lavender-light/70 text-mochi-brown-dark font-display font-semibold border-b border-mochi-lavender">
              <tr>
                <th className="py-3 px-4">ชื่อสินค้า</th>
                <th className="py-3 px-4">หมวดหมู่</th>
                <th className="py-3 px-4">ขนาด (ก × ล × ส)</th>
                <th className="py-3 px-4">Footprint</th>
                <th className="py-3 px-4">ปริมาตร</th>
                <th className="py-3 px-4 text-right">ราคา ({currency})</th>
                <th className="py-3 px-4 text-center">ลิงก์ต้นฉบับ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mochi-lavender/30">
              {paginatedItems.map(item => (
                <tr key={item.id} className="hover:bg-mochi-cream/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-mochi-brown-dark">{item.name}</div>
                    <div className="text-[11px] text-mochi-brown/60 truncate max-w-xs" title={item.short_description}>
                      {item.short_description || item.designer || '-'}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-mochi-brown/80">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-mochi-brown/80">
                    {item.width && item.depth && item.height
                      ? `${item.width} × ${item.depth} × ${item.height} cm`
                      : '-'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-medium text-mochi-wood-dark">
                    {item.footprint_m2 ? `${item.footprint_m2} m²` : '-'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-mochi-brown/70">
                    {item.volume_m3 ? `${item.volume_m3} m³` : '-'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right font-bold text-mochi-brown-dark">
                    {formatCurrency(getPrice(item.price), currency, 0)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-center">
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-mochi-wood-dark hover:text-mochi-pink-deep p-1 rounded hover:bg-mochi-lavender-light"
                        title="เปิดหน้าสินค้า IKEA ซาอุฯ"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}

              {paginatedItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-mochi-brown/60">
                    ไม่พบรายการที่ตรงกับเงื่อนไขตัวกรอง กรุณาลองปรับเปลี่ยนเงื่อนไข
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-mochi-lavender-light/30 border-t border-mochi-lavender/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-mochi-brown/70">
          <div>
            แสดง {filteredItems.length ? (currentPage - 1) * pageSize + 1 : 0} ถึง{' '}
            {Math.min(currentPage * pageSize, filteredItems.length)} จากทั้งหมด {formatNumber(filteredItems.length)} รายการ
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded-mochi-sm bg-white border border-mochi-lavender hover:bg-mochi-lavender-light disabled:opacity-40"
              aria-label="หน้าก่อนหน้า"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-mochi-brown-dark">
              หน้า {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-mochi-sm bg-white border border-mochi-lavender hover:bg-mochi-lavender-light disabled:opacity-40"
              aria-label="หน้าถัดไป"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
