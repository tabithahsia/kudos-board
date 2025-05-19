// backend/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// =========================
// 🧪 Validation Middleware
// =========================

function validateBoard(req, res, next) {
  const { title, description, category, image } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ error: "Missing required board fields." });
  }
  next();
}

function validateCard(req, res, next) {
  const { title, description, gif } = req.body;
  if (!title || !description || !gif) {
    return res.status(400).json({ error: "Missing required card fields." });
  }
  next();
}

// =========================
// 📦 Board Routes (CRUD)
// =========================

app.get("/api/boards", async (req, res) => {
  try {
    let boards = await prisma.board.findMany({ include: { cards: true } });

    if (boards.length === 0) {
      const welcomeBoard = await prisma.board.create({
        data: {
          title: "Welcome to Kudos Board!",
          description: "Start creating your own kudos boards!",
          category: "Celebration",
          image:
            "https://thumb.ac-illust.com/e2/e2cbae08aee6ed3c5fa742b33e936831_t.jpeg",
          author: "System",
          cards: {
            create: {
              title: "Hello!",
              description:
                "This is your first kudos card. Add more to celebrate your team!",
              gif: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXZ6YTRuZ2NramM1dnF6bTNlOTR5NGdiMmlvcHlsZnYwZHN5YXI4dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ehTzFBjQEyh8lQAn8b/giphy.gif",
              author: "System",
            },
          },
        },
        include: { cards: true },
      });

      boards = [welcomeBoard];
    }

    res.json(boards);
  } catch (err) {
    console.error("Error fetching boards:", err);
    res.status(500).json({ error: "Failed to load boards" });
  }
});

app.get("/api/boards/:id", async (req, res) => {
  try {
    const board = await prisma.board.findUnique({
      where: { id: req.params.id },
      include: { cards: true },
    });
    if (!board) return res.status(404).json({ error: "Board not found." });
    res.json(board);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve board." });
  }
});

app.post("/api/boards", async (req, res) => {
  const { title, description, category, author, image } = req.body;

  try {
    const newBoard = await prisma.board.create({
      data: { title, description, category, author, image },
    });
    res.status(201).json(newBoard);
  } catch (err) {
    console.error("Error creating board:", err);
    res.status(500).json({ error: "Failed to create board" });
  }
});

app.put("/api/boards/:id", validateBoard, async (req, res) => {
  try {
    const board = await prisma.board.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(board);
  } catch (err) {
    res.status(500).json({ error: "Failed to update board." });
  }
});

app.delete("/api/boards/:id", async (req, res) => {
  try {
    await prisma.card.deleteMany({ where: { boardId: req.params.id } });
    await prisma.board.delete({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete board." });
  }
});

// =========================
// 📝 Card Routes (CRUD)
// =========================

app.get("/api/cards/:id", async (req, res) => {
  try {
    const card = await prisma.card.findUnique({ where: { id: req.params.id } });
    if (!card) return res.status(404).json({ error: "Card not found." });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve card." });
  }
});

app.post("/api/boards/:boardId/cards", validateCard, async (req, res) => {
  try {
    const card = await prisma.card.create({
      data: {
        ...req.body,
        boardId: req.params.boardId,
      },
    });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: "Failed to create card." });
  }
});

app.put("/api/cards/:id", validateCard, async (req, res) => {
  try {
    const card = await prisma.card.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: "Failed to update card." });
  }
});

app.patch("/api/cards/:id/upvote", async (req, res) => {
  try {
    const updated = await prisma.card.update({
      where: { id: req.params.id },
      data: {
        upvotes: { increment: 1 },
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to upvote card." });
  }
});

app.delete("/api/cards/:id", async (req, res) => {
  try {
    await prisma.card.delete({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete card." });
  }
});

// =========================
// 🟢 Root + Error Handling
// =========================

app.get("/", (req, res) => {
  res.send("🚀 Kudos Board API is running!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
