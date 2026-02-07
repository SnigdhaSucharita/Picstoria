import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./token-store";

type RequestOptions = {
  skipRefresh?: boolean;
};

class ApiClient {
  private refreshPromise: Promise<void> | null = null;

  /* ---------------- REFRESH ---------------- */

  private async refreshAccessToken() {
    if (!this.refreshPromise) {
      this.refreshPromise = fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
        {
          method: "POST",
          credentials: "include", // refresh cookie
        },
      )
        .then(async (res) => {
          if (!res.ok) {
            clearAccessToken();
            throw new Error("Refresh failed");
          }

          const data = await res.json();
          if (!data.accessToken) {
            throw new Error("No access token returned");
          }

          setAccessToken(data.accessToken);
        })
        .finally(() => {
          this.refreshPromise = null;
        });
    }

    return this.refreshPromise;
  }

  /* ---------------- CORE ---------------- */

  private async requestWithRefresh<T>(
    requestFn: () => Promise<Response>,
    options?: RequestOptions,
  ): Promise<T> {
    let response = await requestFn();

    if (response.status !== 401 || options?.skipRefresh) {
      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: "Request failed" }));
        throw new Error(error.message);
      }
      return response.json();
    }

    // 401 → try refresh
    try {
      await this.refreshAccessToken();
    } catch {
      throw new Error("UNAUTHENTICATED");
    }

    // retry once with new token
    response = await requestFn();

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(error.message);
    }

    return response.json();
  }

  /* ---------------- HELPERS ---------------- */

  private buildHeaders() {
    const token = getAccessToken();

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  /* ---------------- GET ---------------- */

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.requestWithRefresh<T>(
      () =>
        fetch(path, {
          method: "GET",
          credentials: "include",
          headers: this.buildHeaders(),
        }),
      options,
    );
  }

  /* ---------------- POST ---------------- */

  async post<T>(path: string, data: any, options?: RequestOptions): Promise<T> {
    return this.requestWithRefresh<T>(
      () =>
        fetch(path, {
          method: "POST",
          credentials: "include",
          headers: this.buildHeaders(),
          body: JSON.stringify(data),
        }),
      options,
    );
  }

  /* ---------------- DELETE ---------------- */

  async delete<T>(
    path: string,
    data: any,
    options?: RequestOptions,
  ): Promise<T> {
    return this.requestWithRefresh<T>(
      () =>
        fetch(path, {
          method: "DELETE",
          credentials: "include",
          headers: this.buildHeaders(),
        }),
      options,
    );
  }
}

export const apiClient = new ApiClient();
