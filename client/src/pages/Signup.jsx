import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../firebaseConfig"; // Import the auth object
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [nationality, setNationality] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      //AUTHENTICATION. creating the user with firebase through email and password.
      const userCreation = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCreation.user;

      console.log("User created, info: ", userCreation);

      // Upload the image if it exists
      let profileImageUrl = "";
      if (profileImage) {
        const imageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(imageRef, profileImage);
        profileImageUrl = await getDownloadURL(imageRef);
      }

      //DATABASE. adding all the user's data to firestore.
      await setDoc(doc(db, "users", user.uid), {
        name,
        username,
        nationality,
        profileImage: profileImageUrl,
      });
      console.log(">>User created and data saved to Firestore:", user);
      navigate("/");
    } catch (error) {
      console.log(
        " xxxx Error saving user to Firestore:",
        error.message,
        error.code
      );
    }
  };

  return (
    <>
      <div>
        <h2>Create Account🎀</h2>
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="text"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            placeholder="Nationality"
            required
          />
          <input
            type="file"
            onChange={(e) => setProfileImage(e.target.files[0])}
            accept="image/*"
          />

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </>
  );
};
export default Signup;
