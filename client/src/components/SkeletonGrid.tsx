export default function SkeletonGrid() {
  return (
    <div className="course-grid">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton-image" />
          <div className="skeleton-content">
            <span /><span /><span /><span />
          </div>
        </div>
      ))}
    </div>
  );
}