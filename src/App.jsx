import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard.jsx";
import UploadExcel from "./pages/UploadExcel.jsx";
import Trades from "./pages/Trades.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">

        {/* Top Navbar */}
        <header className="topbar">
          <div className="brand">AnjelOne Trade Admin</div>

          <div className="nav-menu">
            <NavLink to="/" className="nav-item">
              Dashboard
            </NavLink>
            <NavLink to="/upload" className="nav-item">
              Upload Excel
            </NavLink>
            <NavLink to="/trades" className="nav-item">
              Trades History
            </NavLink>
          </div>

          <div className="api-info">
            {import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}
          </div>
        </header>

        {/* Page Content */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadExcel />} />
            <Route path="/trades" element={<Trades />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}