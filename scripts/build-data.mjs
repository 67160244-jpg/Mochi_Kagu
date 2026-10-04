import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const RAW_DIR = path.join(ROOT_DIR, 'data', 'raw');
const PROCESSED_DIR = path.join(ROOT_DIR, 'data', 'processed');
const PUBLIC_DATA_DIR = path.join(ROOT_DIR, 'public', 'data');

// Ensure output directories exist
fs.mkdirSync(PROCESSED_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });

console.log('====================================================');
console.log('🍡 MOCHI KAGU DATA PIPELINE (scripts/build-data.mjs)');
console.log('====================================================');

// Helper to save JSON both to processed and public/data
function saveJson(filename, data) {
  const processedPath = path.join(PROCESSED_DIR, filename);
  const publicPath = path.join(PUBLIC_DATA_DIR, filename);
  const jsonStr = JSON.stringify(data, null, 2);
  fs.writeFileSync(processedPath, jsonStr, 'utf8');
  fs.writeFileSync(publicPath, jsonStr, 'utf8');
  console.log(` Saved: ${filename} (${(jsonStr.length / 1024).toFixed(1)} KB)`);
}

// Percentile helper
function percentile(sortedArr, p) {
  if (sortedArr.length === 0) return null;
  const index = (sortedArr.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  if (lower === upper) return sortedArr[lower];
  return sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight;
}

// Standard deviation
function stdDev(arr) {
  if (arr.length <= 1) return 0;
  const mean = arr.reduce((sum, v) => sum + v, 0) / arr.length;
  const variance = arr.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

// ----------------------------------------------------
// 1. IKEA BENCHMARK PROCESSING (ikea.csv)
// ----------------------------------------------------
console.log('\n--- 1. Processing IKEA dataset (ikea.csv) ---');
const ikeaRawPath = path.join(RAW_DIR, 'ikea.csv');
if (!fs.existsSync(ikeaRawPath)) {
  throw new Error(`ikea.csv not found at ${ikeaRawPath}`);
}

const ikeaCsvRaw = fs.readFileSync(ikeaRawPath, 'utf8');
const ikeaParsed = Papa.parse(ikeaCsvRaw, { header: true, skipEmptyLines: true });
console.log(`Loaded IKEA raw rows: ${ikeaParsed.data.length}`);

const accessoryKeywords = [
  'leg', 'legs', 'knob', 'knobs', 'handle', 'handles', 'castor', 'castors',
  'bracket', 'brackets', 'basket', 'baskets', 'hook', 'hooks', 'attachment',
  'add-on', 'connection', 'fitting', 'shelf support', 'foot', 'feet', 'connector',
  'shelf runner', 'cover', 'cushion', 'pad', 'box', 'insert'
];

let countCompleteDim = 0;
let countPriceUnder50 = 0;
let countAccessories = 0;
let countMainFurniture = 0;

const ikeaClean = ikeaParsed.data.map((row, idx) => {
  const price = parseFloat(row.price);
  const d = parseFloat(row.depth);
  const h = parseFloat(row.height);
  const w = parseFloat(row.width);

  const hasCompleteDim = !isNaN(d) && !isNaN(h) && !isNaN(w) && d > 0 && h > 0 && w > 0;
  if (hasCompleteDim) countCompleteDim++;

  // old_price extraction
  let oldPriceNum = null;
  if (row.old_price && row.old_price !== 'No old price') {
    const match = row.old_price.replace(/,/g, '').match(/[\d.]+/);
    if (match) oldPriceNum = parseFloat(match[0]);
  }

  let discountPct = null;
  if (oldPriceNum && oldPriceNum > price) {
    discountPct = Number((((oldPriceNum - price) / oldPriceNum) * 100).toFixed(1));
  }

  const footprint_m2 = hasCompleteDim ? Number(((w * d) / 10000).toFixed(4)) : null;
  const volume_m3 = hasCompleteDim ? Number(((w * d * h) / 1000000).toFixed(4)) : null;
  const price_per_m3 = (hasCompleteDim && volume_m3 && volume_m3 > 0) ? Number((price / volume_m3).toFixed(2)) : null;

  // Filter rules for is_main_furniture
  const textDesc = `${row.name || ''} ${row.short_description || ''}`.toLowerCase();
  const isAccessory = accessoryKeywords.some(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    return regex.test(textDesc);
  });

  if (hasCompleteDim) {
    if (price < 50) countPriceUnder50++;
    if (isAccessory) countAccessories++;
  }

  const is_main_furniture = hasCompleteDim && price >= 50 && !isAccessory;
  if (is_main_furniture) countMainFurniture++;

  return {
    id: idx + 1,
    item_id: (row.item_id || '').trim(),
    name: (row.name || '').trim(),
    category: (row.category || '').trim(),
    price: !isNaN(price) ? price : null,
    old_price: (row.old_price || '').trim(),
    old_price_num: oldPriceNum,
    discount_pct: discountPct,
    sellable_online: String(row.sellable_online).trim().toLowerCase() === 'true',
    other_colors: String(row.other_colors).trim().toLowerCase() === 'yes',
    short_description: (row.short_description || '').trim().replace(/\s+/g, ' '),
    designer: (row.designer || '').trim(),
    depth: !isNaN(d) ? d : null,
    height: !isNaN(h) ? h : null,
    width: !isNaN(w) ? w : null,
    footprint_m2,
    volume_m3,
    price_per_m3,
    is_main_furniture,
    link: (row.link || '').trim(),
  };
});

console.log(`IKEA Rows with 3 dimensions: ${countCompleteDim}`);
console.log(`IKEA Main furniture classified: ${countMainFurniture}`);

// Filter rules metadata
const filterRules = {
  total_raw_rows: ikeaClean.length,
  rows_with_complete_dimensions: countCompleteDim,
  rules: [
    {
      rule: "มิติครบ 3 ด้าน (depth > 0, height > 0, width > 0)",
      description: "เพื่อใช้คำนวณพื้นที่จัดวาง (Footprint m²) และปริมาตร (Volume m³)",
      passed_count: countCompleteDim,
      filtered_out: ikeaClean.length - countCompleteDim
    },
    {
      rule: "ราคา >= 50 SAR",
      description: "คัดอุปกรณ์เสริม ชิ้นส่วนขนาดเล็ก เช่น ขาเตียง สกรู ลูกบิด ออกจากการวิเคราะห์เฟอร์นิเจอร์หลัก",
      filtered_out_under_50: countPriceUnder50
    },
    {
      rule: "ไม่ใช่อุปกรณ์เสริม (Accessory exclusion keywords)",
      description: `ตรวจจับคำศัพท์อุปกรณ์เสริมในชื่อหรือคำอธิบาย เช่น ${accessoryKeywords.slice(0, 8).join(', ')} ...`,
      filtered_out_accessories: countAccessories
    }
  ],
  final_main_furniture_count: countMainFurniture,
  note: "เฉพาะรายการที่ผ่านเกณฑ์ทั้งหมดจึงจะได้รับ flag is_main_furniture = true เพื่อนำไปคำนวณ benchmark ราคาต่อลูกบาศก์เมตร"
};

// Category summary for main furniture
const categories = [...new Set(ikeaClean.map(r => r.category))].filter(Boolean).sort();
const categorySummary = categories.map(cat => {
  const catAll = ikeaClean.filter(r => r.category === cat);
  const catMain = catAll.filter(r => r.is_main_furniture);

  const prices = catMain.map(r => r.price).sort((a, b) => a - b);
  const footprints = catMain.map(r => r.footprint_m2).sort((a, b) => a - b);
  const pricesPerM3 = catMain.map(r => r.price_per_m3).sort((a, b) => a - b);

  return {
    category: cat,
    total_items: catAll.length,
    main_items: catMain.length,
    price_median: percentile(prices, 0.5) !== null ? Math.round(percentile(prices, 0.5)) : null,
    price_p25: percentile(prices, 0.25) !== null ? Math.round(percentile(prices, 0.25)) : null,
    price_p75: percentile(prices, 0.75) !== null ? Math.round(percentile(prices, 0.75)) : null,
    price_min: prices.length > 0 ? prices[0] : null,
    price_max: prices.length > 0 ? prices[prices.length - 1] : null,
    footprint_median: percentile(footprints, 0.5) !== null ? Number(percentile(footprints, 0.5).toFixed(3)) : null,
    footprint_p25: percentile(footprints, 0.25) !== null ? Number(percentile(footprints, 0.25).toFixed(3)) : null,
    footprint_p75: percentile(footprints, 0.75) !== null ? Number(percentile(footprints, 0.75).toFixed(3)) : null,
    price_per_m3_median: percentile(pricesPerM3, 0.5) !== null ? Math.round(percentile(pricesPerM3, 0.5)) : null,
    price_per_m3_p25: percentile(pricesPerM3, 0.25) !== null ? Math.round(percentile(pricesPerM3, 0.25)) : null,
    price_per_m3_p75: percentile(pricesPerM3, 0.75) !== null ? Math.round(percentile(pricesPerM3, 0.75)) : null,
  };
});

saveJson('ikea_clean.json', ikeaClean);
saveJson('ikea_category_summary.json', categorySummary);
saveJson('ikea_filter_rules.json', filterRules);

// ----------------------------------------------------
// 2. WORLD BANK PINK SHEET (Monthly & Annual)
// ----------------------------------------------------
console.log('\n--- 2. Processing World Bank Pink Sheet ---');
const monthlyXlsxPath = path.join(RAW_DIR, 'CMO-Historical-Data-Monthly.xlsx');
const annualXlsxPath = path.join(RAW_DIR, 'CMO-Historical-Data-Annual.xlsx');

const wbMonthly = xlsx.readFile(monthlyXlsxPath);
const wsMonthly = wbMonthly.Sheets['Monthly Prices'];
const monthlyRows = xlsx.utils.sheet_to_json(wsMonthly, { header: 1 });

// Find wood series columns from row 5 (index 4)
const seriesHeaderRow = monthlyRows[4];
const unitHeaderRow = monthlyRows[5];

function findColIndex(nameSubstring) {
  return seriesHeaderRow.findIndex(cell => cell && String(cell).toLowerCase().includes(nameSubstring.toLowerCase()));
}

const colCamLogs = findColIndex('Logs, Cameroon');
const colMalLogs = findColIndex('Logs, Malaysian');
const colCamSawn = findColIndex('Sawnwood, Cameroon');
const colMalSawn = findColIndex('Sawnwood, Malaysian');
const colPlywood = findColIndex('Plywood');

console.log(`Wood series column indices in Monthly Prices:`, {
  Logs_Cameroon: colCamLogs,
  Logs_Malaysian: colMalLogs,
  Sawnwood_Cameroon: colCamSawn,
  Sawnwood_Malaysian: colMalSawn,
  Plywood: colPlywood,
});

if ([colCamLogs, colMalLogs, colCamSawn, colMalSawn, colPlywood].some(idx => idx === -1)) {
  throw new Error('Could not find all 5 wood series columns in Monthly Prices!');
}

function parseVal(v) {
  if (v === null || v === undefined || v === '…' || v === '..' || String(v).trim() === '') return null;
  const n = parseFloat(String(v).replace(/,/g, ''));
  return isNaN(n) ? null : n;
}

// Data starts row index 6
const timberMonthlyData = [];
for (let r = 6; r < monthlyRows.length; r++) {
  const row = monthlyRows[r];
  if (!row || !row[0]) continue;
  const monthCode = String(row[0]).trim(); // e.g. "1960M01"
  if (!monthCode.match(/^\d{4}M\d{2}$/)) continue;

  const year = parseInt(monthCode.slice(0, 4));
  const month = parseInt(monthCode.slice(5, 7));
  const isoDate = `${year}-${String(month).padStart(2, '0')}-01`;

  const logs_cameroon = parseVal(row[colCamLogs]);
  const logs_malaysian = parseVal(row[colMalLogs]);
  const sawnwood_cameroon = parseVal(row[colCamSawn]);
  const sawnwood_malaysian = parseVal(row[colMalSawn]);
  const plywood_cents_sheet = parseVal(row[colPlywood]);

  timberMonthlyData.push({
    code: monthCode,
    date: isoDate,
    year,
    month,
    logs_cameroon,
    logs_malaysian,
    sawnwood_cameroon,
    sawnwood_malaysian,
    plywood_cents_sheet,
    sawnwood_yoy_pct: null,
    sawnwood_volatility_12m: null,
  });
}

// Calculate YoY % and rolling 12m volatility for sawnwood_malaysian
for (let i = 0; i < timberMonthlyData.length; i++) {
  // YoY: compare with i - 12
  if (i >= 12) {
    const prev = timberMonthlyData[i - 12].sawnwood_malaysian;
    const curr = timberMonthlyData[i].sawnwood_malaysian;
    if (prev && curr) {
      timberMonthlyData[i].sawnwood_yoy_pct = Number((((curr - prev) / prev) * 100).toFixed(2));
    }
  }

  // 12m rolling volatility: std dev of month-over-month % changes over last 12 months
  if (i >= 12) {
    const momChanges = [];
    for (let k = i - 11; k <= i; k++) {
      const p = timberMonthlyData[k - 1].sawnwood_malaysian;
      const c = timberMonthlyData[k].sawnwood_malaysian;
      if (p && c) {
        momChanges.push(((c - p) / p) * 100);
      }
    }
    if (momChanges.length >= 8) {
      timberMonthlyData[i].sawnwood_volatility_12m = Number(stdDev(momChanges).toFixed(2));
    }
  }
}

// Verify Reference Values
console.log('\n--- Verifying Monthly Reference Values ---');
const sep2026 = timberMonthlyData.find(d => d.code === '2026M09');
const jan2020 = timberMonthlyData.find(d => d.code === '2020M01');

console.log('Sep 2026 actual in data:', {
  sawnwood_malaysian: sep2026?.sawnwood_malaysian,
  logs_malaysian: sep2026?.logs_malaysian,
  plywood: sep2026?.plywood_cents_sheet,
});
console.log('Jan 2020 actual in data:', {
  sawnwood_malaysian: jan2020?.sawnwood_malaysian,
});

if (!sep2026 || sep2026.sawnwood_malaysian !== 731.3) {
  throw new Error(`Validation failed! Sawnwood Malaysian Sep 2026 must be 731.3, got: ${sep2026?.sawnwood_malaysian}`);
}
if (sep2026.logs_malaysian !== 190.3) {
  throw new Error(`Validation failed! Logs Malaysian Sep 2026 must be 190.3, got: ${sep2026?.logs_malaysian}`);
}
if (sep2026.plywood_cents_sheet !== 349.1) {
  throw new Error(`Validation failed! Plywood Sep 2026 must be 349.1, got: ${sep2026?.plywood_cents_sheet}`);
}
if (!jan2020 || jan2020.sawnwood_malaysian !== 712.6) {
  throw new Error(`Validation failed! Sawnwood Malaysian Jan 2020 must be 712.6, got: ${jan2020?.sawnwood_malaysian}`);
}
console.log(' All Monthly Reference Values match perfectly!');

// KPI Summary for Monthly Timber
const post2000Data = timberMonthlyData.filter(d => d.year >= 2000 && d.sawnwood_malaysian !== null);
const post2000Prices = post2000Data.map(d => d.sawnwood_malaysian);
const minPost2000 = Math.min(...post2000Prices);
const maxPost2000 = Math.max(...post2000Prices);
const maxVolEntry = timberMonthlyData.reduce((max, d) => (d.sawnwood_volatility_12m || 0) > (max.sawnwood_volatility_12m || 0) ? d : max, timberMonthlyData[0]);

const sep2025 = timberMonthlyData.find(d => d.code === '2025M09');
const yoyChangeAmount = (sep2026.sawnwood_malaysian - sep2025.sawnwood_malaysian).toFixed(1);

const timberSummary = {
  latest: {
    period: '2026-09',
    period_label: 'ก.ย. 2026',
    sawnwood_malaysian_usd_m3: sep2026.sawnwood_malaysian,
    logs_malaysian_usd_m3: sep2026.logs_malaysian,
    plywood_cents_sheet: sep2026.plywood_cents_sheet,
    yoy_pct: sep2026.sawnwood_yoy_pct,
    yoy_change_usd: parseFloat(yoyChangeAmount),
    volatility_12m: sep2026.sawnwood_volatility_12m,
  },
  post_2000_stats: {
    min_usd_m3: minPost2000,
    max_usd_m3: maxPost2000,
    range_spread: Math.round(maxPost2000 - minPost2000),
  },
  peak_volatility: {
    period: maxVolEntry.code,
    volatility: maxVolEntry.sawnwood_volatility_12m,
  },
  units: {
    sawnwood_cameroon: 'USD / m³',
    sawnwood_malaysian: 'USD / m³',
    logs_cameroon: 'USD / m³',
    logs_malaysian: 'USD / m³',
    plywood: 'Cents / Sheet',
  }
};

saveJson('timber_monthly.json', {
  summary: timberSummary,
  series: timberMonthlyData,
});

// Process Annual Timber
console.log('\n--- Processing Annual Prices ---');
const wbAnnual = xlsx.readFile(annualXlsxPath);
const wsNominal = wbAnnual.Sheets['Annual Prices (Nominal)'];
const wsReal = wbAnnual.Sheets['Annual Prices (Real)'];

const nominalRows = xlsx.utils.sheet_to_json(wsNominal, { header: 1 });
const realRows = xlsx.utils.sheet_to_json(wsReal, { header: 1 });

const annualHeaderRow = nominalRows[6];
const annColCamLogs = annualHeaderRow.findIndex(c => String(c).includes('Logs, Cameroon'));
const annColMalLogs = annualHeaderRow.findIndex(c => String(c).includes('Logs, Malaysian'));
const annColCamSawn = annualHeaderRow.findIndex(c => String(c).includes('Sawnwood, Cameroon'));
const annColMalSawn = annualHeaderRow.findIndex(c => String(c).includes('Sawnwood, Malaysian'));
const annColPlywood = annualHeaderRow.findIndex(c => String(c).includes('Plywood'));

const annualSeries = [];
for (let r = 8; r < nominalRows.length; r++) {
  const nRow = nominalRows[r];
  const rRow = realRows[r];
  if (!nRow || !nRow[0] || isNaN(Number(nRow[0]))) continue;
  const year = parseInt(nRow[0]);

  annualSeries.push({
    year,
    nominal: {
      sawnwood_malaysian: parseVal(nRow[annColMalSawn]),
      logs_malaysian: parseVal(nRow[annColMalLogs]),
      sawnwood_cameroon: parseVal(nRow[annColCamSawn]),
      logs_cameroon: parseVal(nRow[annColCamLogs]),
      plywood_cents_sheet: parseVal(nRow[annColPlywood]),
    },
    real: {
      sawnwood_malaysian: rRow ? parseVal(rRow[annColMalSawn]) : null,
      logs_malaysian: rRow ? parseVal(rRow[annColMalLogs]) : null,
      sawnwood_cameroon: rRow ? parseVal(rRow[annColCamSawn]) : null,
      logs_cameroon: rRow ? parseVal(rRow[annColCamLogs]) : null,
      plywood_cents_sheet: rRow ? parseVal(rRow[annColPlywood]) : null,
    }
  });
}

// Verify Annual Reference Values (2023: 677.7, 2024: 696.5, 2025: 718.4)
console.log('--- Verifying Annual Reference Values ---');
const ann2023 = annualSeries.find(d => d.year === 2023)?.nominal?.sawnwood_malaysian;
const ann2024 = annualSeries.find(d => d.year === 2024)?.nominal?.sawnwood_malaysian;
const ann2025 = annualSeries.find(d => d.year === 2025)?.nominal?.sawnwood_malaysian;

console.log('Annual Nominal Sawnwood Malaysian in data:', { 2023: ann2023, 2024: ann2024, 2025: ann2025 });

if (ann2023 !== 677.7 || ann2024 !== 696.5 || ann2025 !== 718.4) {
  throw new Error(`Validation failed! Annual values 2023-2025 must be 677.7, 696.5, 718.4`);
}
console.log(' All Annual Reference Values match perfectly!');

saveJson('timber_annual.json', { series: annualSeries });

// ----------------------------------------------------
// 3. RETAILER SYNTHETIC DATASET (online_furniture_retailer.csv)
// ----------------------------------------------------
console.log('\n--- 3. Processing Retailer Dataset (Synthetic) ---');
const retailerRawPath = path.join(RAW_DIR, 'online_furniture_retailer.csv');
const retailerCsvRaw = fs.readFileSync(retailerRawPath, 'utf8');
const retailerParsed = Papa.parse(retailerCsvRaw, { header: true, skipEmptyLines: true });

let missingBrand = 0;
let missingShipping = 0;
let missingAssembly = 0;
let missingRating = 0;
let assemblyRequestedCount = 0;

const retailerCleanRows = retailerParsed.data.map(row => {
  const price = parseVal(row.product_price);
  const ship = parseVal(row.shipping_cost);
  const assCost = parseVal(row.assembly_cost);
  const tot = parseVal(row.total_amount);
  const days = parseVal(row.delivery_window_days);
  const rat = parseVal(row.customer_rating);
  const isAssemblyReq = String(row.assembly_service_requested).toLowerCase() === 'true';

  if (!row.brand || row.brand.trim() === '') missingBrand++;
  if (ship === null) missingShipping++;
  if (assCost === null) missingAssembly++;
  if (rat === null) missingRating++;
  if (isAssemblyReq) assemblyRequestedCount++;

  return {
    order_id: row.order_id,
    customer_id: row.customer_id,
    product_category: row.product_category,
    product_subcategory: row.product_subcategory,
    brand: row.brand ? row.brand.trim() : null,
    delivery_status: row.delivery_status,
    assembly_service_requested: isAssemblyReq,
    payment_method: row.payment_method,
    product_price: price,
    shipping_cost: ship,
    assembly_cost: assCost,
    total_amount: tot,
    delivery_window_days: days,
    customer_rating: rat,
    simulated: true,
  };
});

// Orders by Delivery Status
const statusCounts = {};
retailerCleanRows.forEach(r => {
  statusCounts[r.delivery_status] = (statusCounts[r.delivery_status] || 0) + 1;
});
const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
  status,
  count,
  pct: Number(((count / retailerCleanRows.length) * 100).toFixed(1)),
}));

