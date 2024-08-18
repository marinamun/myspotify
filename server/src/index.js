// server/src/index.js
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
