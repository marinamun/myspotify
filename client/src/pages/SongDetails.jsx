import { useParams } from "react-router-dom";

const SongDetails = () => {
//Get the id from the url
  const { id } = useParams();

  //Let's fetch the song so we can show the data!!!

  return (
    <>
      <h1>You chose the song</h1>
    </>
  );
};
export default SongDetails;
