import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import pg from "pg";

const {
  PGHOST = "db",
  PGUSER = "postgres",
  PGPASSWORD = "postgres",
  PGDATABASE = "chatapp",
  PGPORT = "5432",
  PORT = "3000",
} = process.env;

const pool = new pg.Pool({
  host: PGHOST,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  port: Number(PGPORT),
});

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const onlineUsers = new Map(); // username -> socket.id

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender TEXT NOT NULL,
      receiver TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/messages", async (req, res) => {
  const { me, user } = req.query;
  if (!me || !user) {
    res.status(400).json({ error: "me and user are required" });
    return;
  }
  try {
    const result = await pool.query(
      `
        SELECT sender, receiver, body, created_at
        FROM messages
        WHERE (sender = $1 AND receiver = $2)
           OR (sender = $2 AND receiver = $1)
        ORDER BY created_at ASC
        LIMIT 200
      `,
      [me, user]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "failed_to_load" });
  }
});

io.on("connection", (socket) => {
  socket.on("register", (username) => {
    if (!username || typeof username !== "string") {
      return;
    }
    onlineUsers.set(username, socket.id);
    socket.data.username = username;
    io.emit("online_users", Array.from(onlineUsers.keys()));
  });

  socket.on("message", async ({ to, body }) => {
    const from = socket.data.username;
    if (!from || !to || !body) {
      return;
    }
    try {
      await pool.query(
        "INSERT INTO messages (sender, receiver, body) VALUES ($1, $2, $3)",
        [from, to, body]
      );
    } catch (err) {
      return;
    }

    const payload = {
      sender: from,
      receiver: to,
      body,
      created_at: new Date().toISOString(),
    };

    socket.emit("message", payload);
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("message", payload);
    }
  });

  socket.on("disconnect", () => {
    const username = socket.data.username;
    if (username) {
      onlineUsers.delete(username);
      io.emit("online_users", Array.from(onlineUsers.keys()));
    }
  });
});

initDb()
  .then(() => {
    server.listen(Number(PORT), () => {
      console.log(`Backend listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to init database", err);
    process.exit(1);
  });
