export type AnalyticsOverview = { from: string; to: string; total_tasks_completed: number; best_streak: number; most_consistent_habit: { id: string; name: string; count: number } | null };
export type HeatmapPoint = { date: string; count: number };
