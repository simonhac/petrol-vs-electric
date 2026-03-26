import type { FuelData, AmberData, AmberInterval } from "./types";

// --- Fuel Prices (ProjectZeroThree / 7-Eleven API) ---

interface P03Station {
  type: string;
  price: number;
  state: string;
}

export async function fetchFuelData(): Promise<FuelData> {
  const res = await fetch(
    "https://projectzerothree.info/api.php?format=json",
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error(`Fuel API: ${res.status}`);

  const data = await res.json();

  const allStations: P03Station[] = [];
  if (data.regions) {
    for (const region of data.regions) {
      if (region.prices) {
        allStations.push(...region.prices);
      }
    }
  }

  const vicPetrol = allStations.filter(
    (s: P03Station) => s.state === "VIC" && s.type === "U91"
  );

  if (vicPetrol.length === 0) throw new Error("No VIC U91 stations found");

  const avgPrice =
    vicPetrol.reduce((sum: number, s: P03Station) => sum + s.price, 0) /
    vicPetrol.length;

  return {
    averagePrice: Math.round(avgPrice * 10) / 10,
    updatedAt: data.updated || new Date().toISOString(),
  };
}

// --- Amber Electric API ---

export async function fetchAmberData(): Promise<AmberData> {
  const token = process.env.AMBER_API_TOKEN;
  const siteId = process.env.AMBER_SITE_ID;

  if (!token || !siteId) {
    throw new Error("AMBER_API_TOKEN and AMBER_SITE_ID must be set");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  const pricesRes = await fetch(
    `https://api.amber.com.au/v1/sites/${siteId}/prices/current?previous=48&next=12&resolution=30`,
    { headers, next: { revalidate: 300 } }
  );
  if (!pricesRes.ok) throw new Error(`Amber prices: ${pricesRes.status}`);
  const allPrices: AmberInterval[] = await pricesRes.json();

  const prices = allPrices.filter((p) => p.channelType === "general");

  const current =
    prices.find((p) => p.type === "CurrentInterval") || null;

  const actuals = prices.filter(
    (p) => p.type === "ActualInterval" || p.type === "CurrentInterval"
  );

  const cheapest36 = [...actuals]
    .sort((a, b) => a.perKwh - b.perKwh)
    .slice(0, 36);

  const cheapest36Avg =
    cheapest36.length > 0
      ? Math.round(
          (cheapest36.reduce((s, i) => s + i.perKwh, 0) /
            cheapest36.length) *
            10
        ) / 10
      : 0;

  const cheapestIntervals = cheapest36.sort(
    (a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  let renewables = current?.renewables ?? 0;
  try {
    const renewRes = await fetch(
      "https://api.amber.com.au/v1/state/vic/renewables/current",
      { next: { revalidate: 300 } }
    );
    if (renewRes.ok) {
      const renewData = await renewRes.json();
      if (typeof renewData === "number") {
        renewables = renewData;
      } else if (renewData?.percentage != null) {
        renewables = renewData.percentage;
      }
    }
  } catch {
    // Use the renewables from the price data
  }

  return {
    current,
    cheapestIntervals,
    cheapest36Avg,
    renewables,
    updatedAt: new Date().toISOString(),
  };
}
