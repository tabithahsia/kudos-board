export default function SearchBar({ query, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search boards..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="clear-button"
        onClick={() => onChange("")}
        aria-label="Clear search"
      >
        Clear Search
      </button>
    </div>
  );
}