// Summary by Category
const retCats = [...new Set(retailerCleanRows.map(r => r.product_category))].sort();
const summaryByCategory = retCats.map(cat => {
  const items = retailerCleanRows.filter(r => r.product_category === cat);
  const ships = items.map(r => r.shipping_cost).filter(v => v !== null).sort((a,b)=>a-b);
  const assemblies = items.map(r => r.assembly_cost).filter(v => v !== null).sort((a,b)=>a-b);
  const days = items.map(r => r.delivery_window_days).filter(v => v !== null).sort((a,b)=>a-b);
  const ratings = items.map(r => r.customer_rating).filter(v => v !== null);
  const assReq = items.filter(r => r.assembly_service_requested).length;

  const avg = arr => arr.length ? Number((arr.reduce((s,v)=>s+v,0)/arr.length).toFixed(2)) : null;

  return {
    category: cat,
    total_orders: items.length,
    avg_shipping_cost_usd: avg(ships),
    median_shipping_cost_usd: percentile(ships, 0.5),
    avg_assembly_cost_usd: avg(assemblies),
    median_assembly_cost_usd: percentile(assemblies, 0.5),
    avg_delivery_days: avg(days),
    median_delivery_days: percentile(days, 0.5),
    assembly_requested_pct: Number(((assReq / items.length) * 100).toFixed(1)),
    avg_customer_rating: avg(ratings),
  };
});

