require("dotenv").config();
const express = require("express");
const cors = require("cors");
const resumeRoutes = require("./routes/resumes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/resumes", resumeRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

// ── Self-ping to prevent Render free tier spin down ──
const RENDER_URL = process.env.RENDER_URL;

if (RENDER_URL) {
  setInterval(async () => {
    try {
      await fetch(`${RENDER_URL}/health`);
      console.log("🏓 Self-ping sent");
    } catch (e) {
      console.error("❌ Self-ping failed:", e.message);
    }
  }, 4 * 60 * 1000); // every 4 minutes
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));