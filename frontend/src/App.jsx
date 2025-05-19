import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import BoardDetails from "./BoardDetails";
import Header from "./Header";
import Banner from "./Banner";
import Footer from "./Footer";
import SearchBar from "./SearchBar";
import { CATEGORIES } from "./constants/categories";

function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState(CATEGORIES.ALL);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/boards`)
      .then((r) => r.json())
      .then(setBoards)
      .catch(console.error);
  }, []);

  const visibleBoards = boards
    .filter((b) => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((b) =>
      filter === CATEGORIES.ALL
        ? true
        : filter === CATEGORIES.RECENT
        ? true
        : b.category === filter
    );

  return (
    <>
      <Header />
      <Banner />
      <main className="site-main">
        {selectedBoardId ? (
          <BoardDetails
            board={boards.find((b) => b.id === selectedBoardId)}
            goBack={() => setSelectedBoardId(null)}
          />
        ) : (
          <>
            <SearchBar
              query={searchQuery}
              onSearch={(q) => setSearchQuery(q)}
              onClear={() => {
                setSearchQuery("");
                setFilter(CATEGORIES.ALL);
              }}
            />
            <Dashboard
              boards={visibleBoards}
              setBoards={setBoards}
              onBoardClick={setSelectedBoardId}
              filter={filter}
              setFilter={setFilter}
            />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
