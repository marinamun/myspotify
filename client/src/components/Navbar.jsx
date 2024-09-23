import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in with onAuth
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Remember this redirects user to login page if they click "profile" while being logged out
  const handleProfileClick = () => {
    if (!user) {
      navigate("/login");
    }
  };

  return (
    <>
      <p>This will be the navbar</p>
      {/* This will always be visible */} <Link to="/">Homepage</Link>
      <Link to="/profile" onClick={handleProfileClick}>
        Profile
      </Link>{" "}
      {!user ? (
        <>
          {/*   These show when user is NOT logged in */}
          <Link to="/signup">Sign up</Link>
          <Link to="/login">Log in</Link>
        </>
      ) : (
        <>
          {/*   These show when user IS logged in */}
          <button onClick={handleSignOut}>Sign out</button>
        </>
      )}
    </>
  );
};

export default Navbar;
