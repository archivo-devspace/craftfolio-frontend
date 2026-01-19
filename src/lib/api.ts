const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    }
  }

  getToken() {
    if (typeof window !== 'undefined' && !this.token) {
      this.token = localStorage.getItem('accessToken');
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  }

  // Auth endpoints
  async register(email: string, password: string, name?: string) {
    return this.request<{ user: User; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ user: User; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe() {
    return this.request<{ user: User }>('/auth/me');
  }

  // Portfolio endpoints
  async createPortfolio(data: CreatePortfolioData) {
    return this.request<Portfolio>('/portfolios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPortfolios() {
    return this.request<Portfolio[]>('/portfolios');
  }

  async getPortfolio(id: string) {
    return this.request<Portfolio>(`/portfolios/${id}`);
  }

  async updatePortfolio(id: string, data: UpdatePortfolioData) {
    return this.request<Portfolio>(`/portfolios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deletePortfolio(id: string) {
    return this.request<Portfolio>(`/portfolios/${id}`, {
      method: 'DELETE',
    });
  }

  async togglePublish(id: string | undefined) {
    return this.request<Portfolio>(`/portfolios/${id}/publish`, {
      method: 'PATCH',
    });
  }

  async getPublicPortfolio(slug: string, name: string) {
    console.log('getPublicPortfolio>>>', slug, name);
    return this.request<Portfolio>(`/portfolios/public?slug=${slug}&name=${name}`);
  }

  async checkSlugAvailability(slug: string) {
    return this.request<{ available: boolean }>(`/portfolios/check-slug?slug=${slug}`);
  }
}

// Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface Portfolio {
  id: string;
  name: string;
  slug: string;
  published: boolean;
  theme: Record<string, unknown>;
  sections: unknown[];
  metaTitle?: string;
  metaDescription?: string;
  views: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioData {
  name: string;
  slug: string;
  theme?: Record<string, unknown>;
  sections?: unknown[];
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdatePortfolioData {
  name?: string;
  slug?: string;
  theme?: Record<string, unknown>;
  sections?: unknown[];
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export const api = new ApiClient();
