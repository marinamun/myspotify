import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import "../styles/Homepage.css";
import taylor from "../media/taylor2.jpg";

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  //Spotify shows ten tracks with the user's search
  const [tracks, setTracks] = useState([]);
  //following are for the user's top artist and songs
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [popularTracks, setPopularTracks] = useState([]);
  //to clean search results when user clicks somewhere else on the screen
  const searchContainerRef = useRef(null);
  const [showResults, setShowResults] = useState(false);
  const [activeGenre, setActiveGenre] = useState("");

  // Fetch tracks live as the search query changes
  useEffect(() => {
    fetchTracks(searchQuery);
  }, [searchQuery]);

  const fetchTracks = async (query) => {
    if (!query) return; // Don't fetch if query is empty

    try {
      const url = `${
        process.env.REACT_APP_API_URL
      }/api/spotify/search?query=${encodeURIComponent(query)}`;
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
      setShowResults(true);
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
      const url = `${
        process.env.REACT_APP_API_URL
      }/api/spotify/popular-tracks?genre=${encodeURIComponent(genre)}`;
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

  // When user clicks somewhere else on the screen, the results disappear
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click was outside the search container and also not on a link inside the search results
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        !event.target.closest("a") // Check if the clicked element is not a link
      ) {
        setShowResults(false); // Hide results if clicked outside
        setPopularTracks([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Listen for clicks
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup
    };
  }, []);

  return (
    <div className="homepage">
      <div className="search-container" ref={searchContainerRef}>
        <label>
          <input
            type="text"
            value={searchQuery}
            placeholder="Search your favorite song..."
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
          />
        </label>
        {showResults && tracks.length > 0 && (
          <ul>
            {tracks.map((track) => (
              <li key={track.id}>
                <Link to={`/song/${track.id}`}>
                  <p>
                    <strong>{track.name}</strong> by{" "}
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </p>
                </Link>
                <hr></hr>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* THE TOGGLE THAT DISPLAYS CURRENT POPULAR SONGS IN DIFF GENRES
       */}
      <div className="trending-container">
        <div>
          <h1>Check the popular songs in...</h1>
          <div className="genre-btns">
            <button
              style={{
                backgroundColor: activeGenre === "pop" ? "#E5FFCA" : "#2a5300",
                color: activeGenre === "pop" ? "#2A5300" : "#e5ffca",
                transition: "background-color 0.3s, color 0.3s",
              }}
              onClick={() => {
                setActiveGenre("pop");
                fetchPopularTracksByGenre("pop");
              }}
            >
              Pop🌆
            </button>
            <button
              style={{
                backgroundColor:
                  activeGenre === "reggaeton" ? "#E5FFCA" : "#2a5300",
                color: activeGenre === "reggaeton" ? "#2A5300" : "#e5ffca",
                transition: "background-color 0.3s, color 0.3s",
              }}
              onClick={() => {
                setActiveGenre("reggaeton");
                fetchPopularTracksByGenre("reggaeton");
              }}
            >
              Reggaeton🏖️
            </button>
            <button
              style={{
                backgroundColor:
                  activeGenre === "country" ? "#E5FFCA" : "#2a5300",
                color: activeGenre === "country" ? "#2A5300" : "#e5ffca",
                transition: "background-color 0.3s, color 0.3s",
              }}
              onClick={() => {
                setActiveGenre("country");
                fetchPopularTracksByGenre("country");
              }}
            >
              Country🤠
            </button>
          </div>

          {popularTracks && (
            <ul className="genre-results">
              {popularTracks.map((track) => (
                <li key={track.id}>
                  {console.log("hwwww", track.id)}
                  <Link to={`/song/${track.id}`}>
                    <strong>♪ {track.name}</strong> by{" "}
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/*       TO DISPLAY THE INFO OF OUR APP
       */}
      <h1 style={{ fontSize: "50px", marginBottom: "9px", color: "#2a5300" }}>
        with SpotiTube
      </h1>{" "}
      <div className="app-card">
        <img src={taylor} />
        <div className="app-info">
          <div>
            <p>
              <strong>✓ View Detailed Song Information</strong>
            </p>
            <p>Access comprehensive details about any song.</p>
          </div>
          <div>
            <p>
              <strong>✓ Curate Your Favorites</strong>
            </p>
            <p>Easily add your favorite songs to your profile.</p>
          </div>
          <div>
            <p>
              <strong>✓ Enjoy Music and Videos</strong>
            </p>
            <p>
              Listen to tracks and watch music videos, even <br />
              without a Spotify Premium account.
            </p>
          </div>
        </div>
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
    </div>
  );
};

export default Homepage;
