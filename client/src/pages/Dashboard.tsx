import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  LogOut,
  Menu,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X
} from "lucide-react";
import type { CourseFilters, CourseResponse, FilterOptions, User } from "../types";
import { coursesApi } from "../api";
import CourseCard from "../components/CourseCard";
import EmptyState from "../components/EmptyState";
import FilterSelect from "../components/FilterSelect";
import SkeletonGrid from "../components/SkeletonGrid";

const defaultFilters: CourseFilters = {
  q: "",
  grade: "",
  subject: "",
  minPrice: "",
  maxPrice: "",
  minRating: "",
  sortBy: "",
  order: "asc",
  page: 1,
  limit: 6
};

interface Props {
  user: User;
  onLogout: () => Promise<void>;
}

export default function Dashboard({ user, onLogout }: Props) {
  const [filters, setFilters] = useState<CourseFilters>(defaultFilters);
  const [courses, setCourses] = useState<CourseResponse | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    subjects: [],
    grades: []
  });
  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    coursesApi.filterOptions()
      .then(setFilterOptions)
      .catch(() => setError("Unable to load course filters."))
      .finally(() => setOptionsLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const timer = window.setTimeout(() => {
      coursesApi.search(filters)
        .then((result) => {
          if (!cancelled) setCourses(result);
        })
        .catch((err) => {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : "Unable to load courses.");
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, filters.q ? 300 : 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [filters]);

  const activeFilters = useMemo(() => {
    return [
      filters.grade,
      filters.subject,
      filters.minPrice,
      filters.maxPrice,
      filters.minRating,
      filters.sortBy
    ].filter(Boolean).length;
  }, [filters]);

  const update = <K extends keyof CourseFilters>(key: K, value: CourseFilters[K]) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === "page" ? {} : { page: 1 })
    }));
  };

  function resetFilters() {
    setFilters(defaultFilters);
  }

  async function logout() {
    try {
      setLoggingOut(true);
      await onLogout();
    } finally {
      setLoggingOut(false);
    }
  }

  const total = courses?.pagination.total ?? 0;
  const page = courses?.pagination.page ?? 1;
  const totalPages = courses?.pagination.totalPages ?? 1;
  const start = total ? (page - 1) * filters.limit + 1 : 0;
  const end = Math.min(page * filters.limit, total);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-logo"><Sparkles size={18} /></span>
            Learniee
          </div>

          <div className="header-user">
            <div className="user-avatar">{getInitials(user.name)}</div>
            <div className="user-info">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <button className="logout-button" onClick={logout} disabled={loggingOut} title="Log out">
              {loggingOut ? <span className="spinner dark" /> : <LogOut size={17} />}
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="welcome-section">
          <div>
            <span className="section-kicker"><Sparkles size={14} /> Parent dashboard</span>
            <h1>Find something your child will love learning.</h1>
            <p>Search and compare courses by subject, grade, price and teacher rating.</p>
          </div>
          <div className="welcome-stat">
            <strong>{total}</strong>
            <span>matching courses</span>
          </div>
        </section>

        <section className="course-explorer">
          <div className="explorer-heading">
            <div>
              <span className="section-kicker">Course discovery</span>
              <h2>Explore courses</h2>
            </div>
            <button
              className="mobile-filter-button"
              onClick={() => setMobileFilters((current) => !current)}
            >
              <SlidersHorizontal size={17} />
              Filters
              {activeFilters > 0 && <b>{activeFilters}</b>}
            </button>
          </div>

          <div className="search-input">
            <Search size={19} />
            <input
              value={filters.q}
              onChange={(event) => update("q", event.target.value)}
              placeholder="Search course name or subject..."
              aria-label="Search courses"
            />
            {filters.q && (
              <button className="clear-search" onClick={() => update("q", "")}>
                <X size={17} />
              </button>
            )}
          </div>

          <div className={`filters-panel ${mobileFilters ? "filters-open" : ""}`}>
            <div className="filter-grid">
              <FilterSelect
                label="Grade"
                value={filters.grade}
                options={filterOptions.grades.map(String)}
                optionLabels={filterOptions.grades.map((grade) => `Grade ${grade}`)}
                onChange={(value) => update("grade", value)}
              />

              <FilterSelect
                label="Subject"
                value={filters.subject}
                options={filterOptions.subjects}
                onChange={(value) => update("subject", value)}
              />

              <div className="filter-field">
                <span>Price range</span>
                <div className="price-range">
                  <input
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    placeholder="Min ₹"
                    onChange={(event) => update("minPrice", event.target.value)}
                  />
                  <em>to</em>
                  <input
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    placeholder="Max ₹"
                    onChange={(event) => update("maxPrice", event.target.value)}
                  />
                </div>
              </div>

              <FilterSelect
                label="Teacher rating"
                value={filters.minRating}
                options={["4.5", "4", "3.5", "3"]}
                optionLabels={["4.5+ stars", "4+ stars", "3.5+ stars", "3+ stars"]}
                onChange={(value) => update("minRating", value)}
              />

              <FilterSelect
                label="Sort by"
                value={filters.sortBy ? `${filters.sortBy}:${filters.order}` : ""}
                options={["", "price:asc", "price:desc", "rating:desc"]}
                optionLabels={["Relevance", "Price: low to high", "Price: high to low", "Highest rated"]}
                onChange={(value) => {
                  if (!value) {
                    update("sortBy", "");
                    return;
                  }
                  const [sortBy, order] = value.split(":") as ["price" | "rating", "asc" | "desc"];
                  setFilters((current) => ({ ...current, sortBy, order, page: 1 }));
                }}
              />

              {activeFilters > 0 && (
                <button className="reset-filters" onClick={resetFilters}>
                  <RotateCcw size={14} />
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="result-toolbar">
            <div>
              <Filter size={14} />
              {loading ? "Updating results..." : `${total} ${total === 1 ? "course" : "courses"} found`}
            </div>
            {activeFilters > 0 && <span>{activeFilters} active filters</span>}
          </div>
        </section>

        <section className="results-area">
          {error ? (
            <div className="error-state">
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button className="primary-button" onClick={() => setFilters((current) => ({ ...current }))}>
                Try again
              </button>
            </div>
          ) : loading ? (
            <SkeletonGrid />
          ) : courses?.results.length ? (
            <>
              <div className="course-grid">
                {courses.results.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              <div className="pagination">
                <span>
                  Showing <strong>{start}–{end}</strong> of <strong>{total}</strong>
                </span>

                <div className="page-controls">
                  <button
                    disabled={page <= 1}
                    onClick={() => update("page", page - 1)}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  {getPageNumbers(page, totalPages).map((item, index) =>
                    item === "..." ? (
                      <span className="page-ellipsis" key={`ellipsis-${index}`}>…</span>
                    ) : (
                      <button
                        key={item}
                        className={item === page ? "active" : ""}
                        onClick={() => update("page", item)}
                      >
                        {item}
                      </button>
                    )
                  )}

                  <button
                    disabled={page >= totalPages}
                    onClick={() => update("page", page + 1)}
                    aria-label="Next page"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState onReset={resetFilters} />
          )}
        </section>
      </main>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getPageNumbers(current: number, total: number): Array<number | "..."> {
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 3) return [1, 2, 3, 4, "...", total];
  if (current >= total - 2) return [1, "...", total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}