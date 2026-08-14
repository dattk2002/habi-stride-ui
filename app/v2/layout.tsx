import type { Metadata } from "next";
import "../redesign.css";
import { PreferencesProvider } from "@/components/providers/preferences-provider";

export const metadata: Metadata = { icons: { icon: "/habistride-mark-28.png", apple: "/habistride-logo.png" } };
export default function V2Layout({ children }: { children: React.ReactNode }) { return <PreferencesProvider><div className="v2-root">{children}</div></PreferencesProvider>; }
