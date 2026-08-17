import type { Request, Response } from 'express';
import {
  getDistinctGrades,
  getDistinctSubjects,
  searchCourses,
} from '../models/Course.js';
import type { CourseSearchQuery } from '../types/index.js';

export function search(req: Request, res: Response): void {
  const result = searchCourses(req.query as CourseSearchQuery);
  res.status(200).json(result);
}

export function getFilterOptions(_req: Request, res: Response): void {
  res.status(200).json({
    subjects: getDistinctSubjects(),
    grades: getDistinctGrades(),
  });
}
