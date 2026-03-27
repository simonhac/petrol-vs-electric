import type { Metadata } from "next";
import { fetchFuelData, fetchAmberData } from "@/app/lib/data";
import { melbourneDate } from "@/app/lib/format";
import ComparisonBanner from "@/app/components/ComparisonBanner";
import PageShell from "@/app/components/PageShell";

export const dynamic = "force-dynamic";
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

export default async function ModelsPage() {
  const [fuelData, amberData] = await Promise.all([
    fetchFuelData(),
    fetchAmberData(),
  ]);

  if (!fuelData || !amberData) {
    const errors: string[] = [];
    if (!fuelData) errors.push("Failed to fetch fuel prices from ProjectZeroThree.");
    if (!amberData) errors.push("AMBER_API_TOKEN is not set.");
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 md:p-8">
        <div className="text-red-400 text-lg text-center space-y-1">
          <p>App is misconfigured:</p>
          {errors.map((e) => <p key={e}>{e}</p>)}
        </div>
      </div>
    );
  }

  return (
    <PageShell maxWidth="1024px" seeAlso={{ href: "/elitre", label: "The eLitre" }}>
      <ComparisonBanner fuelData={fuelData} amberData={amberData} />
    </PageShell>
  );
}