// Rating by delivery window bucket
const windowBuckets = [
  { label: 'เร็วมาก (1–3 วัน)', min: 1, max: 3 },
  { label: 'มาตรฐาน (4–7 วัน)', min: 4, max: 7 },
  { label: 'ปานกลาง (8–14 วัน)', min: 8, max: 14 },
  { label: 'นาน (15+ วัน)', min: 15, max: 999 },
];

const ratingByWindow = windowBuckets.map(b => {
  const matching = retailerCleanRows.filter(r => r.delivery_window_days !== null && r.delivery_window_days >= b.min && r.delivery_window_days <= b.max && r.customer_rating !== null);
  const avg = matching.length ? Number((matching.reduce((s,r)=>s+r.customer_rating,0)/matching.length).toFixed(2)) : null;
  return {
    bucket: b.label,
    order_count: matching.length,
    avg_rating: avg,
  };
});

const retailerSummary = {
  simulated: true,
  data_nature: "Synthetic / Simulated Data (ข้อมูลจำลองสำหรับการออกแบบแดชบอร์ดปฏิบัติการ)",
  total_orders: retailerCleanRows.length,
  missing_values: {
    brand: missingBrand,
    shipping_cost: missingShipping,
    assembly_cost: missingAssembly,
    customer_rating: missingRating,
  },
  assembly_requested_rate_pct: Number(((assemblyRequestedCount / retailerCleanRows.length) * 100).toFixed(2)),
  orders_by_status: ordersByStatus,
  by_category: summaryByCategory,
  rating_by_delivery_window: ratingByWindow,
};

