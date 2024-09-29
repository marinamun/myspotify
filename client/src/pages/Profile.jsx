import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
            const data = docSnap.data();
            setUserData(data);
            const likedSongsArray = Array.isArray(data.likedSongs)
              ? data.likedSongs
              : [];
            setLikedSongs(likedSongsArray);
            if (likedSongsArray.length > 0) {
              fetchLikedSongs(likedSongsArray);
            }
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
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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
          const songData = await response.json();

          // We return a new object for songData, we defined its uri as the id
          return { id: songData.uri, ...songData };
        })
      );
      setLikedSongs(songs);
      console.log("Liked songs set:", songs);
    } catch (error) {
      console.error("Error fetching liked songs:", error);
      setError("Failed to fetch liked songs.");
    }
  };

  //We create a new array of likedSongs (updatedLikedSongs) that filters the song the user removed.
  // Then we update the new array of likedsongs in firestore and update the state of the variable
  const removeSongFromFavorites = async (songId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);

        /*  console.log("Current liked songs:", likedSongs);
        console.log("Trying to remove songId:", songId); */

        const updatedLikedSongs = likedSongs.filter(
          (song) => song.id !== songId
        );
        console.log("Updated liked songs array:", updatedLikedSongs);

        await updateDoc(userDocRef, {
          likedSongs: updatedLikedSongs,
        });

        setLikedSongs(updatedLikedSongs);
      }
    } catch (error) {
      console.error("Error removing song:", error);
      setError("Failed to remove song from favorites.");
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
      {userData ? (
        <>
          <h1>Hi there, {userData.username}</h1>
          <p>Your nationality: {userData.nationality}</p>
          {userData.profileImage && (
            <img
              src={userData.profileImage}
              style={{ width: "200px" }}
              alt="Profile"
            />
          )}
          <p>These are your favorite songs:</p>
          <ul>
            {Array.isArray(likedSongs) && likedSongs.length > 0 ? (
              likedSongs.map((song) => {
                return (
                  <li key={song.id}>
                    {song.name} by{" "}
                    {Array.isArray(song.artists)
                      ? song.artists.map((artist) => artist.name).join(", ")
                      : "Unknown Artist"}
                    <button onClick={() => removeSongFromFavorites(song.id)}>
                      Remove
                    </button>
                  </li>
                );
              })
            ) : (
              <li>No favorite songs added.</li>
            )}
          </ul>
        </>
      ) : (
        <div>No user data available.</div>
      )}
    </div>
  );
};

export default Profile;
