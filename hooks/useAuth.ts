"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getAccessToken } from "@/lib/token-store";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const BACKEND = process.env.NEXT_PUBLIC_API_URL;

  async function fetchMe() {
    if (!getAccessToken()) {
      setUser(null);
      setAuthLoading(false);
      return;
    }

    try {
      const data = await apiClient.get<{ user: any }>(`${BACKEND}/api/auth/me`);
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }

  useEffect(() => {
    fetchMe();

    const handler = () => fetchMe();
    window.addEventListener("auth-changed", handler);

    return () => {
      window.removeEventListener("auth-changed", handler);
    };
  }, []);

  return {
    user,
    authLoading,
    isAuthenticated: !!user,
  };
}
