import { ImageResponse } from "next/og";
import { fetchFuelData, fetchAmberData } from "@/app/lib/data";
import { ICE_CARS, EVS } from "@/app/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 300;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const [fuelData, amberData] = await Promise.all([
    fetchFuelData(),
    fetchAmberData(),
  ]);

  if (!fuelData || !amberData) {
    throw new Error("Cannot generate OG image: missing fuel or electricity data");
  }

  const electricPricePerKwh = amberData.cheapest36Avg;

  // Sales-weighted average cents/km for ICE
  const iceTotalSales = ICE_CARS.reduce((s, c) => s + c.sales, 0);
  const avgIceCentsPerKm =
    ICE_CARS.reduce((s, c) => {
      const price =
        c.fuelType === "diesel" ? fuelData.dieselPrice : fuelData.petrolPrice;
      return s + ((c.consumption * price) / 100) * c.sales;
    }, 0) / iceTotalSales;

  // Sales-weighted average cents/km for EVs
  const evTotalSales = EVS.reduce((s, c) => s + c.sales, 0);
  const avgEvCentsPerKm =
    EVS.reduce((s, c) => {
      return s + ((c.consumption * electricPricePerKwh) / 100) * c.sales;
    }, 0) / evTotalSales;

  const iceLabel = `${avgIceCentsPerKm.toFixed(1)}¢/km`;
  const evLabel = `${avgEvCentsPerKm.toFixed(1)}¢/km`;

  const maxVal = Math.max(avgIceCentsPerKm, avgEvCentsPerKm);
  const maxBarH = 260;
  const iceBarH = (avgIceCentsPerKm / maxVal) * maxBarH;
  const evBarH = (avgEvCentsPerKm / maxVal) * maxBarH;

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
          Cost per Kilometre
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#a1a1aa",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          Average energy cost for top 10 petrol/diesel vs top 10 EVs
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
              {iceLabel}
            </div>
            <div
              style={{
                width: "120px",
                height: `${iceBarH}px`,
                background: "#ef4444cc",
                borderRadius: "8px 8px 0 0",
              }}
            />
            <div style={{ fontSize: 20, color: "#a1a1aa" }}>
              Petrol &amp; Diesel
            </div>
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
              {evLabel}
            </div>
            <div
              style={{
                width: "120px",
                height: `${evBarH}px`,
                background: "#22c55ecc",
                borderRadius: "8px 8px 0 0",
              }}
            />
            <div style={{ fontSize: 20, color: "#a1a1aa" }}>Electric</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
