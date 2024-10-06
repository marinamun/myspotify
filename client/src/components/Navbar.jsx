import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../styles/Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    // Check if the user is logged in with onAuth
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

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
    <nav>
      {/* Homepage will always be visible */}
      <Link
        to="/"
        onClick={() => handleLinkClick("home")}
        className={activeLink === "home" ? "active" : ""}
      >
        Homepage
      </Link>

      {user ? (
        <>
          {/* These options show when the user IS logged in */}
          <Link
            to="/profile"
            onClick={() => {
              handleLinkClick("profile");
              handleProfileClick(); // Ensure proper navigation
            }}
            className={activeLink === "profile" ? "active" : ""}
          >
            Profile
          </Link>
          <button onClick={handleSignOut} className="signout-btn">Sign out</button>
        </>
      ) : (
        <>
          {/* These options show when the user is NOT logged in */}
          <Link
            to="/signup"
            className={activeLink === "signup" ? "active" : ""}
            onClick={() => handleLinkClick("signup")}
          >
            Sign up
          </Link>
          <Link
            to="/login"
            className={activeLink === "login" ? "active" : ""}
            onClick={() => handleLinkClick("login")}
          >
            Log in
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
