import { PETROL_CARS, EVS } from "@/app/lib/constants";
import { melbourneDate } from "@/app/lib/format";
import type { FuelData, AmberData } from "@/app/lib/types";

function formatUpdatedAt(iso: string): string {
  const d = new Date(iso);
  const time = d
    .toLocaleTimeString("en-AU", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Australia/Melbourne",
    })
    .toLowerCase()
    .replace(" ", "");
  const tz = d.toLocaleString("en-AU", {
    timeZoneName: "short",
    timeZone: "Australia/Melbourne",
  });
  const tzAbbr = tz.split(" ").pop();
  const date = d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Australia/Melbourne",
  });
  return `${time} ${tzAbbr} ${date}`;
}

interface ComparisonBannerProps {
  fuelData: FuelData;
  amberData: AmberData;
}

export default function ComparisonBanner({
  fuelData,
  amberData,
}: ComparisonBannerProps) {
  const fuelPricePerL = fuelData.averagePrice; // cents/L
  // Use average of cheapest 36 of last 48 half-hour intervals
  const electricPricePerKwh = amberData.cheapest36Avg; // cents/kWh

  // Petrol: (L/100km) * (cents/L) / 100 = cents/km
  const petrolCosts = PETROL_CARS.map((car) => ({
    ...car,
    centsPerKm: (car.consumption * fuelPricePerL) / 100,
  })).sort((a, b) => b.centsPerKm - a.centsPerKm);

  // EV: (kWh/100km) * (cents/kWh) / 100 = cents/km
  const evCosts = EVS.map((car) => ({
    ...car,
    centsPerKm: (car.consumption * electricPricePerKwh) / 100,
  })).sort((a, b) => b.centsPerKm - a.centsPerKm);

  const maxCost = Math.max(
    ...petrolCosts.map((c) => c.centsPerKm),
    ...evCosts.map((c) => Math.max(c.centsPerKm, 0.1))
  );

  return (
    <div className="bg-zinc-900 rounded-2xl p-6">
      <h3 className="text-4xl font-semibold text-white tracking-tight mb-2 text-center">
        Cost per Kilometre — {melbourneDate()}
      </h3>
      <p className="text-base text-zinc-500 text-center mb-6">
        The energy cost of running Australia&apos;s top 10 petrol vs top 10
        electric cars in Melbourne, right now
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Petrol cars */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <svg
              className="w-12 h-12 text-red-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33a2.5 2.5 0 002.5 2.5c.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5a2.5 2.5 0 005 0V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z" />
            </svg>
            <span className="text-xl font-semibold text-zinc-400 tracking-wider">
              Top 10 Petrol @ ${(fuelPricePerL / 100).toFixed(2)}/L
            </span>
          </div>
          <div className="space-y-1.5">
            {petrolCosts.map((car) => (
              <div key={car.name} className="flex items-center gap-2">
                <span className="text-base text-zinc-400 w-[175px] truncate flex-shrink-0">
                  {car.name}
                </span>
                <div className="flex-1 h-10 bg-zinc-800 rounded overflow-hidden relative">
                  <div
                    className="h-full bg-red-500/80 rounded"
                    style={{
                      width: `${Math.max(15, (car.centsPerKm / maxCost) * 100)}%`,
                    }}
                  />
                  <span className="absolute right-2 top-0 h-full flex items-center text-base font-bold text-white">
                    {car.centsPerKm.toFixed(1)}¢
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EVs */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <svg
              className="w-12 h-12 text-green-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
            </svg>
            <span className="text-xl font-semibold text-zinc-400 tracking-wider">
              Top 10 EVs @ {electricPricePerKwh.toFixed(1)}¢/kWh avg
            </span>
          </div>
          <div className="space-y-1.5">
            {evCosts.map((car) => (
              <div key={car.name} className="flex items-center gap-2">
                <span className="text-base text-zinc-400 w-[175px] truncate flex-shrink-0">
                  {car.name}
                </span>
                <div className="flex-1 h-10 bg-zinc-800 rounded overflow-hidden relative">
                  <div
                    className="h-full bg-green-500/80 rounded"
                    style={{
                      width: `${Math.max(15, (car.centsPerKm / maxCost) * 100)}%`,
                    }}
                  />
                  <span className="absolute right-2 top-0 h-full flex items-center text-base font-bold text-white">
                    {car.centsPerKm.toFixed(1)}¢
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-zinc-500 text-center mt-5">
        Fuel prices from 7-Eleven stations across Melbourne according
        to{" "}
        <a href="https://projectzerothree.info" className="underline hover:text-zinc-300" target="_blank" rel="noopener noreferrer">
          ProjectZeroThree
        </a>
        . Electricity prices
        from{" "}
        <a href="https://www.amber.com.au" className="underline hover:text-zinc-300" target="_blank" rel="noopener noreferrer">
          Amber Electric
        </a>
        , the average of the cheapest 18 hours over the
        last 24. Fuel and electricity consumption from official WLTP figures for
        Australia&apos;s top-selling vehicles (2024). Last
        updated {formatUpdatedAt(amberData.updatedAt)}.
      </p>
    </div>
  );
}
