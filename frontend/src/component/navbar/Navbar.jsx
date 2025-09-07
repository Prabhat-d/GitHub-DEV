import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/CodeCollabLogo.png";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav>
      <Link to="/">
        <div>
          <img src={logo} alt="GitHub Logo" className="navbar-logo" />
          <h3>CodeCollab</h3>
        </div>
      </Link>
      <div>
        <Link to="/repo/create">
          <p>Create a Repository</p>
        </Link>
        <Link to="/profile">
          <p>View Profile</p>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;