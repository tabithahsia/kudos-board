import { useState } from "react";
export default function SearchBar({ query, onChange, onSearch }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input.trim());
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search boards..."
        value={query}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" className="search-button">
        Search
      </button>
      <button
        type="button"
        className="clear-button"
        onClick={() => onChange("")}
        aria-label="Clear search"
      >
        Clear Search
      </button>
    </form>
  );
}
