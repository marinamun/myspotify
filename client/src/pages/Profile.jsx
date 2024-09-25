// Profile.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig"; // Ensure you're importing your Firebase config
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //First we make sure user is logged in (auth.currentUser), we await and get their firestore doc,
  //and set its value in our variable. we also get the liked songs data.
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
            fetchLikedSongs(docSnap.data().likedSongs);
          } else {
            setError("No user data found.");
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    // Following code listens and if user logs out, they are taken away from the profile
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData();
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to fetch liked songs details
  const fetchLikedSongs = async (likedSongIds) => {
    try {
      const songs = await Promise.all(
        likedSongIds.map(async (songId) => {
          const response = await fetch(
            `http://localhost:5000/api/spotify/song/${songId}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return await response.json(); // Return the song data
        })
      );
      setLikedSongs(songs); // Set the liked songs state
    } catch (error) {
      console.error("Error fetching liked songs:", error);
      setError("Failed to fetch liked songs.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Hi there, {userData.username}</h1>

      <p>Your nationality: {userData.nationality}</p>
      {userData.profileImage && (
        <img
          src={userData.profileImage}
          alt={`${userData.username}'s profile`}
        />
      )}
      <p>These are your favorite songs:</p>
      <ul>
        {likedSongs.length > 0 ? (
          likedSongs.map((song) => (
            <li key={song.id}>
              {song.name} by{" "}
              {song.artists.map((artist) => artist.name).join(", ")}
            </li>
          ))
        ) : (
          <li>No favorite songs added.</li>
        )}
      </ul>
    </div>
  );
};

export default Profile;
