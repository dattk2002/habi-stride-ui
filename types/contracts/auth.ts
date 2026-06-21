import type { LoginReward, User } from "./user";

export type LoginRequest = { email: string; password: string };
export type RegisterRequest = LoginRequest & { verificationToken: string };
export type GoogleLoginRequest = { credential: string };
export type RequestEmailOtpRequest = { email: string };
export type RequestEmailOtpResponse = { sent: boolean; expiresInSeconds: number; resendAfterSeconds: number };
export type VerifyEmailOtpRequest = { email: string; code: string };
export type VerifyEmailOtpResponse = { verified: boolean; verificationToken: string };
export type AuthResponse = { accessToken: string; refreshToken: string; user: User; loginReward: LoginReward | null };
