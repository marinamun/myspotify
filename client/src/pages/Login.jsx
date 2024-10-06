import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userLogin = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in");
      navigate("/");
    } catch (error) {
      console.log("User couldn't be logged in");
    }
  };
  return (
    <>
      <div className="login">
        <h1>Welcome back :)</h1>
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Log in
          </button>
        </form>
      </div>
    </>
  );
};
export default Login;
