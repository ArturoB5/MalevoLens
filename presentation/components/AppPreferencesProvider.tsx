"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Locale, UiText } from "@/infrastructure/i18n";
import { attackModulesByLocale, uiTextByLocale } from "@/infrastructure/i18n";

type ThemeMode = "dark" | "light";

type AppPreferences = {
  attacks: typeof attackModulesByLocale.es;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: ThemeMode) => void;
  theme: ThemeMode;
  text: UiText;
  toggleTheme: () => void;
};

const AppPreferencesContext = createContext<AppPreferences | undefined>(undefined);

export function AppPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");
  const [theme, setThemeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    const storedLocale = window.localStorage.getItem("malevolens-locale");
    const storedTheme = window.localStorage.getItem("malevolens-theme");

    if (storedLocale === "es" || storedLocale === "en") {
      setLocaleState(storedLocale);
    }

    if (storedTheme === "dark" || storedTheme === "light") {
      setThemeState(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem("malevolens-locale", locale);
  }, [locale]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("malevolens-theme", theme);
  }, [theme]);

  const value = useMemo<AppPreferences>(
    () => ({
      attacks: attackModulesByLocale[locale],
      locale,
      setLocale: setLocaleState,
      setTheme: setThemeState,
      text: uiTextByLocale[locale],
      theme,
      toggleTheme: () => setThemeState((current) => (current === "dark" ? "light" : "dark"))
    }),
    [locale, theme]
  );

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);

  if (!context) {
    throw new Error("useAppPreferences must be used within AppPreferencesProvider");
  }

  return context;
}
