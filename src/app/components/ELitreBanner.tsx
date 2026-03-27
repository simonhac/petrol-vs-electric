import { ICE_CARS, EVS } from "@/app/lib/constants";
import { melbourneDate } from "@/app/lib/format";
import type { FuelData, AmberData } from "@/app/lib/types";
import FooterNotes from "./FooterNotes";

function weightedAvg(items: { consumption: number; sales: number }[]): number {
  const totalSales = items.reduce((s, i) => s + i.sales, 0);
  const weighted = items.reduce((s, i) => s + i.consumption * i.sales, 0);
  return weighted / totalSales;
}

interface ELitreBannerProps {
  fuelData: FuelData;
  amberData: AmberData;
}

export default function ELitreBanner({
  fuelData,
  amberData,
}: ELitreBannerProps) {
  const electricPricePerKwh = amberData.cheapest36Avg; // cents/kWh

  // Weighted average fuel price across petrol + diesel cars
  const totalSales = ICE_CARS.reduce((s, c) => s + c.sales, 0);
  const weightedFuelPrice =
    ICE_CARS.reduce((s, c) => {
      const price =
        c.fuelType === "diesel" ? fuelData.dieselPrice : fuelData.petrolPrice;
      return s + price * c.sales;
    }, 0) / totalSales;

  const avgIceConsumption = weightedAvg(ICE_CARS); // L/100km
  const avgEvConsumption = weightedAvg(EVS); // kWh/100km

  // kWh in one eLitre = avg EV consumption / avg ICE consumption
  const eLitreKwh = avgEvConsumption / avgIceConsumption;
  // cost of one eLitre in cents
  const eLitreCents = eLitreKwh * electricPricePerKwh;

  return (
    <div className="bg-zinc-900 rounded-2xl p-6">
      <h3 className="text-4xl font-semibold text-white tracking-tight mb-2 text-center">
        The eLitre — {melbourneDate()}
      </h3>
      <p className="text-base text-zinc-500 text-center mb-8 max-w-2xl mx-auto">
        How much does it cost in electricity to drive the average EV as far
        <br />as one litre of fuel takes the average petrol/diesel car?
      </p>

      {/* Hero comparison — fuel left, chart centre, eLitre right */}
      <div className="bg-zinc-800 rounded-xl p-6 mb-8 mx-auto" style={{ maxWidth: "712px" }}>
        <div className="flex items-end justify-center gap-6 md:gap-10">
          {/* Fuel — left */}
          <div className="text-center flex-1 max-w-[200px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg
                className="w-12 h-12 text-red-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33a2.5 2.5 0 002.5 2.5c.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5a2.5 2.5 0 005 0V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z" />
              </svg>
              <span className="text-sm font-semibold text-zinc-400">
                1 litre fuel
              </span>
            </div>
            <div className="text-4xl md:text-5xl font-bold text-red-400">
              ${(weightedFuelPrice / 100).toFixed(2)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Melbourne weighted avg
            </p>
          </div>

          {/* Column chart — centre */}
          <div className="flex items-end gap-3 h-[310px]">
            {(() => {
              const fuelDollars = weightedFuelPrice / 100;
              const eLitreDollars = eLitreCents / 100;
              const maxVal = Math.max(fuelDollars, eLitreDollars);
              const maxHeight = 290; // px
              const fuelHeight = (fuelDollars / maxVal) * maxHeight;
              const eLitreHeight = (eLitreDollars / maxVal) * maxHeight;
              return (
                <>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-zinc-500 font-medium">
                      ${fuelDollars.toFixed(2)}
                    </span>
                    <div
                      className="bg-red-500/80 rounded-t"
                      style={{ width: "75px", height: `${fuelHeight}px` }}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-zinc-500 font-medium">
                      ${eLitreDollars.toFixed(2)}
                    </span>
                    <div
                      className="bg-green-500/80 rounded-t"
                      style={{ width: "75px", height: `${eLitreHeight}px` }}
                    />
                  </div>
                </>
              );
            })()}
          </div>

          {/* eLitre — right */}
          <div className="text-center flex-1 max-w-[200px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg
                className="w-12 h-12 text-green-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
              </svg>
              <span className="text-sm font-semibold text-zinc-400">
                1 eLitre
              </span>
            </div>
            <div className="text-4xl md:text-5xl font-bold text-green-400">
              ${(eLitreCents / 100).toFixed(2)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {eLitreKwh.toFixed(2)} kWh @ {electricPricePerKwh.toFixed(1)}¢/kWh
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-zinc-800/50 rounded-xl p-5 mb-6 mx-auto" style={{ maxWidth: "712px" }}>
        <h4 className="text-lg font-semibold text-zinc-300 mb-3">
          How it works
        </h4>
        <div className="space-y-2 text-sm text-zinc-400">
          <p>
            The average petrol/diesel car (sales-weighted) uses{" "}
            <span className="text-white font-medium">
              {avgIceConsumption.toFixed(1)} L/100km
            </span>
            , so one litre gets you{" "}
            <span className="text-white font-medium">
              {(100 / avgIceConsumption).toFixed(1)} km
            </span>
            .
          </p>
          <p>
            The average EV (sales-weighted) uses{" "}
            <span className="text-white font-medium">
              {avgEvConsumption.toFixed(1)} kWh/100km
            </span>
            , so to cover that same{" "}
            <span className="text-white font-medium">
              {(100 / avgIceConsumption).toFixed(1)} km
            </span>{" "}
            it needs{" "}
            <span className="text-white font-medium">
              {eLitreKwh.toFixed(2)} kWh
            </span>
            .
          </p>
          <p>
            Smart charging with Amber Electric currently costs{" "}
            <span className="text-white font-medium">
              {electricPricePerKwh.toFixed(1)}¢/kWh
            </span>
            , so that{" "}
            <span className="text-white font-medium">
              {eLitreKwh.toFixed(2)} kWh
            </span>{" "}
            costs{" "}
            <span className="text-green-400 font-bold">
              {eLitreCents.toFixed(1)}¢
            </span>{" "}
            — the price of one eLitre.
          </p>
        </div>
      </div>

      <FooterNotes updatedAt={amberData.updatedAt} />
    </div>
  );
}
