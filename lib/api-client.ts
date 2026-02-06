type RequestOptions = {
  skipRefresh?: boolean;
};
class ApiClient {
  private refreshPromise: Promise<void> | null = null;

  /* ---------------- REFRESH ---------------- */

  private async refreshAccessToken() {
    if (!this.refreshPromise) {
      this.refreshPromise = fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Refresh failed");
          }
        })
        .finally(() => {
          this.refreshPromise = null;
        });
    }

    return this.refreshPromise;
  }

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

    // retry once
    response = await requestFn();

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(error.message);
    }

    return response.json();
  }

  /* ---------------- GET ---------------- */

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.requestWithRefresh<T>(() =>
      fetch(path, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
  }

  /* ---------------- POST ---------------- */

  async post<T>(path: string, data: any, options?: RequestOptions): Promise<T> {
    return this.requestWithRefresh<T>(() => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      return fetch(path, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify(data),
      });
    });
  }

  /* ---------------- DELETE ---------------- */

  async delete<T>(
    path: string,
    data: any,
    options?: RequestOptions,
  ): Promise<T> {
    return this.requestWithRefresh<T>(() =>
      fetch(path, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
  }
}

export const apiClient = new ApiClient();
