import { Check, Flame, Leaf } from "lucide-react";
import { CATEGORY_LABELS, WEEK_DAYS } from "@/lib/constants";
import type { Habit } from "@/types/contracts";
import { Button } from "@/components/ui/button";

export function HabitRow({ habit, index, onCheck }: { habit: Habit; index: number; onCheck: (id: string) => void }) {
  const done = habit.checkedToday ?? habit.checked ?? false;
  const days = (habit.scheduleDays || []).map(value => WEEK_DAYS.find(day => day.value === Number(value))?.short).filter(Boolean).join(" · ");
  return <article className={`habit-row ${done ? "done" : ""}`}><span className="habit-index">{String(index + 1).padStart(2, "0")}</span><span className="habit-glyph"><Leaf /></span><div className="habit-info"><strong>{habit.name}</strong><span>{CATEGORY_LABELS[habit.category]} · {days || "Mỗi ngày"}</span></div><div className="streak"><Flame />{habit.stats?.currentStreak || 0} ngày</div><Button variant={done ? "default" : "outline"} size="icon" disabled={done} onClick={() => onCheck(habit.id)} aria-label={done ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}>{done ? <Check /> : <span className="check-dot" />}</Button></article>;
}
