import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Import the auth object

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const userCreation = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User created, info: ", userCreation);
    } catch (error) {
      console.log("User was not created, error: ", error);
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
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </>
  );
};
export default Signup;
