"use client";

import { useState } from "react";
import type { Car } from "@/app/lib/constants";
import { VFACTS_2025_URL } from "@/app/lib/constants";

function formatNumber(n: number): string {
  return n.toLocaleString("en-AU");
}

function sourceName(url: string): string {
  try {
    const host = new URL(url).hostname.replace("www.", "");
    if (host.includes("greenvehicleguide")) return "GVG";
    if (host.includes("vesr")) return "VESR";
    if (host.includes("fcai")) return "VFACTS";
    return host.split(".")[0];
  } catch {
    return "source";
  }
}

export default function CarRow({
  car,
  index,
  maxCost,
  unit,
  fuelPriceCents,
  fuelUnit,
  barColor,
  side,
}: {
  car: Car & { centsPerKm: number };
  index: number;
  maxCost: number;
  unit: string;
  fuelPriceCents: number;
  fuelUnit: string;
  barColor: "red" | "green";
  side: "left" | "right";
}) {
  const [open, setOpen] = useState(false);

  const bgClass = barColor === "red" ? "bg-red-500/80" : "bg-green-500/80";

  return (
    <div>
      {/* Mobile: tappable row */}
      <div className="md:hidden" onClick={() => setOpen((o) => !o)}>
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-sm text-zinc-400 truncate">
            {index + 1}. {car.name}
          </span>
          <span className="text-sm font-bold text-white ml-2 flex-shrink-0">
            {car.centsPerKm.toFixed(1)}¢
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-8 bg-zinc-800 overflow-hidden relative">
            <div
              className={`h-full ${bgClass}`}
              style={{
                width: `${Math.max(15, (car.centsPerKm / maxCost) * 100)}%`,
              }}
            />
          </div>
        </div>
        {open && (
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 mt-1 text-sm">
            <table className="text-zinc-400 text-sm">
              <tbody>
                <tr>
                  <td className="pr-4 py-0.5 whitespace-nowrap">Fuel</td>
                  <td className="py-0.5 whitespace-nowrap">
                    ${(fuelPriceCents / 100).toFixed(2)}
                    {fuelUnit}
                  </td>
                </tr>
                <tr>
                  <td className="pr-4 py-0.5 whitespace-nowrap">WLTP</td>
                  <td className="py-0.5 whitespace-nowrap">
                    {car.consumption.toFixed(1)} {unit}{" "}
                    (<a
                      href={car.sourceUrl}
                      className="text-zinc-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {sourceName(car.sourceUrl)}
                    </a>)
                  </td>
                </tr>
                <tr>
                  <td className="pr-4 py-0.5 whitespace-nowrap">2025 Sales</td>
                  <td className="py-0.5 whitespace-nowrap">
                    {formatNumber(car.sales)}{" "}
                    (<a
                      href={VFACTS_2025_URL}
                      className="text-zinc-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      VFACTS
                    </a>)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Desktop: hover tooltip */}
      <div className="group hidden md:flex items-center gap-2">
        <span className="text-base text-zinc-400 w-[175px] truncate flex-shrink-0">
          {index + 1}. {car.name}
        </span>
        <div className="flex-1 relative">
          <div className="h-10 bg-zinc-800 rounded overflow-hidden">
            <div
              className={`h-full ${bgClass} rounded`}
              style={{
                width: `${Math.max(15, (car.centsPerKm / maxCost) * 100)}%`,
              }}
            />
          </div>
          <span className="absolute right-2 top-0 h-full flex items-center text-base font-bold text-white">
            {car.centsPerKm.toFixed(1)}¢
          </span>
          {/* Tooltip positioned relative to the bar wrapper */}
          <div
            className={`absolute top-0 ${side === "left" ? "left-full ml-2" : "right-full mr-2"} z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity`}
          >
          <div className="rounded-lg bg-zinc-800 border border-zinc-700 p-3 shadow-xl text-sm">
            <p className="font-semibold text-white mb-2">{car.name}</p>
            <table className="text-zinc-400 text-sm">
              <tbody>
                <tr>
                  <td className="pr-4 py-0.5 whitespace-nowrap">Fuel</td>
                  <td className="py-0.5 whitespace-nowrap">
                    ${(fuelPriceCents / 100).toFixed(2)}
                    {fuelUnit}
                  </td>
                </tr>
                <tr>
                  <td className="pr-4 py-0.5 whitespace-nowrap">WLTP</td>
                  <td className="py-0.5 whitespace-nowrap">
                    {car.consumption.toFixed(1)} {unit}{" "}
                    (<a
                      href={car.sourceUrl}
                      className="text-zinc-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {sourceName(car.sourceUrl)}
                    </a>)
                  </td>
                </tr>
                <tr>
                  <td className="pr-4 py-0.5 whitespace-nowrap">
                    2025 Sales
                  </td>
                  <td className="py-0.5 whitespace-nowrap">
                    {formatNumber(car.sales)}{" "}
                    (<a
                      href={VFACTS_2025_URL}
                      className="text-zinc-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      VFACTS
                    </a>)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
