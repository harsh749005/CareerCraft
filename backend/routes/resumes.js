const express = require("express");
const { neon } = require("@neondatabase/serverless");
const router = express.Router();
require("dotenv").config();

const sql = neon(
  `postgresql://${process.env.NEON_USER}:${process.env.NEON_PASSWORD}@${process.env.NEON_HOST}/${process.env.NEON_DATABASE}?sslmode=require`
);

// ── CREATE TABLES (run once) ──────────────────────────────────────────
router.post("/setup", async (req, res) => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id         TEXT PRIMARY KEY,
        email      TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS resumes (
        id         TEXT PRIMARY KEY,
        user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name       TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        data       JSONB NOT NULL
      )
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id)
    `;
    res.json({ message: "Tables created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── UPSERT USER (call on every login) ────────────────────────────────
router.post("/users", async (req, res) => {
  const { id, email } = req.body;
  try {
    await sql`
      INSERT INTO users (id, email)
      VALUES (${id}, ${email})
      ON CONFLICT (id) DO UPDATE SET email = ${email}
    `;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET all resumes for a user ────────────────────────────────────────
router.get("/:userId", async (req, res) => {
  try {
    const resumes = await sql`
      SELECT * FROM resumes
      WHERE user_id = ${req.params.userId}
      ORDER BY updated_at DESC
    `;
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── SAVE / UPDATE a resume ────────────────────────────────────────────
router.post("/", async (req, res) => {
  const { id, user_id, name, data, createdAt } = req.body;
  try {
    await sql`
      INSERT INTO resumes (id, user_id, name, data, created_at, updated_at)
      VALUES (
        ${id},
        ${user_id},
        ${name},
        ${JSON.stringify(data)},
        ${new Date(createdAt).toISOString()},
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name       = ${name},
        data       = ${JSON.stringify(data)},
        updated_at = NOW()
    `;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── RENAME ────────────────────────────────────────────────────────────
router.patch("/:id/rename", async (req, res) => {
  const { name, user_id } = req.body;
  try {
    await sql`
      UPDATE resumes SET name = ${name}, updated_at = NOW()
      WHERE id = ${req.params.id} AND user_id = ${user_id}
    `;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE ────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  const { user_id } = req.body;
  try {
    await sql`
      DELETE FROM resumes
      WHERE id = ${req.params.id} AND user_id = ${user_id}
    `;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
