import { useState } from "react";
import CreateCardModal from "./CreateCardModal";

function BoardDetails({ board, goBack }) {
  const [showModal, setShowModal] = useState(false);

  const handleAddCard = (newCard) => {
    board.cards.push({ ...newCard, upvotes: 0 });
  };

  const handleUpvote = (cardId) => {
    const card = board.cards.find((c) => c.id === cardId);
    if (card) {
      card.upvotes = (card.upvotes || 0) + 1;
      // Force re-render
      setDummyState((prev) => prev + 1);
    }
  };

  const handleDelete = (cardId) => {
    const index = board.cards.findIndex((c) => c.id === cardId);
    if (index !== -1) {
      board.cards.splice(index, 1);
      setDummyState((prev) => prev + 1); // force re-render
    }
  };
  const [dummyState, setDummyState] = useState(0); // just to trigger re-render

  return (
    <div>
      <button onClick={goBack}>← Back to Dashboard</button>

      <h2>{board.title}</h2>
      {board.image && (
        <img src={board.image} alt={board.title} className="board-banner" />
      )}
      <p>{board.description}</p>
      <button onClick={() => setShowModal(true)}>+ Create a Card</button>

      <h3 style={{ marginTop: "2rem" }}>Cards</h3>

      {!board.cards || board.cards.length === 0 ? (
        <p>No cards yet. Be the first to add one!</p>
      ) : (
        <div className="card-grid">
          {board.cards.map((card) => (
            <div key={card.id} className="card-item">
              <h4>{card.title}</h4>
              <p>{card.description}</p>
              {card.gif && (
                <img
                  src={card.gif}
                  alt="GIF"
                  style={{
                    width: "100%",
                    borderRadius: "6px",
                    marginTop: "0.5rem",
                  }}
                />
              )}
              {card.author && <p>Author: {card.author}</p>}

              <div style={{ marginTop: "auto" }}>
                <button
                  className="upvote-button"
                  onClick={() => handleUpvote(card.id)}
                  style={{ marginTop: "1rem" }}
                >
                  Upvote {card.upvotes ?? 0}
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(card.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CreateCardModal
          onClose={() => setShowModal(false)}
          onAddCard={handleAddCard}
        />
      )}
    </div>
  );
}

export default BoardDetails;
