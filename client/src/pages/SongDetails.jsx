import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth to check if user is logged in
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import "../styles/SongDetails.css";

const SongDetails = () => {
  const { id } = useParams(); // Get track ID from URL
  const [track, setTrack] = useState(null);
  const [user, setUser] = useState(null);
  const [youtubeVideo, setYoutubeVideo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Fetch the track details from the backend
    const fetchTrackDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/spotify/song/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Track album images:", data.album.images);
        setTrack(data);
        console.log("IMAGE URRRRLLLL", data.album.images[0].url);
      } catch (error) {
        console.error("Error fetching track details:", error);
      }
    };

    fetchTrackDetails();
  }, [id]);

  //This checks if the user is logged in
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const handleFavorite = async () => {
    if (!user) {
      // If no user is logged in, prompt to log in
      alert("You need to log in to like this song!");
      navigate("/login"); // Redirect to login page
      return;
    }
    try {
      // If user is logged in, add the song to the user's likedSongs array in Firestore
      const userDocRef = doc(db, "users", user.uid);
      if (isLiked) {
        // If already liked, remove from likedSongs
        await updateDoc(userDocRef, {
          likedSongs: arrayRemove(id),
        });
        setIsLiked(false);
      } else {
        // If not liked, add to likedSongs
        await updateDoc(userDocRef, {
          likedSongs: arrayUnion(id),
        });
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error adding song to favorites:", error);
      alert("An error occurred while adding the song to favorites.");
    }
  };

  //Let's fetch the youtube video so the user can listen to the song through that at least
  const fetchYoutubeVideo = async (songTitle) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/youtube/youtube-video?songTitle=${encodeURIComponent(songTitle)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("YouTube video data:", data); // Log the response data
      setYoutubeVideo(data);
    } catch (error) {
      console.error("Failed to fetch YouTube video:", error);
    }
  };

  // Fetch YouTube video once the track is available
  useEffect(() => {
    if (track?.name) {
      fetchYoutubeVideo(track.name);
    }
  }, [track]);

  //I need this for youtube api to be happy
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK Player",
        getOAuthToken: (cb) => {
          cb("access_token");
        },
        volume: 0.5,
      });

      player.connect();
    };

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  return (
    <>
      {track && (
        <div>
          <div className="song-card">
            {" "}
            {track && track.album ? (
              <img
                src={track.album.images[0]?.url}
                alt={`${track.name} album cover`}
                onError={(e) => {
                  e.target.src =
                    "https://i.pinimg.com/originals/90/94/63/9094638d8f1453df319219b5c9beca68.gif";
                }}
              />
            ) : (
              <p>Loading...</p>
            )}
            <div className="song-card-text">
              <h2>{track.name}</h2>
              <p>
                <strong>Artist:</strong>{" "}
                {track.artists.map((artist) => artist.name).join(", ")}
              </p>
              <p>
                <strong>Album: </strong>
                {track.album.name}
              </p>
              <p>
                <strong>Release Date:</strong> {track.release_date}
              </p>
            </div>
          </div>
          <div className="songDetails-btns">
            <button onClick={handleFavorite} className="like-btn">
              {isLiked ? "❤︎" : "♡"}
            </button>

            {track.preview_url ? (
              <div>
                <audio controls>
                  <source src={track.preview_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : (
              <p style={{ color: "#2a5300" }}>
                No Spotify preview available for this song :/
              </p>
            )}
          </div>
          {youtubeVideo && youtubeVideo.videoId ? (
            <div className="youtube-container">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${youtubeVideo.videoId}`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="YouTube video player"
              />
            </div>
          ) : (
            <p>No video found or loading...</p>
          )}
        </div>
      )}
    </>
  );
};

export default SongDetails;
