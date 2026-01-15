import pg from "pg";

const {
  PGHOST = "db",
  PGUSER = "postgres",
  PGPASSWORD = "postgres",
  PGDATABASE = "chatapp",
  PGPORT = "5432",
} = process.env;

const pool = new pg.Pool({
  host: PGHOST,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  port: Number(PGPORT),
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
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

export async function userExists(username) {
  const result = await pool.query("SELECT 1 FROM users WHERE username = $1", [
    username,
  ]);
  return result.rowCount > 0;
}

export async function createUser(username, passwordHash) {
  await pool.query(
    "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
    [username, passwordHash]
  );
}

export async function getUserByUsername(username) {
  const result = await pool.query(
    "SELECT username, password_hash FROM users WHERE username = $1",
    [username]
  );
  return result.rows[0] || null;
}

export async function listUsers() {
  const result = await pool.query(
    "SELECT username FROM users ORDER BY username ASC"
  );
  return result.rows.map((row) => row.username);
}

export async function listAdminUsers() {
  const result = await pool.query(
    "SELECT username, created_at FROM users ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function getMessages(me, user) {
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
  return result.rows;
}

export async function listRecentMessages(limit = 200) {
  const result = await pool.query(
    `
      SELECT sender, receiver, body, created_at
      FROM messages
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [limit]
  );
  return result.rows;
}

export async function saveMessage(sender, receiver, body) {
  await pool.query(
    "INSERT INTO messages (sender, receiver, body) VALUES ($1, $2, $3)",
    [sender, receiver, body]
  );
}
