import { createContext, useContext, useState, type ReactNode } from "react";
import { authService } from "../services/authService";
import type { User } from "../types";
const AuthContext = createContext<{
  user: User | null;
  setUser: (u: User | null) => void;
}>({ user: null, setUser: () => {} });
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(authService.getCurrentUser);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
