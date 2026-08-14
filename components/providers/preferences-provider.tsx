"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { interpolate, messages, type Locale, type MessageKey } from "@/lib/i18n";

type Theme = "light" | "dark";
type Preferences = { locale: Locale; theme: Theme; setLocale: (value: Locale) => void; setTheme: (value: Theme) => void; t: (key: MessageKey, values?: Record<string, string | number>) => string };
const PreferencesContext = createContext<Preferences | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("vi");
  const [theme, setThemeState] = useState<Theme>("light");
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const savedLocale = localStorage.getItem("habistride-locale") as Locale | null;
      const savedTheme = localStorage.getItem("habistride-theme") as Theme | null;
      setLocaleState(savedLocale || (navigator.language.toLowerCase().startsWith("vi") ? "vi" : "en"));
      setThemeState(savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => { document.documentElement.dataset.theme = theme; document.documentElement.lang = locale; }, [locale, theme]);
  const value = useMemo<Preferences>(() => ({ locale, theme,
    setLocale(next) { setLocaleState(next); localStorage.setItem("habistride-locale", next); },
    setTheme(next) { setThemeState(next); localStorage.setItem("habistride-theme", next); },
    t(key, values) { return interpolate(messages[locale][key], values); },
  }), [locale, theme]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error("usePreferences must be used within PreferencesProvider");
  return value;
}
