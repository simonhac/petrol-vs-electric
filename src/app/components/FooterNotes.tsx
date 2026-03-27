import { DIESEL_NAMES, VFACTS_2025_URL } from "@/app/lib/constants";

function formatUpdatedAt(iso: string): string {
  const d = new Date(iso);
  const time = d
    .toLocaleTimeString("en-AU", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Australia/Melbourne",
    })
    .toLowerCase()
    .replace(" ", "");
  const tz = d.toLocaleString("en-AU", {
    timeZoneName: "short",
    timeZone: "Australia/Melbourne",
  });
  const tzAbbr = tz.split(" ").pop();
  const date = d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Australia/Melbourne",
  });
  return `${time} ${tzAbbr} ${date}`;
}

export default function FooterNotes({
  updatedAt,
  className = "",
}: {
  updatedAt: string;
  className?: string;
}) {
  return (
    <p className={`text-sm text-zinc-500 text-center ${className}`.trim()}>
      Fuel prices from 7-Eleven stations across Melbourne according
      to{" "}
      <a href="https://projectzerothree.info" className="underline hover:text-zinc-300" target="_blank" rel="noopener noreferrer">
        ProjectZeroThree
      </a>
      . Electricity prices
      from{" "}
      <a href="https://www.amber.com.au" className="underline hover:text-zinc-300" target="_blank" rel="noopener noreferrer">
        Amber Electric
      </a>
      , the average of the cheapest 18 hours over the
      last 24. Vehicle fuel and electricity consumption data from official WLTP
      figures. Sales data from{" "}
      <a href={VFACTS_2025_URL} className="underline hover:text-zinc-300" target="_blank" rel="noopener noreferrer">
        VFACTS 2025
      </a>
      . {DIESEL_NAMES.slice(0, -1).join(", ")} and{" "}
      {DIESEL_NAMES[DIESEL_NAMES.length - 1]} are diesel; diesel pricing has
      been applied. Where a model range included HEV or PHEV variants, the ICE
      version was chosen.{" "}
      <span className="whitespace-nowrap">
        Last updated {formatUpdatedAt(updatedAt)}.
      </span>
    </p>
  );
}
