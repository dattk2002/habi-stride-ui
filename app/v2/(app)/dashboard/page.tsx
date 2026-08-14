"use client";
import Link from "next/link";
import { ArrowUpRight, Leaf, Plus, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { V2HabitRow } from "@/components/v2/habit-row";
import { V2PageHeader } from "@/components/v2/page-header";
import { TreeVisual } from "@/components/v2/tree-visual";
import { V2LoadingState as LoadingState } from "@/components/v2/loading-state";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/utils";
import type { DailyLog, Habit, UserTree } from "@/types/contracts";
import { usePreferences } from "@/components/providers/preferences-provider";

export default function DashboardV2Page() {
  const { locale, t } = usePreferences(); const [habits, setHabits] = useState<Habit[]>([]); const [daily, setDaily] = useState<DailyLog | null>(null); const [tree, setTree] = useState<UserTree | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = useCallback(async () => { setLoading(true); try { const [habitData, dailyData, treeData] = await Promise.all([apiClient<Habit[]>("/habits"), apiClient<DailyLog>("/daily-log"), apiClient<UserTree>("/tree")]); const ids = new Set(dailyData.habits.map(item => item.id)); setHabits(habitData.filter(item => ids.has(item.id))); setDaily(dailyData); setTree(treeData); } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); } }, []);
  useEffect(() => { const timer = setTimeout(() => void load(), 0); return () => clearTimeout(timer); }, [load]);
  async function check(id: string) { try { await apiClient(`/habits/${id}/check`, { method: "PATCH" }); await load(); } catch (err) { setError(getErrorMessage(err)); } }
  if (loading) return <LoadingState />;
  const done = daily?.checked_count || 0, total = daily?.total_habits || 0, percent = total ? Math.round(done / total * 100) : 0;
  const date = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  return <div className="v2-view">
    {error && <div className="error-box">{error}</div>}
    <V2PageHeader eyebrow={date} title={t("dashboardTitle")} description={total ? t("dashboardWaiting", { count: total - done }) : t("dashboardEmptyDescription")} action={<Button asChild><Link href="/habits"><Plus />{t("addHabit")}</Link></Button>} />
    <section className="v2-dashboard-bento" data-reveal>
      <article className="v2-progress-card"><div className="v2-progress-copy"><p>{t("todayProgress")}</p><strong>{percent}<small>%</small></strong><span>{done} / {total} {t("completed")}</span></div><div className="v2-progress-orbit" style={{ "--progress": `${percent * 3.6}deg` } as React.CSSProperties}><div><Sparkles /><b>{done}</b><span>{t("completed")}</span></div></div><div className="v2-path"><i /><i /><i /><i /><i /><span style={{ width: `${percent}%` }} /></div></article>
      <Link href="/tree" className="v2-tree-card group"><div><p>{t("growthCompanion")}</p><h2>{t("progressTree")}</h2><span>{t("level")} {tree?.stage || 0} · {tree?.exp || 0} EXP <ArrowUpRight /></span></div><TreeVisual stage={tree?.stage || 0} /></Link>
      <article className="v2-note-card"><Leaf /><p>{locale === "vi" ? "Sự bền bỉ không cần ồn ào. Nó chỉ cần được lặp lại." : "Consistency does not need to be loud. It only needs to be repeated."}</p></article>
    </section>
    <section className="v2-list-section" data-reveal><div className="v2-section-heading"><div><p>{t("todayList")}</p><h2>{t("nextSteps")}</h2></div>{habits.length > 0 && <span>{done}/{total}</span>}</div>{habits.length ? <div className="v2-habit-list">{habits.map((habit, index) => <V2HabitRow key={habit.id} habit={habit} index={index} onCheck={check} />)}</div> : <div className="v2-empty"><span><Leaf /></span><h2>{t("todayEmpty")}</h2><p>{t("todayEmptyDescription")}</p><Button asChild><Link href="/habits">{t("openHabitSchedule")}</Link></Button></div>}</section>
  </div>;
}
