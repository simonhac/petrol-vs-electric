import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const gtAmerica = localFont({
  src: [
    {
      path: "../fonts/GT-America-Standard-Regular-Trial.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/GT-America-Standard-Medium-Trial.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/GT-America-Standard-Bold-Trial.woff",
      weight: "700",
      style: "normal",
    },
  ],
  display: "block",
  variable: "--font-gt-america",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://petrol-vs-electric.vercel.app"),
  title: "Petrol vs Electric — Melbourne",
  description:
    "Live comparison of the energy cost per kilometre for Australia's top 10 petrol cars vs top 10 EVs, using real-time Melbourne fuel prices and Amber Electric rates.",
  openGraph: {
    title: "Petrol vs Electric — Melbourne",
    description:
      "How much does it really cost per km to drive petrol vs electric in Melbourne right now?",
    siteName: "Petrol vs Electric",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Petrol vs Electric — Melbourne",
    description:
      "Live cost-per-km comparison: top 10 petrol cars vs top 10 EVs using real Melbourne prices.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${gtAmerica.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