saveJson('retailer_clean.json', {
  summary: retailerSummary,
  sample_orders: retailerCleanRows.slice(0, 100),
});

// ----------------------------------------------------
// 4. PRICING MODEL BENCHMARK (pricing_model.json)
// ----------------------------------------------------
console.log('\n--- 4. Generating Pricing Model Benchmark ---');

// Build category benchmark dictionary from IKEA main furniture
const pricingModelByCategory = {};
categorySummary.forEach(c => {
  if (c.main_items > 0 && c.price_per_m3_median) {
    pricingModelByCategory[c.category] = {
      category: c.category,
      main_items: c.main_items,
      price_per_m3_median: c.price_per_m3_median,
      price_per_m3_p25: c.price_per_m3_p25,
      price_per_m3_p75: c.price_per_m3_p75,
      sample_median_footprint: c.footprint_median,
    };
  }
});

const pricingModel = {
  metadata: {
    description: "โมเดลจำลองราคาตามขนาดและต้นทุนไม้ สำหรับสาธิต Value Proposition ของ Mochi Kagu",
    currency_benchmark: "SAR",
    currency_display_default: "THB",
    benchmark_source: "IKEA Saudi Arabia (Main Furniture Items, 2020)",
    assumption_warning: "ตัวเลขทั้งหมดเป็นการคำนวณประมาณการจาก benchmark เชิงสถิติ ไม่ใช่ราคาขายจริงของสินค้า",
  },
  formula: {
    base_price: "volume_m3 * median_price_per_m3",
    adjusted_price: "base_price * (1 + wood_cost_share * timber_change_pct)",
    uncertainty_range: "[volume_m3 * p25_price_per_m3, volume_m3 * p75_price_per_m3]",
  },
  defaults: {
    wood_cost_share: 0.25,
    wood_cost_share_label: "25% (สมมติฐานสัดส่วนต้นทุนไม้ในราคาขาย)",
    fx_sar_to_thb: 9.25,
    material: "hardwood",
  },
  materials: [
    {
      id: "hardwood",
      name_th: "ไม้เนื้อแข็ง (Solid Hardwood)",
      benchmark_series: "Sawnwood, Malaysian (World Bank)",
      latest_usd_m3: sep2026.sawnwood_malaysian,
      unit: "USD / m³",
      description: "อิงราคาไม้แปรรูป Sawnwood Malaysian ใน Pink Sheet ล่าสุด $731.3/ลบ.ม.",
    },
    {
      id: "plywood",
      name_th: "ไม้อัดเกรดพรีเมียม (Premium Plywood)",
      benchmark_series: "Plywood (World Bank)",
      latest_usd_m3: sep2026.plywood_cents_sheet,
      unit: "Cents / Sheet",
      description: "อิงราคาไม้อัด Plywood ใน Pink Sheet ล่าสุด 349.1 เซนต์/แผ่น",
    }
  ],
  categories: pricingModelByCategory,
};

