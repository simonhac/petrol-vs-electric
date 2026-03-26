import { ImageResponse } from "next/og";
import { fetchFuelData, fetchAmberData } from "@/app/lib/data";
import { PETROL_CARS, EVS } from "@/app/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 300;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function weightedAvg(items: { consumption: number; sales: number }[]): number {
  const totalSales = items.reduce((s, i) => s + i.sales, 0);
  const weighted = items.reduce((s, i) => s + i.consumption * i.sales, 0);
  return weighted / totalSales;
}

export default async function OGImage() {
  const [fuelData, amberData] = await Promise.all([
    fetchFuelData(),
    fetchAmberData(),
  ]);

  if (!fuelData || !amberData) {
    throw new Error("Cannot generate OG image: missing fuel or electricity data");
  }

  const fuelPricePerL = fuelData.averagePrice;
  const electricPricePerKwh = amberData.cheapest36Avg;

  const avgPetrol = weightedAvg(PETROL_CARS);
  const avgEv = weightedAvg(EVS);
  const eLitreKwh = avgEv / avgPetrol;
  const eLitreCents = eLitreKwh * electricPricePerKwh;

  const petrolDollars = `$${(fuelPricePerL / 100).toFixed(2)}`;
  const eLitreDollars = `$${(eLitreCents / 100).toFixed(2)}`;

  const maxVal = Math.max(fuelPricePerL / 100, eLitreCents / 100);
  const maxBarH = 260;
  const petrolBarH = ((fuelPricePerL / 100) / maxVal) * maxBarH;
  const eLitreBarH = ((eLitreCents / 100) / maxVal) * maxBarH;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 60px",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            marginBottom: "12px",
          }}
        >
          The eLitre
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#a1a1aa",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          The electricity to drive the average EV as far as 1L of petrol
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "60px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div style={{ fontSize: 36, fontWeight: 700, color: "#ef4444" }}>
              {petrolDollars}
            </div>
            <div
              style={{
                width: "120px",
                height: `${petrolBarH}px`,
                background: "#ef4444cc",
                borderRadius: "8px 8px 0 0",
              }}
            />
            <div style={{ fontSize: 20, color: "#a1a1aa" }}>1L petrol</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div style={{ fontSize: 36, fontWeight: 700, color: "#22c55e" }}>
              {eLitreDollars}
            </div>
            <div
              style={{
                width: "120px",
                height: `${eLitreBarH}px`,
                background: "#22c55ecc",
                borderRadius: "8px 8px 0 0",
              }}
            />
            <div style={{ fontSize: 20, color: "#a1a1aa" }}>1 eLitre</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
