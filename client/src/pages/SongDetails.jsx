import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth to check if user is logged in
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const SongDetails = () => {
  const { id } = useParams(); // Get track ID from URL
  const [track, setTrack] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the track details from the backend
    const fetchTrackDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/spotify/song/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTrack(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching track details:", error);
        setError(error);
        setLoading(false);
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
      await updateDoc(userDocRef, {
        likedSongs: arrayUnion(id), // Add the song ID to the likedSongs array
      });
      alert("Song added to favorites");
    } catch (error) {
      console.error("Error adding song to favorites:", error);
      alert("An error occurred while adding the song to favorites.");
    }
  };

  return (
    <>
      <h1>Song Details</h1>
      {track && (
        <div>
          <h2>{track.name}</h2>
          <p>Artist: {track.artists.map((artist) => artist.name).join(", ")}</p>
          <p>Album: {track.album.name}</p>
          <p>Release Date: {track.release_date}</p>
          <img src={track.album.images[0]?.url} alt={track.name} width="300" />

          {/* Check if preview_url is available */}
          {track.preview_url ? (
            <div>
              <p>Listen to a preview:</p>
              <audio controls>
                <source src={track.preview_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : (
            <p>No preview available for this track.</p>
          )}
          <button onClick={handleFavorite}>❤️ Add to Favorites</button>
        </div>
      )}
    </>
  );
};

export default SongDetails;
