import type { Metadata } from "next";
import { fetchFuelData, fetchAmberData } from "@/app/lib/data";
import { melbourneDate } from "@/app/lib/format";
import DollarBanner from "@/app/components/DollarBanner";
import PageShell from "@/app/components/PageShell";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export function generateMetadata(): Metadata {
  const date = melbourneDate();
  const title = `How far on a dollar — ${date}`;
  return {
    title,
    description:
      "How far can $1 of petrol take the average car vs $1 of electricity in an EV? Live comparison using real fuel and electricity prices in Melbourne.",
    openGraph: { title },
    twitter: { title },
  };
}

export default async function DollarPage() {
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
    <PageShell maxWidth="850px" seeAlso={{ href: "/elitre", label: "The eLitre" }}>
      <DollarBanner fuelData={fuelData} amberData={amberData} />
    </PageShell>
  );
}
