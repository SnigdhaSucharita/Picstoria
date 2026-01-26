"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchMe() {
      try {
        const data = await apiClient.get<{ user: AuthUser }>("/api/auth/me");
        if (mounted) setUser(data.user);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchMe();
    return () => {
      mounted = false;
    };
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
