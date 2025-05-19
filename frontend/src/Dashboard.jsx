import { CATEGORIES, CATEGORY_LIST } from "./constants/categories";
import { useState } from "react";
import CreateBoardModal from "./CreateBoardModal";
import "./App.css";

function Dashboard({ boards, onBoardClick, setBoards }) {
  const [filter, setFilter] = useState(CATEGORIES.ALL);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteBoard = async (boardId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/boards/${boardId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete board");

      setBoards((prev) => prev.filter((b) => b.id !== boardId));
    } catch (err) {
      console.error("Error deleting board:", err);
      alert("Could not delete board. Check console for details.");
    }
  };

  return (
    <div>
      <div>
        {CATEGORY_LIST.map((category) => (
          <button key={category} onClick={() => setFilter(category)}>
            {category}
          </button>
        ))}
      </div>
      <div>
        <button onClick={() => setShowModal(true)}>Create New Board</button>
        {showModal && (
          <CreateBoardModal
            onClose={() => setShowModal(false)}
            onAddBoard={(newBoard) => setBoards((prev) => [...prev, newBoard])}
          />
        )}
      </div>
      <div className="board-grid">
        {boards
          .filter((board) => {
            if (filter === CATEGORIES.ALL) return true;
            if (filter === CATEGORIES.RECENT) {
              return [...boards]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 6);
            }
            return board.category === filter;
          })
          .map((board) => (
            <div key={board.id} className="board-item">
              {board.image && (
                <img
                  src={board.image}
                  alt={board.title}
                  className="board-image"
                />
              )}
              <h2>{board.title}</h2>
              <p>{board.description}</p>
              {board.author && <p>Author: {board.author}</p>}
              <div className="board-actions">
                <button onClick={() => onBoardClick(board.id)}>
                  View Board
                </button>
                <button onClick={() => handleDeleteBoard(board.id)}>
                  Delete Board
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Dashboard;
