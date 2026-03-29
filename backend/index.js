require("dotenv").config();
const express = require("express");
const cors = require("cors");
const resumeRoutes = require("./routes/resumes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/resumes", resumeRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));