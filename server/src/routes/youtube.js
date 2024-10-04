const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// ROUTE TO GET SONGS FROM YOUTUBE
router.get("/youtube-video", async (req, res) => {
  const { songTitle } = req.query;

  if (!songTitle) {
    return res.status(400).json({ error: "Song title is required" });
  }

  const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(
    songTitle
  )}&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    const video = response.data.items[0];

    if (!video) {
      return res.status(404).json({ error: "No video found" });
    }

    res.json({
      videoId: video.id.videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.default.url,
    });
  } catch (error) {
    console.error(
      "YouTube API error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch YouTube video" });
  }
});

module.exports = router;
