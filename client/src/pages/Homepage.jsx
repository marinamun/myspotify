import React, { useEffect, useState } from "react";

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  //Spotify shows ten tracks with the user's search
  const [tracks, setTracks] = useState([]);

  const fetchTracks = async (query) => {
    try {
      const response = await fetch(
        `/api/spotify/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      console.log(data);
      setTracks(data.tracks.items);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  useEffect(() => {
    fetchTracks(searchQuery);
  }, [searchQuery]);
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
    </>
  );
};
export default Homepage;
