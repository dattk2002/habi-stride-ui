export type UserStat = { id: string; userId: string; totalHabitsDone: number; highestStreak: number; totalLoginDays: number; currentLoginStreak: number; lastLoginDate: string | null };
export type User = { id: string; email: string; displayName: string | null; avatarUrl: string | null; profileCompleted: boolean; createdAt: string; authProvider: "local" | "google"; emailVerified: boolean; stat?: UserStat };
export type UpdateUserRequest = { email?: string; password?: string; displayName?: string };
export type LoginReward = { milestone: number; item: string; achievementKey: string };
