// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/explore">Explore</Link>
      <Link to="/create">Create</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  );
}

export default Navbar;
