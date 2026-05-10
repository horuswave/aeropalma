import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AeroPalma — Afungi Airport Operator",
  description: "AeroPalma is a Mozambican company providing Aviation Security, Hydro Maintenance, and Ground Handling Services at Afungi Airport.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
