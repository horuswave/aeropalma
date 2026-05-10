import type { Metadata } from "next";
import { locales } from "@/i18n/routing";
import "../globals.css";

export const metadata: Metadata = {
  title: "AeroPalma — Afungi Airport Operator",
  description: "Mozambican airport operator at Afungi Airport.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
