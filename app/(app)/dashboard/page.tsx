"use client";
import Link from "next/link";
import { Leaf, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { HabitRow } from "@/components/habits/habit-row";
import { EmptyState } from "@/components/layout/empty-state";
import { LoadingState } from "@/components/layout/loading-state";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeader } from "@/components/layout/section-header";
import { TreeArt } from "@/components/tree/tree-art";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { formatLongDate } from "@/lib/date";
import { getErrorMessage } from "@/lib/utils";
import type { DailyLog, Habit, UserTree } from "@/types/contracts";

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]); const [daily, setDaily] = useState<DailyLog | null>(null); const [tree, setTree] = useState<UserTree | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = useCallback(async () => { setLoading(true); try { const [habitData, dailyData, treeData] = await Promise.all([apiClient<Habit[]>("/habits"), apiClient<DailyLog>("/daily-log"), apiClient<UserTree>("/tree")]); const todayIds = new Set(dailyData.habits.map(item => item.id)); setHabits(habitData.filter(item => todayIds.has(item.id))); setDaily(dailyData); setTree(treeData); } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); } }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => clearTimeout(timer); }, [load]);
  async function check(id: string) { try { await apiClient(`/habits/${id}/check`, { method: "PATCH" }); await load(); } catch (err) { setError(getErrorMessage(err)); } }
  if (loading) return <LoadingState />;
  const done = daily?.checked_count || 0, total = daily?.total_habits || 0, percent = total ? Math.round(done / total * 100) : 0;
  return <div className="view-stack">{error && <div className="error-box">{error}</div>}<PageHeader eyebrow={formatLongDate()} title="Hôm nay của bạn" description={total ? `${total - done} thói quen đang chờ bạn hoàn thành.` : "Hãy lên lịch thói quen đầu tiên cho hôm nay."} action={<Button asChild variant="outline"><Link href="/habits"><Plus />Thêm thói quen</Link></Button>} /><section className="progress-hero"><div className="progress-copy"><span className="section-label">TIẾN ĐỘ HÔM NAY</span><strong>{percent}<small>%</small></strong><p>{done} / {total} đã hoàn thành</p></div><div className="stride-path" style={{ "--progress": `${percent}%` } as React.CSSProperties}><span /><span /><span /><span /><span /></div><div className="tree-mini"><TreeArt stage={tree?.stage || 0} /><div><span>Cây tiến bộ</span><strong>Level {tree?.stage || 0}</strong><small>{tree?.exp || 0} EXP</small></div></div></section><SectionHeader label="DANH SÁCH HÔM NAY" title="Những bước cần đi" side={habits.length ? `${done}/${total}` : undefined} />{habits.length ? <div className="habit-list">{habits.map((habit, index) => <HabitRow key={habit.id} habit={habit} index={index} onCheck={check} />)}</div> : <EmptyState icon={<Leaf />} title="Hôm nay đang trống" description="Lịch của bạn chưa có thói quen nào cho ngày này." action="Mở lịch thói quen" onAction={() => location.assign("/habits")} />}</div>;
}
