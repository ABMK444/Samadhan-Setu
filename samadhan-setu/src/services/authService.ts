import { demoUsers } from "../data/seed";
import type { Role, User } from "../types";
const KEY = "samadhan-session";
export const authService = {
  // TODO BACKEND: POST /api/auth/login; use secure HttpOnly session cookies.
  // These public credentials and role checks are for demonstration, not security.
  login(credentials: {
    email: string;
    password: string;
    role: Role;
    remember: boolean;
  }): User {
    const user = demoUsers.find(
      (u) =>
        u.role === credentials.role &&
        u.email.toLowerCase() === credentials.email.trim().toLowerCase(),
    );
    if (!user || credentials.password !== "Demo@123")
      throw Error(
        "Use the demo email for your selected role and password Demo@123.",
      );
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    (credentials.remember ? localStorage : sessionStorage).setItem(
      KEY,
      JSON.stringify(user),
    );
    return user;
  },
  logout() {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
  },
  getCurrentUser(): User | null {
    try {
      const value = JSON.parse(
        sessionStorage.getItem(KEY) || localStorage.getItem(KEY) || "null",
      ) as User | null;
      return (
        demoUsers.find((u) => u.id === value?.id && u.role === value.role) ||
        null
      );
    } catch {
      return null;
    }
  },
};
export function requireRole(role: Role) {
  const user = authService.getCurrentUser();
  if (!user || user.role !== role)
    throw Error("This action is unavailable for your role.");
  return user;
}
