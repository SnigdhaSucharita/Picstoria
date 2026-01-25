import { apiClient } from "./api-client";

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const csrfToken = await apiClient.getCsrfToken();
    return apiClient.post<AuthResponse>(
      "/api/auth/login",
      { email, password },
      csrfToken,
    );
  },

  async signup(
    username: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const csrfToken = await apiClient.getCsrfToken();
    return apiClient.post<AuthResponse>(
      "/api/auth/signup",
      { username, email, password },
      csrfToken,
    );
  },

  async logout(): Promise<void> {
    await apiClient.post("/api/auth/logout", {});
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
  },

  async forgotPassword(email: string): Promise<AuthResponse> {
    const csrfToken = await apiClient.getCsrfToken();
    return apiClient.post<AuthResponse>(
      "/api/auth/forgot-password",
      { email },
      csrfToken,
    );
  },

  async resetPassword(
    token: string,
    email: string,
    newPassword: string,
  ): Promise<AuthResponse> {
    const csrfToken = await apiClient.getCsrfToken();
    return apiClient.post<AuthResponse>(
      "/api/auth/reset-password",
      { token, email, newPassword },
      csrfToken,
    );
  },
};
