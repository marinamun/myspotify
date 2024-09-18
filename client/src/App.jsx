import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SongDetails from "./pages/SongDetails";

function App() {
  return (
    <Router>
      {" "}
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/song/:id" element={<SongDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
