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
  const [loadingg, setLoading] = useState(true);
  const BACKEND = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    let mounted = true;

    async function fetchMe() {
      try {
        const data = await apiClient.get<{ user: AuthUser }>(
          `${BACKEND}/api/auth/me`,
        );
        if (mounted) setUser(data.user);
      } catch (err: any) {
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
    loadingg,
    isAuthenticated: !!user,
  };
}
