"use client";
import { CalendarDays, Check, Leaf } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CreateHabitDialog } from "@/components/habits/create-habit-dialog";
import { EmptyState } from "@/components/layout/empty-state";
import { LoadingState } from "@/components/layout/loading-state";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { CATEGORY_LABELS, WEEK_DAYS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";
import type { Habit } from "@/types/contracts";
import { SuccessDialog } from "@/components/ui/success-dialog";

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [completed, setCompleted] = useState<{ name: string; exp: number; bonus: number } | null>(null);
  const load = useCallback(async () => { setLoading(true); try { setHabits(await apiClient<Habit[]>("/habits")); } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); } }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => clearTimeout(timer); }, [load]);
  async function check(id: string) { try { const result = await apiClient<{ exp_gained: number; milestone_bonus: number }>(`/habits/${id}/check`, { method: "PATCH" }); setCompleted({ name: habits.find(habit => habit.id === id)?.name || "Thói quen", exp: result.exp_gained, bonus: result.milestone_bonus }); await load(); } catch (err) { setError(getErrorMessage(err)); } }
  if (loading) return <LoadingState />;
  return <div className="view-stack">{error && <div className="error-box">{error}</div>}<PageHeader eyebrow="Lịch cá nhân" title="Thói quen" description="Chọn ngày thực hiện để tạo một nhịp tuần phù hợp." action={<CreateHabitDialog onCreated={load} />} />{habits.length ? <div className="habit-grid">{habits.map(habit => { const days = (habit.scheduleDays || []).map(value => WEEK_DAYS.find(day => day.value === Number(value))?.short).filter(Boolean); return <Card key={habit.id} className="habit-card"><CardContent><div className="card-top"><span className="habit-glyph"><Leaf /></span><Badge>{CATEGORY_LABELS[habit.category]}</Badge></div><h3>{habit.name}</h3><div className="schedule-summary"><CalendarDays /><span>{days.length === 7 ? "Mỗi ngày" : days.join(" · ")}</span></div><div className="card-stats"><div><strong>{habit.stats?.currentStreak || 0}</strong><span>Chuỗi hiện tại</span></div><div><strong>{habit.stats?.totalChecked || 0}</strong><span>Lần hoàn thành</span></div></div><Button className="w-full" variant={habit.checkedToday ? "default" : "outline"} disabled={habit.checkedToday} onClick={() => check(habit.id)}>{habit.checkedToday ? <><Check />Đã hoàn thành hôm nay</> : "Đánh dấu hoàn thành"}</Button></CardContent></Card>; })}</div> : <EmptyState icon={<CalendarDays />} title="Lịch đang trống" description="Tạo thói quen đầu tiên và chọn ngày trực tiếp trên lịch tuyến tính." />}<SuccessDialog open={Boolean(completed)} onOpenChange={open => { if (!open) setCompleted(null); }} title="Đã hoàn thành hôm nay" description={completed ? `Bạn đã giữ nhịp cho “${completed.name}”.` : ""} reward={completed ? `+${completed.exp} EXP${completed.bonus ? ` · gồm ${completed.bonus} EXP thưởng chuỗi` : ""}` : undefined} /></div>;
}
