// server/src/index.js
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const spotifyRoutes = require("./routes/spotify");
const cors = require("cors");

// Middleware
app.use(express.json());

// Use CORS middleware
app.use(cors());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Spotify routes
app.use("/api/spotify", spotifyRoutes);
