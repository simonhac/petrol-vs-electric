import type { Metadata } from "next";
import { PETROL_CARS, EVS } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: "Sales Data — Petrol vs Electric",
  description:
    "Australian vehicle sales figures used to calculate sales-weighted averages for the eLitre.",
};

function formatNumber(n: number): string {
  return n.toLocaleString("en-AU");
}

export default function SalesPage() {
  const petrolTotal = PETROL_CARS.reduce((s, c) => s + c.sales, 0);
  const evTotal = EVS.reduce((s, c) => s + c.sales, 0);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl">
        <div className="bg-zinc-900 rounded-2xl p-6">
          <h3 className="text-4xl font-semibold text-white tracking-tight mb-2 text-center">
            Sales Data
          </h3>
          <p className="text-base text-zinc-500 text-center mb-8">
            Australian vehicle sales figures used to calculate the
            sales-weighted averages behind the{" "}
            <a href="/elitre" className="text-green-400 underline">
              eLitre
            </a>
            .
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Petrol */}
            <div>
              <h4 className="text-xl font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33a2.5 2.5 0 002.5 2.5c.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5a2.5 2.5 0 005 0V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z" />
                </svg>
                Top 10 Petrol (2024)
              </h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    <th className="text-left py-2 font-medium">Vehicle</th>
                    <th className="text-right py-2 font-medium">Sales</th>
                    <th className="text-right py-2 font-medium">L/100km</th>
                  </tr>
                </thead>
                <tbody>
                  {PETROL_CARS.map((car) => (
                    <tr
                      key={car.name}
                      className="border-b border-zinc-800/50 text-zinc-300"
                    >
                      <td className="py-1.5">{car.name}</td>
                      <td className="text-right py-1.5 tabular-nums">
                        {formatNumber(car.sales)}
                      </td>
                      <td className="text-right py-1.5 tabular-nums">
                        {car.consumption.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                  <tr className="text-zinc-400 font-medium">
                    <td className="py-2">Total</td>
                    <td className="text-right py-2 tabular-nums">
                      {formatNumber(petrolTotal)}
                    </td>
                    <td className="text-right py-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* EVs */}
            <div>
              <h4 className="text-xl font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
                Top 10 EVs (2025)
              </h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    <th className="text-left py-2 font-medium">Vehicle</th>
                    <th className="text-right py-2 font-medium">Sales</th>
                    <th className="text-right py-2 font-medium">kWh/100km</th>
                  </tr>
                </thead>
                <tbody>
                  {EVS.map((car) => (
                    <tr
                      key={car.name}
                      className="border-b border-zinc-800/50 text-zinc-300"
                    >
                      <td className="py-1.5">{car.name}</td>
                      <td className="text-right py-1.5 tabular-nums">
                        {formatNumber(car.sales)}
                      </td>
                      <td className="text-right py-1.5 tabular-nums">
                        {car.consumption.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                  <tr className="text-zinc-400 font-medium">
                    <td className="py-2">Total</td>
                    <td className="text-right py-2 tabular-nums">
                      {formatNumber(evTotal)}
                    </td>
                    <td className="text-right py-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-4 text-sm text-zinc-500 space-y-1">
            <p className="font-medium text-zinc-400">Sources</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>
                Petrol car sales: 2024 full-year VFACTS via{" "}
                <a
                  href="https://www.racv.com.au/royalauto/transport/cars/australian-new-car-sales-2024.html"
                  className="text-green-400 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  RACV
                </a>{" "}
                and{" "}
                <a
                  href="https://www.carexpert.com.au/car-news/vfacts-2024-new-vehicle-sales-hit-record-high-but-slump-expected-soon"
                  className="text-green-400 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CarExpert
                </a>
              </li>
              <li>
                EV sales: 2025 full-year VFACTS via{" "}
                <a
                  href="https://www.carexpert.com.au/car-news/australias-best-selling-evs-in-2025-revealed"
                  className="text-green-400 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CarExpert
                </a>{" "}
                and{" "}
                <a
                  href="https://zecar.com/reviews/australia-ev-sales-2025-complete-year-review"
                  className="text-green-400 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Zecar
                </a>
              </li>
              <li>
                Fuel consumption figures: official WLTP combined ratings for
                Australian-specification vehicles
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
