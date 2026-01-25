class ApiClient {
  private refreshPromise: Promise<void> | null = null;

  /* ---------------- CSRF ---------------- */

  async getCsrfToken(): Promise<string> {
    const response = await fetch("/api/auth/csrf", {
      credentials: "include",
    });
    const data = await response.json();
    return data.csrfToken;
  }

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
  ): Promise<T> {
    let response = await requestFn();

    if (response.status !== 401) {
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
      window.location.href = "/login";
      throw new Error("Session expired");
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

  async get<T>(path: string): Promise<T> {
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

  async post<T>(path: string, data: any, csrfToken?: string): Promise<T> {
    return this.requestWithRefresh<T>(() => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (csrfToken) {
        headers["csrf-token"] = csrfToken;
      }

      return fetch(path, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify(data),
      });
    });
  }

  /* ---------------- DELETE ---------------- */

  async delete<T>(path: string, data: any, csrfToken: string): Promise<T> {
    return this.requestWithRefresh<T>(() =>
      fetch(path, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "csrf-token": csrfToken,
        },
      }),
    );
  }
}

export const apiClient = new ApiClient();
