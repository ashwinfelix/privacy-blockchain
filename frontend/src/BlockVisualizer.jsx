import React, { useEffect, useState } from "react";

export default function BlockVisualizer() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/blocks?count=5");
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "Failed to fetch blocks");
        setBlocks(data.blocks);
      } catch (err) {
        console.error("Error fetching blocks:", err);
      }
    };
    fetchBlocks();
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "20px", overflowX: "auto" }}>
      {blocks.map((b, idx) => (
        <React.Fragment key={b.number}>
          <div
            style={{
              border: "2px solid #4caf50",
              borderRadius: "8px",
              padding: "15px",
              minWidth: "200px",
              textAlign: "left",
              backgroundColor: "#e8f5e9",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.2)"
            }}
          >
            <div><strong>Block:</strong> {b.number}</div>
            <div><strong>Hash:</strong> {b.hash.slice(0, 16)}...</div>
            {b.txs.length > 0 ? (
              <div>
                <strong>Txs:</strong>
                {b.txs.map((t, i) => (
                  <div key={i} style={{ fontSize: "12px" }}>
                    {t.from.slice(0,6)} → {t.to ? t.to.slice(0,6) : "Contract"}
                  </div>
                ))}
              </div>
            ) : (
              <div>No transactions</div>
            )}
          </div>
          {idx < blocks.length - 1 && (
            <div style={{ margin: "0 10px", fontSize: "24px", color: "#4caf50" }}>➡️</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
