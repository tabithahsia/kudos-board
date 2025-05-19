import React, { useState } from "react";
import { CATEGORIES, CATEGORY_LIST } from "./constants/categories";

export default function CreateBoardModal({ onClose, onAddBoard }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    author: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      const newBoard = await res.json();
      onAddBoard(newBoard);
      onClose();
    } catch (err) {
      console.error("Failed to create board", err);
    }
  };

  return (
    <div className="modal-overlay">
      <form className="modal-form" onSubmit={handleSubmit}>
        <button
          type="button"
          onClick={onClose}
          className="modal-close"
          aria-label="Close"
        >
          &times;
        </button>

        <h2>Create a New Board</h2>

        <label htmlFor="title">Title:</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {CATEGORY_LIST.filter(
            (c) => c !== CATEGORIES.ALL && c !== CATEGORIES.RECENT
          ).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label htmlFor="image">Image/GIF URL: (optional)</label>
        <input
          id="image"
          name="image"
          type="url"
          value={form.image}
          onChange={handleChange}
          placeholder="https://example.com/your-image.gif"
        />

        <label htmlFor="author">Author: (optional)</label>
        <input
          id="author"
          name="author"
          type="text"
          value={form.author}
          onChange={handleChange}
        />

        <button type="submit">Create Board</button>
      </form>
    </div>
  );
}
