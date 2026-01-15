import { userExists, saveMessage } from "./db.js";
import {
  getSocketId,
  listOnline,
  setOffline,
  setOnline,
} from "./onlineUsers.js";

export function setupSocket(io) {
  io.on("connection", (socket) => {
    socket.on("register", async (username) => {
      if (!username || typeof username !== "string") {
        return;
      }
      try {
        const exists = await userExists(username);
        if (!exists) {
          socket.emit("register_error", "user_not_found");
          return;
        }
      } catch (err) {
        socket.emit("register_error", "register_failed");
        return;
      }
      setOnline(username, socket.id);
      socket.data.username = username;
      io.emit("online_users", listOnline());
    });

    socket.on("unregister", (username) => {
      const current = socket.data.username;
      if (current && (!username || username === current)) {
        setOffline(current);
        socket.data.username = null;
        io.emit("online_users", listOnline());
      }
    });

    socket.on("message", async ({ to, body }) => {
      const from = socket.data.username;
      if (!from || !to || !body) {
        return;
      }
      try {
        await saveMessage(from, to, body);
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
      const targetSocketId = getSocketId(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("message", payload);
      }
    });

    socket.on("disconnect", () => {
      const username = socket.data.username;
      if (username) {
        setOffline(username);
        io.emit("online_users", listOnline());
      }
    });
  });
}
