// contexts/AuthContext.tsx
"use client";

import { isValidLocale, type Locale } from "@/i18n/config";
import { setLanguageCookie, getLanguageCookie } from "@/lib/i18n/language";
import { CurrentUserData } from "@/schemas/user-schemas";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const AuthContext = createContext<{
  user: CurrentUserData | null;
  setUser: (user: CurrentUserData) => void;
  clearUser: () => void;
  isLoading: boolean;
  updateLanguage: (language: Locale) => Promise<void>;
}>({
  user: null,
  setUser: () => {},
  clearUser: () => {},
  isLoading: true,
  updateLanguage: async () => {},
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

          // Sync user's language to cookie if it differs
          if (data.user?.language && isValidLocale(data.user.language)) {
            const currentCookie = getLanguageCookie();
            if (currentCookie !== data.user.language) {
              setLanguageCookie(data.user.language);
              // Reload to apply the new language
              window.location.reload();
            }
          }
        }
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  function clearUser() {
    setUser(null);
  }

  async function updateLanguage(language: Locale) {
    try {
      const res = await fetch("/api/user/language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });

      if (res.ok && user) {
        setUser({ ...user, language });
        setLanguageCookie(language);
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update language", error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, clearUser, updateLanguage }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);