"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, CalendarCheck2, ListChecks, LogOut, Settings, TreePine } from "lucide-react";
import { useEffect, useState } from "react";
import { Brand } from "@/components/layout/brand";
import { V2LoadingState as LoadingState } from "./loading-state";
import { PreferenceControls } from "@/components/layout/preference-controls";
import { Button } from "@/components/ui/button";
import { session } from "@/lib/session";
import type { User, LoginReward } from "@/types/contracts";
import type { AppRoute } from "@/types/ui/navigation";
import type { MessageKey } from "@/lib/i18n";
import { V2FloatingChat } from "./floating-chat";
import { V2ProfileOnboarding } from "./profile-onboarding";
import { V2SuccessDialog as SuccessDialog } from "./success-dialog";
import { apiClient } from "@/lib/api-client";
import { usePreferences } from "@/components/providers/preferences-provider";
import { PageMotion } from "@/components/motion/page-motion";

const nav: { href: AppRoute; label: MessageKey; icon: typeof CalendarCheck2 }[] = [
  { href: "/dashboard", label: "navToday", icon: CalendarCheck2 }, { href: "/habits", label: "navHabits", icon: ListChecks }, { href: "/insights", label: "navInsights", icon: BarChart3 }, { href: "/tree", label: "navTree", icon: TreePine }, { href: "/settings", label: "navSettings", icon: Settings },
];
function publicPath(pathname: string) { return pathname.replace(/^\/v2/, "") || "/dashboard"; }
export function V2AppShell({ children }: { children: React.ReactNode }) {
  const rawPath = usePathname(); const pathname = publicPath(rawPath); const router = useRouter(); const { t } = usePreferences();
  const [user, setUser] = useState<User | null>(null); const [ready, setReady] = useState(false); const [reward, setReward] = useState<LoginReward | null>(null);
  useEffect(() => { const timer = setTimeout(() => { const current = session.user(); if (!current || session.isExpired()) return session.expire(); setUser(current); setReward(session.takeLoginReward()); setReady(true); apiClient<User>(`/users/${current.id}`).then(fresh => { session.updateUser(fresh); setUser(fresh); }).catch(() => undefined); }, 0); return () => clearTimeout(timer); }, []);
  useEffect(() => { if (!ready) return; const remaining = session.expiresAt() - Date.now(); if (remaining <= 0) return session.expire(); const timer = setTimeout(() => session.expire(), remaining); return () => clearTimeout(timer); }, [ready]);
  function logout() { session.clear(); router.replace("/login"); }
  if (!ready || !user) return <LoadingState />;
  const avatar = user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : (user.displayName || user.email)[0].toUpperCase();
  const active = nav.find(item => item.href === pathname) || nav[0]; const ActiveIcon = active.icon;
  return <main className="v2-shell overflow-x-hidden w-full max-w-full">
    <aside className="v2-sidebar"><div className="v2-sidebar-brand"><Brand /><p>{t("appTagline")}</p></div><nav aria-label={t("menu")}>{nav.map(item => <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : ""}><item.icon /><span>{t(item.label)}</span><i /></Link>)}</nav><div className="v2-user"><span className="avatar">{avatar}</span><div><strong>{user.displayName || user.email.split("@")[0]}</strong><small>{user.email}</small></div><Button variant="ghost" size="icon" onClick={logout} aria-label={t("logout")}><LogOut /></Button></div></aside>
    <header className="v2-header"><div className="v2-mobile-brand"><Brand /></div><div className="v2-route-title"><ActiveIcon /><span>{t(active.label)}</span></div><div className="v2-header-actions"><PreferenceControls /><Link href="/settings" className="v2-header-avatar" aria-label={t("navSettings")}><span className="avatar">{avatar}</span></Link></div></header>
    <section className="v2-content"><PageMotion>{children}</PageMotion></section>
    <nav className="v2-bottom-nav" aria-label={t("menu")}>{nav.map(item => <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : ""}><item.icon /><span>{t(item.label)}</span></Link>)}</nav>
    <V2FloatingChat /><V2ProfileOnboarding user={user} onUpdated={setUser} /><SuccessDialog open={Boolean(reward)} onOpenChange={open => { if (!open) setReward(null); }} title={t("loginRewardTitle", { count: reward?.milestone || 0 })} description={t("loginRewardDescription")} reward={reward ? t("received", { item: reward.item.replaceAll("_", " ") }) : undefined} />
  </main>;
}
