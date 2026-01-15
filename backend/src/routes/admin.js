import express from "express";
import { listAdminUsers, listRecentMessages } from "../db.js";

const router = express.Router();

router.get("/admin/users", async (req, res) => {
  try {
    const users = await listAdminUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "failed_to_load" });
  }
});

router.get("/admin/messages", async (req, res) => {
  const limit = Number(req.query.limit || 200);
  try {
    const messages = await listRecentMessages(limit);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "failed_to_load" });
  }
});

export default router;
