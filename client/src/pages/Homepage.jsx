import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  //Spotify shows ten tracks with the user's search
  const [tracks, setTracks] = useState([]);

  // Fetch tracks from the backend that connects to spotify api

  // Handler for the search button
  const handleSearch = () => {
    console.log(">zz>>>>ZZZ>>>Search Query:", searchQuery);
    fetchTracks(searchQuery); // Trigger the API call with the search query
  };

  const fetchTracks = async (query) => {
    if (!query) return; // Don't fetch if query is empty

    try {
      const url = `http://localhost:5000/api/spotify/search?query=${encodeURIComponent(
        query
      )}`;
      console.log("Fetching URL:", url);

      //Fetch the response from the backend < api, which comes in json
      const response = await fetch(url);
      console.log("Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      //Parse the json into js object to use it in the frontend
      const data = await response.json();
      console.log("⭐⭐⭐Data>>>>", data);
      setTracks(data.tracks.items);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  return (
    <>
      <h1>Welcome to our app</h1>
      <label>
        Search here your song:
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </label>
      <button onClick={handleSearch}>Search</button>

      <h2>Results of your search:</h2>

      <ul>
        {tracks.map((track) => (
          <li key={track.id}>
            <Link to={`/song/${track.id}`}>
              <p>
                <strong>{track.name}</strong> by{" "}
                <i>{track.artists.map((artist) => artist.name).join(", ")}</i>
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {/*   <ul>
        {tracks.map((track) => (
          <li key={track.id}>
            <Link to={`/song/${track.id}`}>
              {track.name} -{" "}
              {track.artists.map((artist) => artist.name).join(", ")}
            </Link>
          </li>
        ))}
      </ul> */}
    </>
  );
};
export default Homepage;
