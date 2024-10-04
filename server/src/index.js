// server/src/index.js
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const spotifyRoutes = require("./routes/spotify");
const cors = require("cors");
const youtubeRoutes = require("./routes/youtube");

// Middleware
app.use(express.json());

// Use CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Allow the React app
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Basic route
app.get("/", (req, res) => {
  res.send("Backend is running!🔥");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Spotify routes
app.use("/api/spotify", spotifyRoutes);

//Youtube route
app.use("/api/youtube", youtubeRoutes);
