import Link from "next/link";

interface PageShellProps {
  maxWidth: string;
  seeAlso: { href: string; label: string };
  children: React.ReactNode;
}

export default function PageShell({
  maxWidth,
  seeAlso,
  children,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 md:p-8">
      <div className="w-full" style={{ maxWidth }}>
        {children}
        <p className="text-sm text-zinc-500 text-center mt-6 mb-9">
          See also:{" "}
          <Link
            href={seeAlso.href}
            className="underline hover:text-zinc-300"
          >
            {seeAlso.label}
          </Link>
        </p>
      </div>
    </div>
  );
}
