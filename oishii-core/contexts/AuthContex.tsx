// contexts/AuthContext.tsx
"use client";

import { CurrentUserData } from "@/schemas/user-schemas";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const AuthContext = createContext<{
  user: CurrentUserData | null;
  setUser: (user: CurrentUserData) => void;
  isLoading: boolean;
}>({
  user: null,
  setUser: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch current user from your API on mount
    async function loadUser() {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);