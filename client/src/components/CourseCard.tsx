import {
  ArrowUpRight,
  Clock3,
  Star,
  UserRound
} from "lucide-react";
import type { Course } from "../types";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <article className="course-card">
      <div className="course-image">
        <img src={course.thumbnail} alt={`${course.name} course`} loading="lazy" />
        <span className="course-subject">{course.subject}</span>
        <span className="course-grade">Grade {course.grade}</span>
      </div>

      <div className="course-content">
        <div className="course-heading">
          <div>
            <h3>{course.name}</h3>
            <p className="teacher">
              <UserRound size={14} />
              {course.teacher}
            </p>
          </div>

          <span className="rating">
            <Star size={14} fill="currentColor" />
            {course.teacherRating.toFixed(1)}
          </span>
        </div>

        <p className="course-description">{course.description}</p>

        <div className="course-details">
          <span><Clock3 size={14} /> {course.durationWeeks} weeks</span>
          <span>{course.teacherRating >= 4.5 ? "Top rated" : "Popular choice"}</span>
        </div>

        <div className="course-bottom">
          <div className="price">
            ₹{course.price.toLocaleString("en-IN")}
            <small> / course</small>
          </div>
          <button className="course-button">
            View course <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}