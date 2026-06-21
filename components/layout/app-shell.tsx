"use client";
/* User avatars are validated data URLs returned by the API. */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, CalendarCheck2, ListChecks, LogOut, Settings, TreePine } from "lucide-react";
import { useEffect, useState } from "react";
import { Brand } from "./brand";
import { LoadingState } from "./loading-state";
import { Button } from "@/components/ui/button";
import { session } from "@/lib/session";
import type { User } from "@/types/contracts";
import type { AppRoute } from "@/types/ui/navigation";
import { FloatingChat } from "@/components/chat/floating-chat";
import { ProfileOnboarding } from "@/components/account/profile-onboarding";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { apiClient } from "@/lib/api-client";
import type { LoginReward } from "@/types/contracts";

const nav: { href: AppRoute; label: string; icon: typeof CalendarCheck2 }[] = [
  { href: "/dashboard", label: "Hôm nay", icon: CalendarCheck2 }, { href: "/habits", label: "Thói quen", icon: ListChecks },
  { href: "/insights", label: "Phân tích", icon: BarChart3 }, { href: "/tree", label: "Cây tiến bộ", icon: TreePine },
  { href: "/settings", label: "Cài đặt", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const router = useRouter(); const [user, setUser] = useState<User | null>(null); const [ready, setReady] = useState(false); const [reward, setReward] = useState<LoginReward | null>(null);
  useEffect(() => { const timer = window.setTimeout(() => { const current = session.user(); if (!current || session.isExpired()) return session.expire(); setUser(current); setReward(session.takeLoginReward()); setReady(true); apiClient<User>(`/users/${current.id}`).then(fresh => { session.updateUser(fresh); setUser(fresh); }).catch(() => undefined); }, 0); return () => clearTimeout(timer); }, [router]);
  useEffect(() => { if (!ready) return; const remaining = session.expiresAt() - Date.now(); if (remaining <= 0) return session.expire(); const timer = window.setTimeout(() => session.expire(), remaining); return () => clearTimeout(timer); }, [ready]);
  function logout() { session.clear(); router.replace("/login"); }
  if (!ready || !user) return <LoadingState />;
  const avatar = user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : (user.displayName || user.email)[0].toUpperCase();
  return <div className="app-shell"><aside className="sidebar"><Brand /><nav>{nav.map(item => <Button asChild variant="ghost" key={item.href} className={pathname === item.href ? "active" : ""}><Link href={item.href}><item.icon />{item.label}</Link></Button>)}</nav><div className="sidebar-user"><span className="avatar">{avatar}</span><div><strong>{user.displayName || user.email.split("@")[0]}</strong><small>{user.email}</small></div><Button variant="ghost" size="icon" onClick={logout} aria-label="Đăng xuất"><LogOut /></Button></div></aside><header className="mobile-header"><Brand /><span className="avatar">{avatar}</span></header><main className="content">{children}</main><nav className="bottom-nav">{nav.slice(0, 5).map(item => <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : ""}><item.icon /><span>{item.label}</span></Link>)}</nav><FloatingChat /><ProfileOnboarding user={user} onUpdated={setUser} /><SuccessDialog open={Boolean(reward)} onOpenChange={open => { if (!open) setReward(null); }} title={`Chuỗi đăng nhập ${reward?.milestone || 0} ngày`} description="Bạn đã giữ nhịp đăng nhập đều đặn và mở khóa một phần thưởng mới." reward={reward ? `Đã nhận: ${reward.item.replaceAll("_", " ")}` : undefined} /></div>;
}
