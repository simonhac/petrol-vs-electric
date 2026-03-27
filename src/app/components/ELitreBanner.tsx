import { ICE_CARS, EVS } from "@/app/lib/constants";
import type { FuelData, AmberData } from "@/app/lib/types";
import BannerHeading from "./BannerHeading";
import SectionHeading from "./SectionHeading";
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
    <div className="md:bg-zinc-900 md:rounded-2xl md:p-6">
      <BannerHeading
        title="Melbourne's eLitre"
        description="How much does it cost in electricity to drive the average EV as far as one litre of fuel takes the average petrol/diesel car?"
      />

      {/* Hero comparison — fuel left, chart centre, eLitre right */}
      <div className="md:bg-zinc-800 md:rounded-xl md:p-6 mb-8 mx-auto" style={{ maxWidth: "780px" }}>
        <div className="flex items-end justify-center gap-3 md:gap-6">
          {(() => {
            const fuelDollars = weightedFuelPrice / 100;
            const eLitreDollars = eLitreCents / 100;
            const maxVal = Math.max(fuelDollars, eLitreDollars);
            const maxHeight = 400; // px
            const fuelHeight = (fuelDollars / maxVal) * maxHeight;
            const eLitreHeight = (eLitreDollars / maxVal) * maxHeight;
            return (
              <>
                {/* Fuel icon */}
                <div className="self-end">
                  <svg
                    className="w-12 h-12 md:w-16 md:h-16 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33a2.5 2.5 0 002.5 2.5c.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5a2.5 2.5 0 005 0V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z" />
                  </svg>
                </div>

                {/* Fuel bar */}
                <div className="flex flex-col items-center">
                  <div
                    className="bg-red-500/80 rounded-t flex items-start justify-center pt-3"
                    style={{ width: "100px", height: `${fuelHeight}px` }}
                  >
                    <span className="text-sm font-semibold text-red-200/80 text-center leading-tight">
                      1 litre<br />fuel
                    </span>
                  </div>
                  <div className="text-3xl md:hidden font-bold text-red-400 mt-2">
                    ${fuelDollars.toFixed(2)}
                  </div>
                </div>

                {/* eLitre bar */}
                <div className="flex flex-col items-center">
                  <div
                    className="bg-green-500/80 rounded-t flex items-start justify-center pt-3"
                    style={{ width: "100px", height: `${eLitreHeight}px` }}
                  >
                    <span className="text-sm font-semibold text-green-200/80 text-center leading-tight">
                      1 eLitre
                    </span>
                  </div>
                  <div className="text-3xl md:hidden font-bold text-green-400 mt-2">
                    ${eLitreDollars.toFixed(2)}
                  </div>
                </div>

                {/* eLitre icon */}
                <div className="self-end">
                  <svg
                    className="w-12 h-12 md:w-16 md:h-16 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                  </svg>
                </div>
              </>
            );
          })()}
        </div>

        {/* Prices below bars — desktop only */}
        <div className="hidden md:flex justify-center gap-6 mt-4">
          <div className="text-center" style={{ width: "100px" }}>
            <div className="text-3xl md:text-4xl font-bold text-red-400">
              ${(weightedFuelPrice / 100).toFixed(2)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Melbourne weighted avg
            </p>
          </div>
          <div className="text-center" style={{ width: "100px" }}>
            <div className="text-3xl md:text-4xl font-bold text-green-400">
              ${(eLitreCents / 100).toFixed(2)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {eLitreKwh.toFixed(2)} kWh @ {electricPricePerKwh.toFixed(1)}¢/kWh
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="md:bg-zinc-800/50 md:rounded-xl md:p-5 mb-6 mx-auto" style={{ maxWidth: "780px" }}>
        <SectionHeading>How it works</SectionHeading>
        <div className="space-y-2 text-zinc-400" style={{ fontSize: "16px" }}>
          <p>
            The average petrol/diesel car (sales-weighted) uses{" "}
            <span className="text-white font-medium whitespace-nowrap">
              {avgIceConsumption.toFixed(1)} L/100km
            </span>
            , so one litre gets you{" "}
            <span className="text-white font-medium whitespace-nowrap">
              {(100 / avgIceConsumption).toFixed(1)} km
            </span>
            .
          </p>
          <p>
            The average EV (sales-weighted) uses{" "}
            <span className="text-white font-medium whitespace-nowrap">
              {avgEvConsumption.toFixed(1)} kWh/100km
            </span>
            , so to cover that same{" "}
            <span className="text-white font-medium whitespace-nowrap">
              {(100 / avgIceConsumption).toFixed(1)} km
            </span>{" "}
            it needs{" "}
            <span className="text-white font-medium whitespace-nowrap">
              {eLitreKwh.toFixed(2)} kWh
            </span>
            .
          </p>
          <p>
            Smart charging with Amber Electric currently costs{" "}
            <span className="text-white font-medium whitespace-nowrap">
              {electricPricePerKwh.toFixed(1)}¢/kWh
            </span>
            , so that{" "}
            <span className="text-white font-medium whitespace-nowrap">
              {eLitreKwh.toFixed(2)} kWh
            </span>{" "}
            costs{" "}
            <span className="text-green-400 font-bold whitespace-nowrap">
              {eLitreCents.toFixed(1)}¢
            </span>{" "}
            — the price of one eLitre.
          </p>
        </div>
      </div>

      <FooterNotes updatedAt={amberData.updatedAt} showWeightedNote />
    </div>
  );
}
