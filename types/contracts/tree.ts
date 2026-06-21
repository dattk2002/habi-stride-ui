export type Achievement = { id: string; achievementKey: string; unlockedAt: string };
export type UserTree = { id: string; userId: string; stage: number; branch: string; exp: number; next_stage_exp: number; items: string[]; achievements: Achievement[] };
