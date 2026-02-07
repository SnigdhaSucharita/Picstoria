"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getAccessToken } from "@/lib/token-store";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loadingg, setLoading] = useState(true);
  const BACKEND = process.env.NEXT_PUBLIC_API_URL;

  async function fetchMe() {
    if (!getAccessToken()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await apiClient.get<{ user: any }>(`${BACKEND}/api/auth/me`);
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
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
    loadingg,
    isAuthenticated: !!user,
  };
}
