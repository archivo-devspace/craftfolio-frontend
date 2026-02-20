import en from "@/locales/en.json";
import mm from "@/locales/mm.json";

export type Locale = "en" | "mm";

const dictionaries: Record<Locale, Record<string, unknown>> = {
  en,
  mm,
};

function getByPath(source: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[segment];
  }, source);
}

export function translate(locale: Locale, key: string): string {
  const localizedValue = getByPath(dictionaries[locale], key);
  if (typeof localizedValue === "string") return localizedValue;

  const fallbackValue = getByPath(dictionaries.en, key);
  if (typeof fallbackValue === "string") return fallbackValue;

  return key;
}

