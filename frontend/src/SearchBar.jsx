import { useState } from "react";
export default function SearchBar({ query, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search boards..."
        value={query}
        onChange={(e) => onSearch(e.target.value)}
      />
      <button type="submit" className="search-button">
        Search
      </button>
      <button
        type="button"
        className="clear-button"
        onClick={() => onSearch("")}
        aria-label="Clear search"
      >
        Clear Search
      </button>
    </form>
  );
}
