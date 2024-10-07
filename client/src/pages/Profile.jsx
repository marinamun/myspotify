import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  //First we make sure user is logged in (auth.currentUser), we await and get their firestore doc,
  //and set its value in our variable. we also get the liked songs data.
  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      console.log("Current User:", user);

      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        console.log(
          "Document Snapshot:",
          docSnap.exists() ? docSnap.data() : "No document found"
        );

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
      } else {
        setError("User is not authenticated.");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  // Following code listens and if user logs out, they are taken away from the profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData();
      } else {
        navigate("/login");
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [navigate]);

  const fetchLikedSongs = async (likedSongIds) => {
    try {
      const songs = await Promise.all(
        likedSongIds.map(async (songId) => {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/spotify/song/${songId}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const songData = await response.json();

          return {
            id: songData.uri.split(":").pop(),
            name: songData.name,
            artists: songData.artists,
            album: songData.album,
          };
        })
      );
      setLikedSongs(songs);
    } catch (error) {
      console.error("Error fetching liked songs:", error);
      setError("Failed to fetch liked songs.");
    }
  };

  const removeSongFromFavorites = async (songId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);

        // Filter the likedSongs to remove the songId
        const updatedLikedSongs = likedSongs
          .map((song) => song.id)
          .filter((id) => id !== songId);

        await updateDoc(userDocRef, {
          likedSongs: updatedLikedSongs,
        });

        fetchLikedSongs(updatedLikedSongs);
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
          <div className="profile-card">
            <h1>Hi there, {userData.username}</h1>
            {userData.profileImage && (
              <img
                src={userData.profileImage}
                style={{ width: "200px" }}
                alt="Profile"
              />
            )}
          </div>
          <div className="liked-songs">
            <h2>These are your favorite songs:</h2>
            <ul>
              {Array.isArray(likedSongs) && likedSongs.length > 0 ? (
                likedSongs.map((song, index) => {
                  return (
                    <li key={song.id || index}>
                      <div className="each-liked-song">
                        <Link to={`/song/${song.id}`}>
                          ♪ <strong>{song.name} </strong>by{" "}
                          {Array.isArray(song.artists)
                            ? song.artists
                                .map((artist) => artist.name)
                                .join(", ")
                            : "Unknown Artist"}
                        </Link>
                        <button
                          onClick={() => removeSongFromFavorites(song.id)}
                          className="remove-btn"
                        >
                          ❌
                        </button>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li>No favorite songs added.</li>
              )}
            </ul>
          </div>
        </>
      ) : (
        <div>No user data available.</div>
      )}
    </div>
  );
};

export default Profile;
