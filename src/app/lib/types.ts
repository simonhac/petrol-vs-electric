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

export interface AmberData {
  current: AmberInterval | null;
  cheapestIntervals: AmberInterval[]; // cheapest 36 of last 48 half-hour intervals
  cheapest36Avg: number; // average perKwh of cheapest 36 intervals (cents/kWh)
  renewables: number;
  updatedAt: string;
}
