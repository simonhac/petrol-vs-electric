export interface FuelData {
  petrolPrice: number; // cents per litre (U91)
  dieselPrice: number; // cents per litre
  updatedAt: string;
}

export interface AmberInterval {
  type: "CurrentInterval" | "ForecastInterval" | "ActualInterval";
  channelType: "general" | "feedIn";
  perKwh: number; // cents per kWh — your actual retail rate inc network + GST
  spotPerKwh: number; // NEM spot price cents/kWh
  descriptor:
    | "extremelyLow"
    | "veryLow"
    | "low"
    | "neutral"
    | "high"
    | "spike";
  renewables: number; // 0-100
  startTime: string;
  endTime: string;
  duration: number;
  spikeStatus: string;
}

export interface AmberDayStats {
  date: string; // YYYY-MM-DD (Melbourne timezone)
  min: number; // lowest perKwh interval of the day
  max: number; // highest perKwh interval of the day
  avg: number; // average perKwh across all intervals
  cheapest18HrAvg: number; // average of cheapest 36 half-hour intervals (= 18 hours)
}

export interface AmberSummary {
  minOfMins: number;
  maxOfMaxes: number;
  avgOfAvgs: number;
  avgOfCheapest18Hr: number; // the headline number — 7-day average of daily cheapest-18hr
}

export interface AmberData {
  current: AmberInterval | null;
  days: AmberDayStats[]; // per-day breakdowns (up to 7)
  summary: AmberSummary;
  cheapest36Avg: number; // alias for summary.avgOfCheapest18Hr (backward compat)
  renewables: number;
  updatedAt: string;
}
