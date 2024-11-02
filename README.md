https://spotitube.netlify.app/

# SpotiTube

SpotiTube is a web app where users can search for songs, view detailed song information, and curate their favorite tracks. Additionally, users can explore popular songs by genre and watch YouTube videos of tracks, even without needing a Spotify Premium account. Firebase authentication is integrated to allow users to save their favorite songs.

## Features

- **Search for Songs**: Search your favorite songs and view detailed information about each track.
- **Top Artists and Tracks**: If logged in, users can view their most listened-to tracks and artists.
- **Popular Tracks by Genre**: Explore current popular tracks in genres like Pop, Reggaeton, and Country.
- **Curate Your Favorites**: Logged-in users can add their favorite tracks to their profile, stored in Firebase.
- **Watch YouTube Videos**: Listen to music and watch related YouTube videos without needing Spotify Premium.

## Usage

### Search Functionality

- Type the name of any song in the search bar, and it will return the top 10 matching tracks from the Spotify API.
- Click on a song to view detailed information about the track, including related YouTube videos.

### Popular Songs by Genre

- Explore the most popular songs in the selected genre by using the toggle buttons for "Pop", "Reggaeton", and "Country".
- When a genre is selected, the app will display the top tracks in that genre.

### User Favorites

- Users can log in using Firebase authentication. Once logged in, you can:
  - View your top artists and top tracks.
  - Add songs to your favorite list by clicking the "Add to Favorites" button on any song's detail page.

### Watching YouTube Videos

- On the song detail page, the app will fetch related YouTube videos so you can watch them directly from the app.

## Tech Stack

- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **APIs**: Spotify API, YouTube Data API v3
- **Authentication**: Firebase Authentication
- **Database**: Firestore (for storing user favorites)

## API Endpoints

- **Search Tracks**: `/api/spotify/search?query=<song_name>`

  - Fetches the top 10 tracks based on the user's search query.

- **Top Tracks and Artists**:

  - `/api/spotify/top-tracks`
    - Fetches the user's top tracks if authenticated.
  - `/api/spotify/top-artists`
    - Fetches the user's top artists if authenticated.

- **Popular Tracks by Genre**: `/api/spotify/popular-tracks?genre=<genre>`

  - Fetches the current popular tracks by the specified genre.

- **Song Details**: `/api/spotify/song/<track_id>`

  - Fetches detailed information about a specific track.

- **YouTube Videos**: `/api/youtube/youtube-video?songTitle=<song_name>`
  - Fetches related YouTube videos for a track based on the song title.

## Future Enhancements

- Add playlist creation functionality for logged-in users.
- Improve mobile responsiveness.
- Add more genre options and a custom playlist feature.

## Author

- **Marina**  
  [LinkedIn](https://www.linkedin.com/in/marinamun/) | [GitHub](https://github.com/marinamun/myspotify) |
