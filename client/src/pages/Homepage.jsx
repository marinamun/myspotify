import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  //Spotify shows ten tracks with the user's search
  const [tracks, setTracks] = useState([]);
  //following are for the user's top artist and songs
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const tracksResponse = await fetch("/api/spotify/top-tracks");
          const artistsResponse = await fetch("/api/spotify/top-artists");
          const tracksData = await tracksResponse.json();
          const artistsData = await artistsResponse.json();

          setTopTracks(tracksData.items);
          setTopArtists(artistsData.items);
        } catch (error) {
          console.error("Error fetching top tracks or artists:", error);
        }
      }
    };

    fetchData();
  }, []);
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

      {auth.currentUser && (
        <>
          {topTracks.length > 0 && (
            <>
              <h2>Your Top Tracks</h2>
              <ul>
                {topTracks.map((track) => (
                  <li key={track.id}>
                    {track.name} by{" "}
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </li>
                ))}
              </ul>
            </>
          )}

          {topArtists.length > 0 && (
            <>
              <h2>Your Top Artists</h2>
              <ul>
                {topArtists.map((artist) => (
                  <li key={artist.id}>{artist.name}</li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Homepage;
