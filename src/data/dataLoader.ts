import {
  IkeaItem,
  CategorySummary,
  TimberMonthlyPayload,
  RetailerSummary,
  ThaiExportData,
  ReicHousingData,
  PricingModel,
} from './types';

const BASE = import.meta.env.BASE_URL;

const cache: Record<string, any> = {};

async function fetchJson<T>(relPath: string): Promise<T> {
  if (cache[relPath]) return cache[relPath] as T;
  const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
  const cleanRel = relPath.startsWith('/') ? relPath.slice(1) : relPath;
  const url = `${cleanBase}${cleanRel}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      // Fallback to direct path if running in certain dev environments
      const fallbackUrl = `/${cleanRel}`;
      const fallbackRes = await fetch(fallbackUrl);
      if (!fallbackRes.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
      const data = await fallbackRes.json();
      cache[relPath] = data;
      return data;
    }
    const data = await res.json();
    cache[relPath] = data;
    return data;
  } catch (err) {
    console.error(`Error loading data from ${url}:`, err);
    throw err;
  }
}

export async function loadIkeaSummary(): Promise<CategorySummary[]> {
  return fetchJson<CategorySummary[]>('data/ikea_category_summary.json');
}

export async function loadIkeaClean(): Promise<IkeaItem[]> {
  return fetchJson<IkeaItem[]>('data/ikea_clean.json');
}

export async function loadTimberMonthly(): Promise<TimberMonthlyPayload> {
  return fetchJson<TimberMonthlyPayload>('data/timber_monthly.json');
}

export async function loadRetailerSummary(): Promise<RetailerSummary> {
  const json = await fetchJson<{ summary: RetailerSummary }>('data/retailer_clean.json');
  return json.summary;
}

export async function loadThaiExport(): Promise<ThaiExportData> {
  return fetchJson<ThaiExportData>('data/thai_furniture_export_manual.json');
}

export async function loadReicHousing(): Promise<ReicHousingData> {
  return fetchJson<ReicHousingData>('data/reic_housing_manual.json');
}

export async function loadPricingModel(): Promise<PricingModel> {
  return fetchJson<PricingModel>('data/pricing_model.json');
}

export async function loadIkeaFilterRules(): Promise<any> {
  return fetchJson<any>('data/ikea_filter_rules.json');
}
