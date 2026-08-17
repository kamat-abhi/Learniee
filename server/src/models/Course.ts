import { readJSON } from '../utils/jsonStore.js';
import type {
  Course,
  CourseSearchQuery,
  CourseSearchResult,
} from '../types/index.js';

const FILE = 'courses.json';

export function getAllCourses(): Course[] {
  return readJSON<Course>(FILE);
}

export function searchCourses(query: CourseSearchQuery): CourseSearchResult {
  let courses = getAllCourses();

  const {
    q,
    grade,
    subject,
    minPrice,
    maxPrice,
    minRating,
    sortBy,
    order = 'asc',
    page = '1',
    limit = '6',
  } = query;

  if (q?.trim()) {
    const term = q.trim().toLowerCase();
    courses = courses.filter(
      (course) =>
        course.name.toLowerCase().includes(term) ||
        course.subject.toLowerCase().includes(term),
    );
  }

  if (grade) {
    courses = courses.filter(
      (course) => String(course.grade) === String(grade),
    );
  }

  if (subject) {
    courses = courses.filter(
      (course) =>
        course.subject.toLowerCase() === String(subject).toLowerCase(),
    );
  }

  if (minPrice !== undefined && minPrice !== '') {
    courses = courses.filter((course) => course.price >= Number(minPrice));
  }

  if (maxPrice !== undefined && maxPrice !== '') {
    courses = courses.filter((course) => course.price <= Number(maxPrice));
  }

  if (minRating !== undefined && minRating !== '') {
    courses = courses.filter(
      (course) => course.teacherRating >= Number(minRating),
    );
  }

  if (sortBy === 'price' || sortBy === 'rating') {
    const key: 'price' | 'teacherRating' =
      sortBy === 'price' ? 'price' : 'teacherRating';

    courses = [...courses].sort((a, b) =>
      order === 'desc' ? b[key] - a[key] : a[key] - b[key],
    );
  }

  const total = courses.length;
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Number(limit) || 6);
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = courses.slice(startIndex, startIndex + limitNum);

  return {
    results: paginated,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasMore: startIndex + limitNum < total,
    },
  };
}

export function getDistinctSubjects(): string[] {
  const courses = getAllCourses();
  return [...new Set(courses.map((course) => course.subject))];
}

export function getDistinctGrades(): number[] {
  const courses = getAllCourses();
  return [...new Set(courses.map((course) => course.grade))].sort(
    (a, b) => a - b,
  );
}
