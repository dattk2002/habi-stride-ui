import type { AuthResponse, User } from "@/types/contracts";

const TOKEN_KEY = "habistride_access_token";
const USER_KEY = "habistride_user";
const LOGIN_REWARD_KEY = "habistride_login_reward";

function decodePayload(token: string): { exp?: number } | null {
  try {
    const segment = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(segment.padEnd(Math.ceil(segment.length / 4) * 4, "=")));
  } catch { return null; }
}

export const session = {
  token: () => typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY),
  user: (): User | null => {
    if (typeof window === "undefined") return null;
    try { const value = localStorage.getItem(USER_KEY); return value ? JSON.parse(value) : null; } catch { return null; }
  },
  expiresAt: () => { const token = session.token(); const exp = token ? decodePayload(token)?.exp : undefined; return exp ? exp * 1000 : 0; },
  isExpired: () => { const expiresAt = session.expiresAt(); return !expiresAt || expiresAt <= Date.now(); },
  save: (auth: AuthResponse) => { localStorage.setItem(TOKEN_KEY, auth.accessToken); localStorage.setItem(USER_KEY, JSON.stringify(auth.user)); if (auth.loginReward) localStorage.setItem(LOGIN_REWARD_KEY, JSON.stringify(auth.loginReward)); },
  takeLoginReward: () => { if (typeof window === "undefined") return null; const value = localStorage.getItem(LOGIN_REWARD_KEY); localStorage.removeItem(LOGIN_REWARD_KEY); try { return value ? JSON.parse(value) : null; } catch { return null; } },
  updateUser: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clear: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); localStorage.removeItem(LOGIN_REWARD_KEY); },
  expire: () => { session.clear(); if (typeof window !== "undefined") window.location.replace("/login"); },
};
