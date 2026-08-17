export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

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

export interface FilterOptions {
  subjects: string[];
  grades: number[];
}

export interface CourseFilters {
  q: string;
  grade: string;
  subject: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  sortBy: "" | "price" | "rating";
  order: "asc" | "desc";
  page: number;
  limit: number;
}

export interface CourseResponse {
  results: Course[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}