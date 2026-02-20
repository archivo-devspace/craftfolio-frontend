import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Locale, translate } from "@/lib/i18n";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: string) => string;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: "en",
      setLocale: (locale) => set({ locale }),
      toggleLocale: () =>
        set((state) => ({ locale: state.locale === "en" ? "mm" : "en" })),
      t: (key) => translate(get().locale, key),
    }),
    {
      name: "locale-storage",
      partialize: (state) => ({ locale: state.locale }),
    },
  ),
);

