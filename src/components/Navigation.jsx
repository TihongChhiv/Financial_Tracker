import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="logo">💰 Finance Tracker</div>
      <div className="tabs">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          📊 Analytics
        </Link>
        <Link
          to="/journal"
          className={location.pathname === "/journal" ? "active" : ""}
        >
          📒 Journal
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
