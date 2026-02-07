import { apiClient } from "./api-client";
import { setAccessToken, clearAccessToken } from "./token-store";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: string;
  username: string;
  email: string;
}

interface LoginResponse {
  accessToken: string;
  message?: string;
  user: User;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await apiClient.post<LoginResponse>(
      `${BACKEND}/api/auth/login`,
      { email, password },
      { skipRefresh: true },
    );

    setAccessToken(res.accessToken);

    return {
      success: true,
      message: res.message,
      user: res.user,
    };
  },

  async signup(
    username: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${BACKEND}/api/auth/signup`, {
      username,
      email,
      password,
    });
  },

  async logout(): Promise<void> {
    await apiClient.post(
      `${BACKEND}/api/auth/logout`,
      {},
      { skipRefresh: true },
    );
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    clearAccessToken();
  },

  async forgotPassword(email: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${BACKEND}/api/auth/forgot-password`, {
      email,
    });
  },

  async resetPassword(
    token: string,
    email: string,
    newPassword: string,
  ): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${BACKEND}/api/auth/reset-password`, {
      token,
      email,
      newPassword,
    });
  },
};
