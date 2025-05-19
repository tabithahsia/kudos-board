import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import BoardDetails from "./BoardDetails";
import Header from "./Header";
import Banner from "./Banner";
import Footer from "./Footer";
import SearchBar from "./SearchBar";

function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/boards`)
      .then((r) => r.json())
      .then(setBoards)
      .catch(console.error);
  }, []);

  const filtered = boards.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase())
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
            <SearchBar onSearch={(q) => setSearchQuery(q)} />
            <Dashboard
              boards={filtered}
              setBoards={setBoards}
              onBoardClick={setSelectedBoardId}
            />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
