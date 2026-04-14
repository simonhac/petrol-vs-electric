import { ICE_CARS, EVS } from "@/app/lib/constants";
import type { FuelData, AmberData } from "@/app/lib/types";
import BannerHeading from "./BannerHeading";
import FooterNotes from "./FooterNotes";
import CarRow from "./CarRow";

interface ComparisonBannerProps {
  fuelData: FuelData;
  amberData: AmberData;
}

export default function ComparisonBanner({
  fuelData,
  amberData,
}: ComparisonBannerProps) {
  const petrolPricePerL = fuelData.petrolPrice; // cents/L
  const dieselPricePerL = fuelData.dieselPrice; // cents/L
  // Use average of cheapest 36 of last 48 half-hour intervals
  const electricPricePerKwh = amberData.cheapest36Avg; // cents/kWh

  // ICE: (L/100km) * (cents/L) / 100 = cents/km
  const iceCosts = ICE_CARS.map((car) => {
    const price = car.fuelType === "diesel" ? dieselPricePerL : petrolPricePerL;
    return {
      ...car,
      centsPerKm: (car.consumption * price) / 100,
    };
  }).sort((a, b) => b.sales - a.sales);

  // EV: (kWh/100km) * (cents/kWh) / 100 = cents/km
  const evCosts = EVS.map((car) => ({
    ...car,
    centsPerKm: (car.consumption * electricPricePerKwh) / 100,
  })).sort((a, b) => b.sales - a.sales);

  const maxCost = Math.max(
    ...iceCosts.map((c) => c.centsPerKm),
    ...evCosts.map((c) => Math.max(c.centsPerKm, 0.1))
  );

  return (
    <div className="md:bg-zinc-900 md:rounded-2xl md:p-6">
      <BannerHeading
        title="Cost per Kilometre"
        description="The energy cost of running Australia's top 10 petrol & diesel vs top 10 electric cars in Melbourne, right now"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ICE cars */}
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
              Top 10 Selling ICE Vehicles
            </span>
          </div>
          <p className="text-sm text-zinc-500 mb-3">
            U91 ${(petrolPricePerL / 100).toFixed(2)}/L · Diesel ${(dieselPricePerL / 100).toFixed(2)}/L
          </p>
          <div className="space-y-1.5">
            {iceCosts.map((car, i) => (
              <CarRow
                key={car.name}
                car={car}
                index={i}
                maxCost={maxCost}
                unit="L/100km"
                fuelPriceCents={car.fuelType === "diesel" ? dieselPricePerL : petrolPricePerL}
                fuelUnit="/L"
                barColor="red"
                side="left"
              />
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
              Top 10 Selling Electric Vehicles
            </span>
          </div>
          <p className="text-sm text-zinc-500 mb-3">
            Amber Electric 28-day smart charging rate = {electricPricePerKwh.toFixed(1)}¢/kWh avg.
          </p>
          <div className="space-y-1.5">
            {evCosts.map((car, i) => (
              <CarRow
                key={car.name}
                car={car}
                index={i}
                maxCost={maxCost}
                unit="kWh/100km"
                fuelPriceCents={electricPricePerKwh}
                fuelUnit="/kWh"
                barColor="green"
                side="right"
              />
            ))}
          </div>
        </div>
      </div>

      <FooterNotes updatedAt={amberData.updatedAt} className="mt-5" />
    </div>
  );
}
