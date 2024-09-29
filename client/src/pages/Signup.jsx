import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig"; // Import the auth object
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [nationality, setNationality] = useState("");
  const [profileImage, setProfileImage] = useState("");

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

      //DATABASE. adding all the user's data to firestore.
      await setDoc(doc(db, "users", userCreation.user.uid), {
        name,
        username,
        nationality,
        profileImage,
      });
      console.log(">>User created and data saved to Firestore:", user);
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
            type="text"
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
            placeholder="Profile Image URL (optional)"
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </>
  );
};
export default Signup;
