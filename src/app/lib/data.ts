import type { FuelData, AmberData, AmberInterval, AmberDayStats, AmberSummary } from "./types";

// --- Fuel Prices (ProjectZeroThree / 7-Eleven API) ---

interface P03Station {
  type: string;
  price: number;
  state: string;
}

export async function fetchFuelData(): Promise<FuelData | null> {
  try {
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
    const vicDiesel = allStations.filter(
      (s: P03Station) => s.state === "VIC" && s.type === "Diesel"
    );

    if (vicPetrol.length === 0 || vicDiesel.length === 0) {
      console.error("No VIC U91/Diesel prices found in fuel API response");
      return null;
    }

    const petrolAvg =
      vicPetrol.reduce((sum: number, s: P03Station) => sum + s.price, 0) /
      vicPetrol.length;
    const dieselAvg =
      vicDiesel.reduce((sum: number, s: P03Station) => sum + s.price, 0) /
      vicDiesel.length;

    return {
      petrolPrice: Math.round(petrolAvg * 10) / 10,
      dieselPrice: Math.round(dieselAvg * 10) / 10,
      updatedAt: data.updated || new Date().toISOString(),
    };
  } catch (e) {
    console.error("Failed to fetch fuel data:", e);
    return null;
  }
}

// --- Amber Electric API ---

async function getAmberSiteId(token: string): Promise<string> {
  const res = await fetch("https://api.amber.com.au/v1/sites", {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Amber sites API: ${res.status}`);
  const sites: { id: string }[] = await res.json();
  if (sites.length === 0) throw new Error("No Amber sites found for this account");
  return sites[0].id;
}

/** Returns YYYY-MM-DD for N*24h ago in Melbourne timezone */
function melbourneDate(daysAgo: number): string {
  const d = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" });
}

/** Fetch intervals for a date range up to 7 days (Amber API limit) */
async function fetchAmberDateRange(
  siteId: string,
  headers: Record<string, string>,
  startDate: string,
  endDate: string
): Promise<AmberInterval[]> {
  const res = await fetch(
    `https://api.amber.com.au/v1/sites/${siteId}/prices?startDate=${startDate}&endDate=${endDate}&resolution=30`,
    { headers, next: { revalidate: 3600 } }
  );
  if (res.status === 429) {
    throw new Error(`Amber API rate limited on ${startDate}..${endDate}`);
  }
  if (!res.ok) throw new Error(`Amber prices for ${startDate}..${endDate}: ${res.status}`);
  return res.json();
}

/** Group intervals by Melbourne calendar date */
function groupByDate(intervals: AmberInterval[]): Map<string, AmberInterval[]> {
  const grouped = new Map<string, AmberInterval[]>();
  for (const interval of intervals) {
    const date = new Date(interval.startTime).toLocaleDateString("en-CA", {
      timeZone: "Australia/Melbourne",
    });
    const existing = grouped.get(date) || [];
    existing.push(interval);
    grouped.set(date, existing);
  }
  return grouped;
}

/** Compute min/max/avg/cheapest18HrAvg for a day's general intervals */
function computeDayStats(date: string, allIntervals: AmberInterval[]): AmberDayStats {
  const intervals = allIntervals.filter((p) => p.channelType === "general");
  const prices = intervals.map((p) => p.perKwh);

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = prices.reduce((s, v) => s + v, 0) / prices.length;

  const cheapest36 = [...prices].sort((a, b) => a - b).slice(0, 36);
  const cheapest18HrAvg =
    cheapest36.reduce((s, v) => s + v, 0) / cheapest36.length;

  return {
    date,
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    avg: Math.round(avg * 100) / 100,
    cheapest18HrAvg: Math.round(cheapest18HrAvg * 100) / 100,
  };
}

export async function fetchAmberData(): Promise<AmberData | null> {
  const token = process.env.AMBER_API_TOKEN;
  if (!token) {
    console.error("AMBER_API_TOKEN is not set — the app is misconfigured");
    return null;
  }

  const siteId = process.env.AMBER_SITE_ID || (await getAmberSiteId(token));

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  // Fetch current interval (for real-time display)
  const currentRes = await fetch(
    `https://api.amber.com.au/v1/sites/${siteId}/prices/current?previous=0&next=0&resolution=30`,
    { headers, next: { revalidate: 300 } }
  );
  if (!currentRes.ok) throw new Error(`Amber current prices: ${currentRes.status}`);
  const currentPrices: AmberInterval[] = await currentRes.json();
  const current =
    currentPrices
      .filter((p) => p.channelType === "general")
      .find((p) => p.type === "CurrentInterval") || null;

  // Fetch complete days in 7-day batches (Amber API max range is 7 days)
  const numDays = Math.min(28, 365);
  const batchSize = 7;
  let allIntervals: AmberInterval[];
  try {
    const batches: AmberInterval[][] = [];
    for (let i = 0; i < Math.ceil(numDays / batchSize); i++) {
      const batchEnd = melbourneDate(i * batchSize + 1);
      const batchStart = melbourneDate(Math.min((i + 1) * batchSize, numDays));
      batches.push(await fetchAmberDateRange(siteId, headers, batchStart, batchEnd));
    }
    allIntervals = batches.flat();
  } catch (e) {
    console.warn("Amber pricing unavailable:", (e as Error).message);
    return null;
  }
  const grouped = groupByDate(allIntervals);

  const days: AmberDayStats[] = [];
  for (const [date, intervals] of grouped) {
    const general = intervals.filter((p) => p.channelType === "general");
    if (general.length > 0) {
      days.push(computeDayStats(date, intervals));
    }
  }
  days.sort((a, b) => b.date.localeCompare(a.date));

  const summary: AmberSummary =
    days.length > 0
      ? {
          minOfMins: Math.round(Math.min(...days.map((d) => d.min)) * 100) / 100,
          maxOfMaxes: Math.round(Math.max(...days.map((d) => d.max)) * 100) / 100,
          avgOfAvgs:
            Math.round(
              (days.reduce((s, d) => s + d.avg, 0) / days.length) * 100
            ) / 100,
          avgOfCheapest18Hr:
            Math.round(
              (days.reduce((s, d) => s + d.cheapest18HrAvg, 0) / days.length) *
                10
            ) / 10,
        }
      : { minOfMins: 0, maxOfMaxes: 0, avgOfAvgs: 0, avgOfCheapest18Hr: 0 };

  // Renewables
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
    days,
    summary,
    cheapest36Avg: summary.avgOfCheapest18Hr,
    renewables,
    updatedAt: new Date().toISOString(),
  };
}
