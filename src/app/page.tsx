import type { Metadata } from "next";
import { fetchFuelData, fetchAmberData } from "@/app/lib/data";
import { melbourneDate } from "@/app/lib/format";
import ComparisonBanner from "@/app/components/ComparisonBanner";

export const revalidate = 300; // 5 minutes

export function generateMetadata(): Metadata {
  const date = melbourneDate();
  const title = `Cost per Kilometre — ${date}`;
  return {
    title,
    openGraph: { title },
    twitter: { title },
  };
}

export default async function Home() {
  const [fuelData, amberData] = await Promise.all([
    fetchFuelData(),
    fetchAmberData(),
  ]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <ComparisonBanner fuelData={fuelData} amberData={amberData} />
      </div>
    </div>
  );
}
