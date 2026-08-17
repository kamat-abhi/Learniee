import { SearchX } from "lucide-react";

export default function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><SearchX size={25} /></div>
      <h3>No courses found</h3>
      <p>Try a different search or remove one of your filters.</p>
      <button className="primary-button" onClick={onReset}>
        Clear filters
      </button>
    </div>
  );
}