saveJson('pricing_model.json', pricingModel);

// ----------------------------------------------------
// 5. MANUAL JSON FILES (Thai Furniture Export & REIC)
// ----------------------------------------------------
console.log('\n--- 5. Generating Manual Secondary JSON Files ---');

const thaiExportData = {
  data_type: "secondary",
  source_organization: "กระทรวงพาณิชย์ จัดทำโดย Bangkok Bank Research",
  report_title: "รายงานอุตสาหกรรม: การส่งออกเฟอร์นิเจอร์ไทย",
  report_date: "2024-11-27",
  accessed_date: "2026-10-05",
  note: "ข้อมูลปี พ.ศ. 2567 ตรงกับปี ค.ศ. 2024 (ข้อมูลล่าสุดถึงเดือน ต.ค. 2024)",
  figures: {
    export_value_oct_2024_usd_million: 130.3,
    export_oct_2024_yoy_pct: 11.0,
    export_oct_2024_mom_pct: 2.4,
    export_value_10m_2024_usd_million: 1197.8,
    export_10m_2024_yoy_pct: 7.2,
    export_value_full_year_2023_usd_million: 1357.1,
    annual_peak_2014_2024: {
      year_be: 2564,
      year_ce: 2021,
      value_usd_million: 1671.6,
      note: "ค่าสูงสุดรายปีในช่วง 2557–2567"
    },
    annual_trough_2014_2024: {
      year_be: 2558,
      year_ce: 2015,
      value_usd_million: 1050.9,
      note: "ค่าต่ำสุดรายปีในช่วง 2557–2567"
    },
    annual_avg_growth_pct: 1.4,
    cagr_pct: 0.9,
    top_5_export_markets: [
      { rank: 1, country: "สหรัฐอเมริกา" },
      { rank: 2, country: "ญี่ปุ่น" },
      { rank: 3, country: "จีน" },
      { rank: 4, country: "มาเลเซีย" },
      { rank: 5, country: "ออสเตรเลีย" },
    ],
    annual_history: [
      { year_ce: 2015, year_be: 2558, value: 1050.9, note: "จุดต่ำสุดรอบ 10 ปี" },
      { year_ce: 2021, year_be: 2564, value: 1671.6, note: "จุดสูงสุดรอบ 10 ปี (ยุค Work-from-Home)" },
      { year_ce: 2023, year_be: 2566, value: 1357.1, note: "มูลค่าทั้งปีล่าสุดที่มีบันทึก" },
      { year_ce: 2024, year_be: 2567, value: 1197.8, note: "10 เดือนแรก 2567 (+7.2% YoY)" }
    ]
  }
};

