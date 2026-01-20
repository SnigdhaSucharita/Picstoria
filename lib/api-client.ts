class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '';
  }

  async getCsrfToken(): Promise<string> {
    const response = await fetch('/api/csrf', {
      credentials: 'include',
    });
    const data = await response.json();
    return data.csrfToken;
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(path, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(path: string, data: any, csrfToken?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (csrfToken) {
      headers['csrf-token'] = csrfToken;
    }

    const response = await fetch(path, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async delete<T>(path: string, csrfToken: string): Promise<T> {
    const response = await fetch(path, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'csrf-token': csrfToken,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
