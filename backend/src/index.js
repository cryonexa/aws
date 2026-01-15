import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { initDb } from "./db.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import messageRoutes from "./routes/messages.js";
import adminRoutes from "./routes/admin.js";
import { setupSocket } from "./socket.js";

const { PORT = "3000" } = process.env;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use(authRoutes);
app.use(usersRoutes);
app.use(messageRoutes);
app.use(adminRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

setupSocket(io);

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