saveJson('thai_furniture_export_manual.json', thaiExportData);

const reicHousingData = {
  data_type: "secondary_news",
  source_organization: "ศูนย์ข้อมูลอสังหาริมทรัพย์ ธนาคารอาคารสงเคราะห์ (REIC)",
  accessed_date: "2026-10-05",
  note: "ข้อมูลทุติยภูมิที่อ้างอิงจากรายงานข่าวเศรษฐกิจ แนะนำให้ตรวจสอบกับเว็บไซต์ต้นฉบับ https://www.reic.or.th",
  items: {
    q1_2569: {
      period_label: "ไตรมาส 1 ปี 2569",
      new_units: 8370,
      new_units_yoy_pct: -31.1,
      previous_year_units: 12140,
      new_value_million_thb: 59782,
      new_value_yoy_pct: -10.4,
      previous_year_value_million_thb: 66738,
      avg_price_per_unit_thb: 7142413,
      avg_price_per_unit_previous_thb: 5497364,
      avg_price_change_pct: 29.9,
      source_url: "https://www.matichon.co.th/?p=210677",
      strategic_insight: "จำนวนหน่วยเปิดขายลดลงถึง 31.1% แต่มูลค่ารวมลดลงเพียง 10.4% คำนวณได้ว่าราคาเฉลี่ยต่อหน่วยเพิ่มขึ้นประมาณ 29.9% สะท้อนว่าตลาดเน้นที่อยู่อาศัยระดับกลาง-บนขึ้นไปที่มีกำลังซื้อในการตกแต่งห้อง"
    },
    supply_estimate_2568: {
      period_label: "ปี 2568 (ประมาณการ)",
      estimated_units: 52000,
      yoy_pct: -17.0,
      source_url: "https://www.bangkokbiznews.com/property/1211555",
      strategic_insight: "ซัพพลายที่อยู่อาศัยใหม่ใน กทม.-ปริมณฑล มีแนวโน้มชะลอตัว ผู้บริโภคหันมาปรับปรุงและจัดสรรพื้นที่คอนโด/บ้านเดิมที่มีพื้นที่จำกัดให้คุ้มค่าที่สุด"
    }
  }
};

saveJson('reic_housing_manual.json', reicHousingData);

console.log('\n All data processing completed successfully!');
console.log('====================================================\n');
