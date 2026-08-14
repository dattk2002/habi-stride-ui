"use client";
import { CalendarDays, Check, Flame, Leaf } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { V2CreateHabitDialog } from "@/components/v2/create-habit-dialog";
import { V2PageHeader } from "@/components/v2/page-header";
import { V2SuccessDialog } from "@/components/v2/success-dialog";
import { V2LoadingState as LoadingState } from "@/components/v2/loading-state";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/utils";
import type { Habit } from "@/types/contracts";
import { usePreferences } from "@/components/providers/preferences-provider";

export default function HabitsV2Page() {
  const { t } = usePreferences(); const [habits, setHabits] = useState<Habit[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [completed, setCompleted] = useState<{name:string;exp:number;bonus:number}|null>(null);
  const load = useCallback(async () => { setLoading(true); try { setHabits(await apiClient<Habit[]>("/habits")); } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); } }, []);
  useEffect(() => { const timer = setTimeout(() => void load(), 0); return () => clearTimeout(timer); }, [load]);
  async function check(id: string) { try { const result = await apiClient<{exp_gained:number;milestone_bonus:number}>(`/habits/${id}/check`, { method: "PATCH" }); setCompleted({ name: habits.find(item => item.id === id)?.name || t("habitsTitle"), exp: result.exp_gained, bonus: result.milestone_bonus }); await load(); } catch (err) { setError(getErrorMessage(err)); } }
  if (loading) return <LoadingState />; const categories = { code:t("code"),health:t("health"),knowledge:t("knowledge"),other:t("other") };
  return <div className="v2-view"><V2PageHeader eyebrow={t("habitsEyebrow")} title={t("habitsTitle")} description={t("habitsDescription")} action={<V2CreateHabitDialog onCreated={load} />} />{error && <div className="error-box">{error}</div>}{habits.length ? <section className="v2-habit-accordion" data-reveal>{habits.map((habit,index) => <article key={habit.id} className={`v2-habit-panel panel-${index%4}`} data-scroll-media><div className="v2-panel-top"><span>{String(index+1).padStart(2,"0")}</span><Leaf /></div><div className="v2-panel-copy"><small>{categories[habit.category]}</small><h2>{habit.name}</h2><p><CalendarDays />{(habit.scheduleDays || []).length === 7 ? t("everyDay") : `${habit.scheduleDays.length} ${t("days")}`}</p></div><div className="v2-panel-stats"><div><Flame /><strong>{habit.stats?.currentStreak || 0}</strong><span>{t("currentStreak")}</span></div><div><Check /><strong>{habit.stats?.totalChecked || 0}</strong><span>{t("totalCompletions")}</span></div></div><Button variant={habit.checkedToday ? "default" : "outline"} disabled={habit.checkedToday} onClick={() => check(habit.id)}>{habit.checkedToday ? <><Check />{t("doneToday")}</> : t("markComplete")}</Button></article>)}</section> : <div className="v2-empty" data-reveal><span><CalendarDays /></span><h2>{t("scheduleEmpty")}</h2><p>{t("scheduleEmptyDescription")}</p><V2CreateHabitDialog onCreated={load} /></div>}<V2SuccessDialog open={Boolean(completed)} onOpenChange={open => {if(!open)setCompleted(null);}} title={t("completedToday")} description={completed ? t("keptRhythm",{name:completed.name}) : ""} reward={completed ? `+${completed.exp} EXP${completed.bonus ? ` · ${t("streakBonus",{bonus:completed.bonus})}` : ""}` : undefined} /></div>;
}
