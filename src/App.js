
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Home";
import SectorPage from "./SectorPage";

const SECTORS = [
  { id: "irrigation", name: "Irrigation", color: "#34a853" },
  { id: "electricity", name: "Electricity", color: "#fbbc04" },
  { id: "drainage", name: "Drainage", color: "#4285f4" },
  { id: "roads", name: "Roads", color: "#a142f4" },
];

export default function App() {
  return (
    <Router>
      <div style={{ background: "#f5f7fa", minHeight: "100vh" }}>
        <nav style={{ display: "flex", padding: "16px", alignItems: "center", background: "#fff", justifyContent: "space-between"}}>
          <span style={{ fontSize: 22, fontWeight: "bold" }}>
            Community Service Platform
          </span>
          <div>
            <Link to="/" style={{ marginRight: 10, padding: "6px 18px", borderRadius: 8, background: "#fff", textDecoration: "none", fontWeight: "bold", color: "#222" }}>
              Home
            </Link>
            {SECTORS.map(sector => (
              <Link to={`/${sector.id}`} key={sector.id} style={{ marginRight: 10, padding: "6px 18px", background: sector.color, color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: "bold" }}>
                {sector.name}
              </Link>
            ))}
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home sectors={SECTORS} />} />
          {SECTORS.map(sector => (
            <Route
              key={sector.id}
              path={`/${sector.id}`}
              element={<SectorPage sector={sector} />}
            />
          ))}
        </Routes>
        <footer style={{ textAlign: "center", color: "#777", fontSize: 14, margin: 16 }}>
          Built for local communities — includes voice input in chatbot.
        </footer>
      </div>
    </Router>
  );
}
