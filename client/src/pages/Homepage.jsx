import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import "../styles/Homepage.css";

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  //Spotify shows ten tracks with the user's search
  const [tracks, setTracks] = useState([]);
  //following are for the user's top artist and songs
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [popularTracks, setPopularTracks] = useState([]);

  // Fetch tracks live as the search query changes
  useEffect(() => {
    fetchTracks(searchQuery);
  }, [searchQuery]);

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

  const fetchPopularTracksByGenre = async (genre) => {
    try {
      console.log("Fetching popular tracks for genre: ", genre);
      const url = `http://localhost:5000/api/spotify/popular-tracks?genre=${encodeURIComponent(
        genre
      )}`;
      console.log("Fetching URL: ", url);
      const response = await fetch(url);
      const data = await response.json();

      console.log("Fetched data: ", data);
      setPopularTracks(data.tracks);
    } catch (error) {
      console.error("Error fetching popular tracks: ", error);
    }
  };

  useEffect(() => {
    console.log("Updated popular tracks: ", popularTracks);
  }, [popularTracks]);

  return (
    <>
      <label>
        <input
          type="text"
          value={searchQuery}
          placeholder="Search your favorite song..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </label>
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
      {/* THE TOGGLE THAT DISPLAYS CURRENT POPULAR SONGS IN DIFF GENRES
       */}
      <div>
        <h2>Have a look at what's trending in...</h2>
        <div>
          <button onClick={() => fetchPopularTracksByGenre("pop")}>Pop</button>
          <button onClick={() => fetchPopularTracksByGenre("reggaeton")}>
            Reggaeton
          </button>
          <button onClick={() => fetchPopularTracksByGenre("country")}>
            Country
          </button>
        </div>

        {popularTracks && (
          <ul>
            {popularTracks.map((track) => (
              <li key={track.id}>
                <Link to={`/song/${track.id}`}>
                  {track.name} by{" "}
                  {track.artists.map((artist) => artist.name).join(", ")}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/*       TO DISPLAY THE USER'S MOST LISTENED ARTIST
       */}{" "}
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
