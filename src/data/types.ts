export interface IkeaItem {
  id: number;
  item_id: string;
  name: string;
  category: string;
  price: number;
  old_price: string;
  old_price_num: number | null;
  discount_pct: number | null;
  sellable_online: boolean;
  other_colors: boolean;
  short_description: string;
  designer: string;
  depth: number | null;
  height: number | null;
  width: number | null;
  footprint_m2: number | null;
  volume_m3: number | null;
  price_per_m3: number | null;
  is_main_furniture: boolean;
  link: string;
}

export interface CategorySummary {
  category: string;
  total_items: number;
  main_items: number;
  price_median: number;
  price_p25: number;
  price_p75: number;
  price_min: number;
  price_max: number;
  footprint_median: number;
  footprint_p25: number;
  footprint_p75: number;
  price_per_m3_median: number;
  price_per_m3_p25: number;
  price_per_m3_p75: number;
}

export interface TimberMonthlyEntry {
  code: string;
  date: string;
  year: number;
  month: number;
  logs_cameroon: number | null;
  logs_malaysian: number | null;
  sawnwood_cameroon: number | null;
  sawnwood_malaysian: number | null;
  plywood_cents_sheet: number | null;
  sawnwood_yoy_pct: number | null;
  sawnwood_volatility_12m: number | null;
}

export interface TimberMonthlyPayload {
  summary: {
    latest: {
      period: string;
      period_label: string;
      sawnwood_malaysian_usd_m3: number;
      logs_malaysian_usd_m3: number;
      plywood_cents_sheet: number;
      yoy_pct: number;
      yoy_change_usd: number;
      volatility_12m: number;
    };
    post_2000_stats: {
      min_usd_m3: number;
      max_usd_m3: number;
      range_spread: number;
    };
    peak_volatility: {
      period: string;
      volatility: number;
    };
    units: {
      sawnwood_cameroon: string;
      sawnwood_malaysian: string;
      logs_cameroon: string;
      logs_malaysian: string;
      plywood: string;
    };
  };
  series: TimberMonthlyEntry[];
}

export interface RetailerSummary {
  simulated: boolean;
  data_nature: string;
  total_orders: number;
  missing_values: {
    brand: number;
    shipping_cost: number;
    assembly_cost: number;
    customer_rating: number;
  };
  assembly_requested_rate_pct: number;
  orders_by_status: Array<{
    status: string;
    count: number;
    pct: number;
  }>;
  by_category: Array<{
    category: string;
    total_orders: number;
    avg_shipping_cost_usd: number;
    median_shipping_cost_usd: number;
    avg_assembly_cost_usd: number;
    median_assembly_cost_usd: number;
    avg_delivery_days: number;
    median_delivery_days: number;
    assembly_requested_pct: number;
    avg_customer_rating: number;
  }>;
  rating_by_delivery_window: Array<{
    bucket: string;
    order_count: number;
    avg_rating: number;
  }>;
}

export interface ThaiExportData {
  data_type: string;
  source_organization: string;
  report_title: string;
  report_date: string;
  accessed_date: string;
  note: string;
  figures: {
    export_value_oct_2024_usd_million: number;
    export_oct_2024_yoy_pct: number;
    export_oct_2024_mom_pct: number;
    export_value_10m_2024_usd_million: number;
    export_10m_2024_yoy_pct: number;
    export_value_full_year_2023_usd_million: number;
    annual_peak_2014_2024: {
      year_be: number;
      year_ce: number;
      value_usd_million: number;
      note: string;
    };
    annual_trough_2014_2024: {
      year_be: number;
      year_ce: number;
      value_usd_million: number;
      note: string;
    };
    annual_avg_growth_pct: number;
    cagr_pct: number;
    top_5_export_markets: Array<{ rank: number; country: string }>;
    annual_history: Array<{ year_ce: number; year_be: number; value: number; note: string }>;
  };
}

export interface ReicHousingData {
  data_type: string;
  source_organization: string;
  accessed_date: string;
  note: string;
  items: {
    q1_2569: {
      period_label: string;
      new_units: number;
      new_units_yoy_pct: number;
      previous_year_units: number;
      new_value_million_thb: number;
      new_value_yoy_pct: number;
      previous_year_value_million_thb: number;
      avg_price_per_unit_thb: number;
      avg_price_per_unit_previous_thb: number;
      avg_price_change_pct: number;
      source_url: string;
      strategic_insight: string;
    };
    supply_estimate_2568: {
      period_label: string;
      estimated_units: number;
      yoy_pct: number;
      source_url: string;
      strategic_insight: string;
    };
  };
}

export interface PricingModel {
  metadata: {
    description: string;
    currency_benchmark: string;
    currency_display_default: string;
    benchmark_source: string;
    assumption_warning: string;
  };
  formula: {
    base_price: string;
    adjusted_price: string;
    uncertainty_range: string;
  };
  defaults: {
    wood_cost_share: number;
    wood_cost_share_label: string;
    fx_sar_to_thb: number;
    material: string;
  };
  materials: Array<{
    id: string;
    name_th: string;
    benchmark_series: string;
    latest_usd_m3: number;
    unit: string;
    description: string;
  }>;
  categories: Record<string, {
    category: string;
    main_items: number;
    price_per_m3_median: number;
    price_per_m3_p25: number;
    price_per_m3_p75: number;
    sample_median_footprint: number;
  }>;
}
