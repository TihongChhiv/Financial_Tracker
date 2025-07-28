// src/App.jsx
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Analytics from "./pages/Analytics";
import Journal from "./pages/Journal";
import Navigation from "./components/Navigation";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app min-h-screen bg-gradient-to-b from-green-200 to-green-600 text-gray-900">
        <Navigation />
        <Routes>
          <Route path="/" element={<Analytics />} />
          <Route path="/journal" element={<Journal />} />
        </Routes>
      </div>
    </Router>
  );
}
