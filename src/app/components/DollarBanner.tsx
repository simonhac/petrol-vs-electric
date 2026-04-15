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

interface DollarBannerProps {
  fuelData: FuelData;
  amberData: AmberData;
}

export default function DollarBanner({
  fuelData,
  amberData,
}: DollarBannerProps) {
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

  // km per $1 of fuel
  const litresPerDollar = 100 / weightedFuelPrice; // 100 cents / cents-per-litre
  const petrolKmPerDollar = litresPerDollar * (100 / avgIceConsumption);

  // km per $1 of electricity
  const kwhPerDollar = 100 / electricPricePerKwh; // 100 cents / cents-per-kWh
  const evKmPerDollar = kwhPerDollar * (100 / avgEvConsumption);

  return (
    <div className="md:bg-zinc-900 md:rounded-2xl md:p-6">
      <BannerHeading
        title="How far on a dollar"
        description={<>How far can $1 of petrol take the average car,<br />compared with $1 of electricity in the average EV?</>}
      />

      {/* Hero comparison — fuel left, chart centre, electricity right */}
      <div className="md:bg-zinc-800 md:rounded-xl md:p-6 mb-8 mx-auto" style={{ maxWidth: "780px" }}>
        <div className="flex items-end justify-center gap-3 md:gap-6">
          {(() => {
            const maxVal = Math.max(petrolKmPerDollar, evKmPerDollar);
            const maxHeight = 400; // px
            const petrolHeight = (petrolKmPerDollar / maxVal) * maxHeight;
            const evHeight = (evKmPerDollar / maxVal) * maxHeight;
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

                {/* Petrol bar */}
                <div className="flex flex-col items-center">
                  <div
                    className="bg-red-500/80 rounded-t flex items-start justify-center pt-3"
                    style={{ width: "120px", height: `${petrolHeight}px` }}
                  >
                    <span className="text-sm font-semibold text-red-200/80 text-center leading-tight whitespace-nowrap">
                      $1 of fuel
                    </span>
                  </div>
                  <div className="text-3xl md:hidden font-bold text-red-400 mt-2">
                    {petrolKmPerDollar.toFixed(1)} km
                  </div>
                </div>

                {/* EV bar */}
                <div className="flex flex-col items-center">
                  <div
                    className="bg-green-500/80 rounded-t flex items-start justify-center pt-3"
                    style={{ width: "120px", height: `${evHeight}px` }}
                  >
                    <span className="text-sm font-semibold text-green-200/80 text-center leading-tight">
                      $1 of<br />electricity
                    </span>
                  </div>
                  <div className="text-3xl md:hidden font-bold text-green-400 mt-2">
                    {evKmPerDollar.toFixed(1)} km
                  </div>
                </div>

                {/* Electricity icon */}
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

        {/* Distances below bars — desktop only */}
        <div className="hidden md:flex justify-center gap-6 mt-4">
          <div className="text-center" style={{ width: "120px" }}>
            <div className="text-3xl md:text-4xl font-bold text-red-400">
              {petrolKmPerDollar.toFixed(1)}
            </div>
            <p className="text-xs text-zinc-500 mt-1 whitespace-nowrap">
              km per $1 of fuel
            </p>
          </div>
          <div className="text-center" style={{ width: "120px" }}>
            <div className="text-3xl md:text-4xl font-bold text-green-400">
              {evKmPerDollar.toFixed(1)}
            </div>
            <p className="text-xs text-zinc-500 mt-1 whitespace-nowrap">
              km per $1 of electricity
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
            . Fuel currently costs{" "}
            <span className="text-white font-medium whitespace-nowrap">
              {weightedFuelPrice.toFixed(1)}¢/L
            </span>
            , so $1 buys{" "}
            <span className="text-white font-medium whitespace-nowrap">
              {litresPerDollar.toFixed(2)} L
            </span>
            {" "}— enough to drive{" "}
            <span className="text-red-400 font-bold whitespace-nowrap">
              {petrolKmPerDollar.toFixed(1)} km
            </span>
            .
          </p>
          <p>
            The average EV (sales-weighted) uses{" "}
            <span className="text-white font-medium whitespace-nowrap">
              {avgEvConsumption.toFixed(1)} kWh/100km
            </span>
            . Smart charging with Amber Electric currently costs{" "}
            <span className="text-white font-medium whitespace-nowrap">
              {electricPricePerKwh.toFixed(1)}¢/kWh
            </span>
            , so $1 buys{" "}
            <span className="text-white font-medium whitespace-nowrap">
              {kwhPerDollar.toFixed(2)} kWh
            </span>
            {" "}— enough to drive{" "}
            <span className="text-green-400 font-bold whitespace-nowrap">
              {evKmPerDollar.toFixed(1)} km
            </span>
            .
          </p>
          <p>
            This means that an EV could travel{" "}
            <span className="text-white font-medium whitespace-nowrap">
              {(evKmPerDollar / petrolKmPerDollar).toFixed(1)}×
            </span>
            {" "}further on just $1 of energy.
          </p>
        </div>
      </div>

      {/* Amber SmartShift footnote */}
      <div className="md:bg-zinc-800/50 md:rounded-xl md:p-5 mb-6 mx-auto" style={{ maxWidth: "780px" }}>
        <SectionHeading>Have we underestimated the EV distance?</SectionHeading>
        <p className="text-zinc-400" style={{ fontSize: "16px" }}>
          {(() => {
            const smartShiftPrice = 4.0; // c/kWh
            const smartShiftKmPerDollar = (100 / smartShiftPrice) * (100 / avgEvConsumption);
            const smartShiftMultiplier = smartShiftKmPerDollar / evKmPerDollar;
            return (
              <>
                Amber has contacted the author to report that their SmartShift
                customers with battery and solar averaged{" "}
                <span className="text-white font-medium">4.0¢/kWh</span>{" "}
                during the six months to the end of March{"\u00A0"}2026. At that rate, $1 of
                electricity would take the average EV{" "}
                <span className="text-green-400 font-bold whitespace-nowrap">
                  {smartShiftKmPerDollar.toFixed(1)} km
                </span>
                {" "}— {smartShiftMultiplier.toFixed(1)}× further than our estimate, or{" "}
                <span className="text-white font-medium">{(smartShiftKmPerDollar / petrolKmPerDollar).toFixed(1)}× as far as the average conventional vehicle</span>.
              </>
            );
          })()}
        </p>
      </div>

      <FooterNotes updatedAt={amberData.updatedAt} showWeightedNote />
    </div>
  );
}
