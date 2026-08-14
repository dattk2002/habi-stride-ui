import { Check, Flame, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Habit } from "@/types/contracts";
import { usePreferences } from "@/components/providers/preferences-provider";

export function V2HabitRow({ habit, index, onCheck }: { habit: Habit; index: number; onCheck: (id: string) => void }) {
  const { t } = usePreferences(); const done = habit.checkedToday ?? habit.checked ?? false;
  const categories = { code: t("code"), health: t("health"), knowledge: t("knowledge"), other: t("other") };
  return <article className={`v2-habit-row ${done ? "done" : ""}`} data-stack-card><span className="v2-habit-number">{String(index + 1).padStart(2, "0")}</span><span className="v2-habit-icon"><Leaf /></span><div><strong>{habit.name}</strong><small>{categories[habit.category]}</small></div><span className="v2-streak"><Flame />{habit.stats?.currentStreak || 0} {t("days")}</span><Button variant={done ? "default" : "outline"} size="icon" disabled={done} onClick={() => onCheck(habit.id)} aria-label={done ? t("doneToday") : t("markComplete")}>{done ? <Check /> : <i />}</Button></article>;
}
