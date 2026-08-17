export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export type SafeUser = Omit<User, 'passwordHash'>;

export interface Course {
  id: string;
  name: string;
  subject: string;
  grade: number;
  price: number;
  teacherRating: number;
  teacher: string;
  description: string;
  durationWeeks: number;
  thumbnail: string;
}

export interface AuthTokenPayload {
  id: string;
  email: string;
}

export interface CourseSearchQuery {
  q?: string;
  grade?: string;
  subject?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sortBy?: 'price' | 'rating';
  order?: 'asc' | 'desc';
  page?: string;
  limit?: string;
}

export interface CourseSearchResult {
  results: Course[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}
