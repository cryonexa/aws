import express from "express";
import { listUsers } from "../db.js";
import { isOnline } from "../onlineUsers.js";

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const usernames = await listUsers();
    const users = usernames.map((username) => ({
      username,
      online: isOnline(username),
    }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "failed_to_load" });
  }
});

export default router;
