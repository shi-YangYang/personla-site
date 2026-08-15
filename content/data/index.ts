import type { Locale } from "@/lib/i18n";
import { personalZh } from "./personal.zh";
import { personalEn } from "./personal.en";
import { readPersonalJson } from "@/lib/personal";
import type { personalLocal as PersonalLocalType } from "./personal.local.example";

export type PersonalData = typeof personalZh;

const fallback: Record<Locale, PersonalData> = {
  zh: personalZh,
  en: personalEn,
};

let cached: Record<Locale, PersonalData> | null = null;
let tried = false;

async function loadLocal(): Promise<Record<Locale, PersonalData> | null> {
  if (tried) return cached;
  tried = true;
  try {
    const mod = await import("./personal.local");
    cached = (mod as { personalLocal: Record<Locale, PersonalData> }).personalLocal;
    return cached;
  } catch {
    return null;
  }
}

function mergeData(locale: Locale): PersonalData {
  const base = fallback[locale];
  const json = readPersonalJson();
  const override = json[locale];
  if (!override) return base;
  return {
    ...base,
    ...override,
    socials: { ...base.socials, ...(override.socials ?? {}) },
  } as PersonalData;
}

export async function getPersonalData(
  locale: Locale,
): Promise<PersonalData> {
  const json = readPersonalJson();
  if (json[locale]) {
    return mergeData(locale);
  }
  const local = await loadLocal();
  return (local?.[locale] ?? fallback[locale]) as PersonalData;
}

export type { PersonalLocalType };
