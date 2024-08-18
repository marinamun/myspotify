import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <p>This will be the navbar</p>
      <Link to="/">Homepage</Link>
      <Link to="/signup">Sign up</Link>
      <Link to="/login">Log in</Link>
    </>
  );
};
export default Navbar;
