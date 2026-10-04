/**
 * Mochi Kagu Configuration & Financial Assumptions
 * 
 * ข้อกำหนดสำคัญ:
 * - อัตราแลกเปลี่ยนเก็บเป็นค่าคงที่ในไฟล์นี้ไฟล์เดียว
 * - อัตรานี้เป็น "สมมติฐานที่ต้องอัปเดตตามอัตราตลาดจริง" ไม่ใช่ข้อมูลจากชุดข้อมูลดิบ
 * - บันทึกวันที่อัปเดตล่าสุด: 5 ตุลาคม 2569 (2026-10-05)
 */

export const CONFIG = {
  // สมมติฐานอัตราแลกเปลี่ยน 1 SAR (Saudi Riyal) = 9.25 THB (บาท)
  // อ้างอิงอัตราแลกเปลี่ยนเฉลี่ยสำหรับแปลงข้อมูล IKEA ซาอุฯ
  SAR_TO_THB: 9.25,

  // อัตราแลกเปลี่ยน USD to THB สำหรับแปลงราคา Pink Sheet และ Retailer
  USD_TO_THB: 34.50,

  // วันที่อัปเดตสมมติฐานล่าสุด
  FX_LAST_UPDATED: '2026-10-05',

  // ค่าสมมติฐานสัดส่วนต้นทุนไม้ในราคาเฟอร์นิเจอร์ (Wood Cost Share)
  DEFAULT_WOOD_COST_SHARE: 0.25, // 25%

  // แบรนด์และข้อมูลโปรเจกต์
  BRAND_NAME: 'Mochi Kagu',
  BRAND_TAGLINE: 'เฟอร์นิเจอร์ Custom นุ่มนวล ยืดหยุ่น คุมงบได้จริง ด้วย AI Co-Design & 3D',
  COURSE_NAME: '89033267 Data Warehousing Concepts and Design',
  PARENT_COURSE: '89035064 Business Model Creation',
  DEVELOPER_NAME: 'นางสาวเอมิกา อยู่พันธ์',
  STUDENT_ID: '67160244',
};

export type CurrencyMode = 'THB' | 'SAR' | 'USD';

/**
 * Format currency with proper locale and symbol
 */
export function formatCurrency(
  value: number | null | undefined,
  currency: CurrencyMode = 'THB',
  decimals = 0
): string {
  if (value === null || value === undefined || isNaN(value)) return '-';

  if (currency === 'THB') {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: decimals,
    }).format(value);
  }

  if (currency === 'SAR') {
    return `${new Intl.NumberFormat('en-US', {
      maximumFractionDigits: decimals,
    }).format(value)} SAR`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Convert SAR to THB using configured exchange rate
 */
export function sarToThb(sarValue: number | null | undefined): number | null {
  if (sarValue === null || sarValue === undefined || isNaN(sarValue)) return null;
  return Number((sarValue * CONFIG.SAR_TO_THB).toFixed(0));
}

/**
 * Format general numbers with commas
 */
export function formatNumber(value: number | null | undefined, decimals = 0): string {
  if (value === null || value === undefined || isNaN(value)) return '-';
  return new Intl.NumberFormat('th-TH', {
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format percentages with + / - sign
 */
export function formatPct(value: number | null | undefined, showPlus = true, decimals = 1): string {
  if (value === null || value === undefined || isNaN(value)) return '-';
  const prefix = showPlus && value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(decimals)}%`;
}
