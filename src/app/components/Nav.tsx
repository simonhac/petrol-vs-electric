"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pages = [
  { href: "/elitre", label: "The eLitre" },
  { href: "/dollar", label: "How Far on $1" },
  { href: "/models", label: "Cost per km" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-center gap-4 text-sm text-zinc-500 mt-6 mb-9">
      {pages.map(({ href, label }, i) => (
        <span key={href} className="flex items-center gap-4">
          {i > 0 && <span aria-hidden>·</span>}
          {pathname === href ? (
            <span className="text-zinc-300">{label}</span>
          ) : (
            <Link href={href} className="underline hover:text-zinc-300">
              {label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
