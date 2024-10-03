// server/src/routes/spotify.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

//GOAL: CREATE AND MANAGE A USER TOKEN TO FREELY BROWSE MUSIC WITHOUT A SPOTIFY ACCOUNT
// Function to fetch access token
let accessToken = "";
let tokenExpiresAt = 0;

async function fetchAccessToken() {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    accessToken = response.data.access_token;
    tokenExpiresAt = Date.now() + response.data.expires_in * 1000;
    console.log("Spotify access token fetched");
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
}

// Middleware to ensure valid token
async function ensureValidToken(req, res, next) {
  if (!accessToken || Date.now() >= tokenExpiresAt) {
    await fetchAccessToken();
  }
  next();
}

// Search Spotify API
router.get("/search", ensureValidToken, async (req, res) => {
  console.log("💚➡️➡️Received request:", req.method, req.originalUrl);

  console.log("➡️➡️➡️Received query parameters:", req.query); // Log query parameters

  const { query } = req.query;
  if (!query) {
    console.error("Query parameter is missing");
    return res.status(400).json({ error: "Query parameter is required" }); // Send JSON error response
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      params: {
        q: query,
        type: "track",
        limit: 10,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("🍁🍁🍁🍁Spotify API response:", response.data); // Log response from Spotify API
    res.json(response.data); // Send JSON response
  } catch (error) {
    console.error("Error fetching data from Spotify API:", error);
    res.status(500).json({ error: "Internal Server Error" }); // Send JSON error response
  }
});

///Fetch all the info of a song to display in SongDetails.jsx
router.get("/song/:id", ensureValidToken, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Track ID is required" });
  }

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    //the json from api contains the following details, including the listen preview
    const trackData = response.data;

    res.json({
      name: trackData.name,
      artists: trackData.artists,
      album: trackData.album,
      release_date: trackData.album.release_date,
      preview_url: trackData.preview_url,
      uri: trackData.uri,
    });
  } catch (error) {
    console.error("Error fetching track details:", error);
    res.status(500).json({ error: "Failed to fetch track details" });
  }
});

//Route to get the info about our user's top artist and songs
router.get("/top-artists", ensureValidToken, async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/artists",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching top artists:", error);
    res.status(500).json({ error: "Failed to fetch top artists" });
  }
});

router.get("/top-tracks", ensureValidToken, async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    res.status(500).json({ error: "Failed to fetch top tracks" });
  }
});

//To fetch popular tracks of each genre
router.get("/popular-tracks", ensureValidToken, async (req, res) => {
  const { genre } = req.query;
  if (!genre) {
    return res.status(400).json({ error: "The genre query is missing!!!!" });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      params: {
        q: `genre:${genre}`,
        type: "track",
        limit: 10,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.json({ tracks: response.data.tracks.items });
  } catch (error) {
    console.error("There was an error fetching the popular tracks😭", error);
    res.status(500).json({ error: "Failed to fetch the popular tracks" });
  }
});

module.exports = router;
