import { melbourneDate } from "@/app/lib/format";

interface BannerHeadingProps {
  title: string;
  description: string;
}

export default function BannerHeading({
  title,
  description,
}: BannerHeadingProps) {
  return (
    <>
      <h3 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-2 text-center">
        {title}
        <span className="hidden md:inline"> — </span>
        <br className="md:hidden" />
        <span className="text-[0.8em] md:text-[1em]">{melbourneDate()}</span>
      </h3>
      <p className="text-zinc-500 text-center mb-6 max-w-2xl mx-auto" style={{ fontSize: "18px" }}>
        {description}
      </p>
    </>
  );
}
