export type HabitCategory = "code" | "health" | "knowledge" | "other";
export type HabitFrequency = "daily" | "weekly";
export type HabitStat = { id: string; habitId: string; currentStreak: number; longestStreak: number; totalChecked: number };
export type Habit = { id: string; userId: string; name: string; category: HabitCategory; icon: string; frequency: HabitFrequency; scheduleDays: number[]; createdAt: string; checkedToday?: boolean; checked?: boolean; stats?: HabitStat | null };
export type CreateHabitRequest = { name: string; category: HabitCategory; icon?: string; scheduleDays: number[] };
export type DailyLog = { date: string; checked_count: number; total_habits: number; habits: Habit[] };
export type CheckHabitResponse = { habitId: string; date: string; checked: boolean; exp_gained: number; milestone_bonus: number; stats: HabitStat };
