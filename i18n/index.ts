"use client";
import { useParams } from "next/navigation";
import type { Locale } from "./routing";

// Import both JSON files statically so they bundle at build time
import en from "../messages/en.json";
import pt from "../messages/pt.json";

const messages = { en, pt };

type Messages = typeof en;
type Path = string;

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object")
      return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

export function useTranslations(section: keyof Messages) {
  const params = useParams();
  const locale = (params?.locale as Locale) ?? "en";
  const dict = messages[locale] ?? messages.en;
  const sectionData = dict[section] as Record<string, unknown>;

  function t(key: string): string {
    const val = sectionData?.[key];
    return typeof val === "string" ? val : key;
  }

  t.raw = function (key: string): unknown {
    return sectionData?.[key];
  };

  return t;
}
