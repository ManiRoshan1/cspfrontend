import React from "react";
import { Link } from "react-router-dom";

export default function Home({ sectors }) {
  return (
    <div style={{ maxWidth: 1200, margin: "36px auto", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 18px #0001", padding: "30px 30px" }}>
        <h1>Welcome</h1>
        <p>
          This platform helps citizens report problems in four sectors: Irrigation, Electricity, Drainage, and Roads.
        </p>
        <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
          {sectors.map(sector => (
            <Link
              to={`/${sector.id}`}
              key={sector.id}
              style={{
                background: sector.color,
                color: "#fff",
                minWidth: 200,
                flex: 1,
                borderRadius: 16,
                padding: "34px 24px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: 20,
                boxShadow: "0 2px 10px #0002"
              }}
            >
              {sector.name}
              <div style={{ fontWeight: "normal", fontSize: 16, marginTop: 8 }}>
                Open tools and contacts for {sector.name}.
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
