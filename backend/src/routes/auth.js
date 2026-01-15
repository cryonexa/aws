import express from "express";
import bcrypt from "bcrypt";
import { createUser, getUserByUsername, userExists } from "../db.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    res.status(400).json({ error: "username_and_password_required" });
    return;
  }
  try {
    if (await userExists(username)) {
      res.status(409).json({ error: "username_taken" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await createUser(username, passwordHash);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "signup_failed" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    res.status(400).json({ error: "username_and_password_required" });
    return;
  }
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      res.status(404).json({ error: "user_not_found" });
      return;
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      res.status(401).json({ error: "invalid_password" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "login_failed" });
  }
});

export default router;
