import type {
  CourseFilters,
  CourseResponse,
  FilterOptions,
  User
} from "./types";

const API_BASE = "/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: "include"
  });

  const data = (await response.json().catch(() => ({}))) as T & {
    message?: string;
  };

  if (!response.ok) {
    throw new ApiError(data.message || "Something went wrong.", response.status);
  }

  return data;
}

export const authApi = {
  signup: (payload: { name: string; email: string; password: string }) =>
    request<{ user: User }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  me: () => request<{ user: User }>("/auth/me"),

  logout: () =>
    request<{ message: string }>("/auth/logout", {
      method: "POST"
    })
};

export const coursesApi = {
  filterOptions: () => request<FilterOptions>("/courses/filter-options"),

  search: (filters: CourseFilters) => {
    const params = new URLSearchParams();

    if (filters.q.trim()) params.set("q", filters.q.trim());
    if (filters.grade) params.set("grade", filters.grade);
    if (filters.subject) params.set("subject", filters.subject);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.minRating) params.set("minRating", filters.minRating);
    if (filters.sortBy) {
      params.set("sortBy", filters.sortBy);
      params.set("order", filters.order);
    }

    params.set("page", String(filters.page));
    params.set("limit", String(filters.limit));

    return request<CourseResponse>(`/courses?${params.toString()}`);
  }
};