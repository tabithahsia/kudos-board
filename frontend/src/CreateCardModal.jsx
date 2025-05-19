import { useState } from "react";
function CreateCardModal({ onClose, onAddCard }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    gif: "",
    author: "",
  });
  const [gifSearch, setGifSearch] = useState("");
  const [gifResults, setGifResults] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGifSearch = async () => {
    if (!gifSearch.trim()) return;

    const apiKey = import.meta.env.VITE_GIPHY_API_KEY;
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(
        gifSearch
      )}&limit=6`
    );
    const data = await res.json();
    setGifResults(data.data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCard({
      ...form,
      id: crypto.randomUUID(),
    });
    onClose();
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
        <h2 className="modal-title">Create a New Card</h2>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter card title"
          required
        />
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Enter card description"
          required
        />

        <input
          type="text"
          name="gifSearch"
          placeholder="Search GIFs..."
          value={gifSearch}
          onChange={(e) => setGifSearch(e.target.value)}
          required
        />
        <button type="button" onClick={handleGifSearch}>
          Search
        </button>
        <div>
          {gifResults.map((gif) => (
            <img
              key={gif.id}
              src={gif.images.fixed_height.url}
              alt={gif.title}
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  gif: gif.images.fixed_height.url,
                }))
              }
              style={{ cursor: "pointer", width: "100px", height: "100px" }}
            />
          ))}
        </div>
        <input
          name="gif"
          value={form.gif}
          onChange={handleChange}
          placeholder="Enter GIF URL"
        />
        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Author (optional)"
        />

        <button type="submit" className="modal-submit">
          Create Card
        </button>
      </form>
    </div>
  );
}

export default CreateCardModal;
