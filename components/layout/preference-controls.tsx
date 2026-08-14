"use client";

import { Languages, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/providers/preferences-provider";

export function PreferenceControls() {
  const { locale, setLocale, theme, setTheme, t } = usePreferences();
  return <div className="preference-controls">
    <div className="language-toggle" aria-label={t("language")}><Languages aria-hidden="true" /><button className={locale === "vi" ? "active" : ""} onClick={() => setLocale("vi")} aria-pressed={locale === "vi"}>VI</button><button className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")} aria-pressed={locale === "en"}>EN</button></div>
    <Button className="theme-toggle" variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={theme === "light" ? t("themeDark") : t("themeLight")}>{theme === "light" ? <Moon /> : <Sun />}</Button>
  </div>;
}
