import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SongDetails = () => {
  const { id } = useParams(); // Get track ID from URL
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching track details: {error.message}</p>;
  }

  if (track) {
    // Add this line to log the image URL
    console.log("⭐🎀🎀🎀💃🏽Album image URL:", track.album.images[0]?.url);
  }
  const albumImage =
    track.album.images.find((image) => image.width === 300)?.url ||
    track.album.images[0]?.url;

  return (
    <>
      <h1>Song Details</h1>
      {track && (
        <div>
          <h2>{track.name}</h2>
          <p>Artist: {track.artists.map((artist) => artist.name).join(", ")}</p>
          <p>Album: {track.album.name}</p>
          <p>Release Date: {track.album.release_date}</p>
          <img src={track.album.images[0]?.url} alt={track.name} width="300" />
          {albumImage && (
            <img src={albumImage} alt={track.name} width="300" />
          )}{" "}
          {/* Display image */}
        </div>
      )}
    </>
  );
};

export default SongDetails;
