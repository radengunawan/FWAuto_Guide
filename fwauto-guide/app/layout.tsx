import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FWAuto — Interactive Guide",
  description: "Step-by-step beginner guide to FWAuto firmware development automation. Install, authenticate, build, deploy, and analyze logs with AI.",
  keywords: ["FWAuto", "firmware", "AI", "embedded", "Renesas", "RA8T2", "tutorial"],
  openGraph: {
    title: "FWAuto — Interactive Beginner Guide",
    description: "Learn FWAuto from scratch. AI-powered firmware development automation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
