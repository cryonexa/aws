import express from "express";
import { getMessages } from "../db.js";

const router = express.Router();

router.get("/messages", async (req, res) => {
  const { me, user } = req.query;
  if (!me || !user) {
    res.status(400).json({ error: "me and user are required" });
    return;
  }
  try {
    const messages = await getMessages(me, user);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "failed_to_load" });
  }
});

export default router;
