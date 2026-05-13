"use client";

import { useMemo, useState } from "react";
import items from "../data/delivery-task-items.json";
import difficultyCaps from "../data/difficulty-caps.json";
import xpRules from "../data/xp-rules.json";
import {
  calculateMarketTotal,
  calculateNpcTotal,
  calculateTaskXp,
  getRecommendation,
  type Difficulty,
} from "../lib/calculations";

type Item = {
  name: string;
  category: string;
  min_required: number;
  max_required: number;
  npc_buy_price: number;
  source: string;
  notes: string | null;
};

const typedItems = items as Item[];
const typedDifficultyCaps = difficultyCaps as unknown as Record<
  Difficulty,
  number | null
>;
const typedXpRules = xpRules as { base_multiplier: number };

function formatNumber(value: number) {
  return value.toLocaleString();
}

const cardStyle: React.CSSProperties = {
  borderRadius: "28px",
  padding: "24px",
  background: "rgba(15, 23, 42, 0.82)",
  border: "1px solid rgba(148, 163, 184, 0.14)",
  boxShadow: "0 24px 70px rgba(0, 0, 0, 0.25)",
  backdropFilter: "blur(10px)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  marginTop: "8px",
  borderRadius: "16px",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  background: "rgba(2, 6, 23, 0.9)",
  color: "#e2e8f0",
  outline: "none",
  fontSize: "0.96rem",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "2px",
  color: "#cbd5e1",
  fontSize: "0.95rem",
  fontWeight: 600,
};

const statCardStyle: React.CSSProperties = {
  borderRadius: "20px",
  padding: "18px",
  background: "rgba(2, 6, 23, 0.6)",
  border: "1px solid rgba(148, 163, 184, 0.1)",
};

const summaryCardStyle: React.CSSProperties = {
  borderRadius: "20px",
  padding: "18px",
  border: "1px solid rgba(148, 163, 184, 0.1)",
};

const buttonStyle: React.CSSProperties = {
  border: "1px solid rgba(125, 211, 252, 0.2)",
  background: "rgba(56, 189, 248, 0.1)",
  color: "#bae6fd",
  borderRadius: "14px",
  padding: "12px 16px",
  fontWeight: 700,
  cursor: "pointer",
};

export default function Calculator() {
  const [selectedItemName, setSelectedItemName] = useState(
    typedItems[0]?.name ?? ""
  );
  const [quantity, setQuantity] = useState(10);
  const [marketPrice, setMarketPrice] = useState(0);
  const [level, setLevel] = useState(100);
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");

  const selectedItem = useMemo(
    () =>
      typedItems.find((item) => item.name === selectedItemName) ?? typedItems[0],
    [selectedItemName]
  );

  const npcTotal = selectedItem
    ? calculateNpcTotal(quantity, selectedItem.npc_buy_price)
    : 0;

  const marketTotal = calculateMarketTotal(quantity, marketPrice);

  const xpResult = calculateTaskXp(
    level,
    difficulty,
    typedDifficultyCaps,
    typedXpRules.base_multiplier
  );

  const recommendation = getRecommendation(
    npcTotal,
    marketTotal,
    xpResult.finalXp
  );

  const profitDifference = Math.abs(npcTotal - marketTotal);

  const bestGold =
    marketTotal > npcTotal ? "Market" : npcTotal > marketTotal ? "NPC" : "Tie";

  function resetForm() {
    setSelectedItemName(typedItems[0]?.name ?? "");
    setQuantity(10);
    setMarketPrice(0);
    setLevel(100);
    setDifficulty("beginner");
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "24px",
      }}
    >
      <section
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        }}
      >
        <div style={statCardStyle}>
          <div
            style={{
              fontSize: "0.78rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            Total Items
          </div>
          <div
            style={{
              marginTop: "10px",
              fontSize: "1.8rem",
              fontWeight: 900,
              color: "#f8fafc",
            }}
          >
            {typedItems.length}
          </div>
        </div>

        <div style={statCardStyle}>
          <div
            style={{
              fontSize: "0.78rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            Best Gold Option
          </div>
          <div
            style={{
              marginTop: "10px",
              fontSize: "1.4rem",
              fontWeight: 900,
              color:
                bestGold === "Market"
                  ? "#fcd34d"
                  : bestGold === "NPC"
                    ? "#86efac"
                    : "#e2e8f0",
            }}
          >
            {bestGold}
          </div>
        </div>

        <div style={statCardStyle}>
          <div
            style={{
              fontSize: "0.78rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            Profit Difference
          </div>
          <div
            style={{
              marginTop: "10px",
              fontSize: "1.4rem",
              fontWeight: 900,
              color: "#7dd3fc",
            }}
          >
            {formatNumber(profitDifference)} gp
          </div>
        </div>

        <div style={statCardStyle}>
          <div
            style={{
              fontSize: "0.78rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            Final XP
          </div>
          <div
            style={{
              marginTop: "10px",
              fontSize: "1.4rem",
              fontWeight: 900,
              color: "#c4b5fd",
            }}
          >
            {formatNumber(xpResult.finalXp)}
          </div>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gap: "24px",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          alignItems: "start",
        }}
      >
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.75rem",
                  color: "#f8fafc",
                }}
              >
                Calculator
              </h2>
              <p
                style={{
                  margin: "10px 0 0 0",
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  color: "#94a3b8",
                }}
              >
                Choose an item, enter your market price, and compare the gold
                value against the XP reward from the task.
              </p>
            </div>

            <button onClick={resetForm} style={buttonStyle}>
              Reset
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gap: "18px",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Item</label>
              <select
                value={selectedItemName}
                onChange={(e) => setSelectedItemName(e.target.value)}
                style={inputStyle}
              >
                {typedItems.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Quantity</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Market price per item</label>
              <input
                type="number"
                min={0}
                value={marketPrice}
                onChange={(e) => setMarketPrice(Number(e.target.value))}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Level</label>
              <input
                type="number"
                min={1}
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                style={inputStyle}
              >
                <option value="beginner">Beginner</option>
                <option value="adept">Adept</option>
                <option value="expert">Expert</option>
                <option value="mastery">Mastery</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "14px",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              marginTop: "24px",
            }}
          >
            <div style={statCardStyle}>
              <div
                style={{
                  fontSize: "0.78rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#64748b",
                }}
              >
                Item Category
              </div>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#f8fafc",
                }}
              >
                {selectedItem?.category}
              </div>
            </div>

            <div style={statCardStyle}>
              <div
                style={{
                  fontSize: "0.78rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#64748b",
                }}
              >
                Required Amount
              </div>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#f8fafc",
                }}
              >
                {selectedItem?.min_required} - {selectedItem?.max_required}
              </div>
            </div>

            <div style={statCardStyle}>
              <div
                style={{
                  fontSize: "0.78rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#64748b",
                }}
              >
                NPC Price / Item
              </div>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#7dd3fc",
                }}
              >
                {formatNumber(selectedItem?.npc_buy_price ?? 0)} gp
              </div>
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <div
            style={{
              marginBottom: "24px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "1.75rem",
                color: "#f8fafc",
              }}
            >
              Results
            </h2>
            <p
              style={{
                margin: "10px 0 0 0",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                color: "#94a3b8",
              }}
            >
              Live values based on your current inputs.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "14px",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            }}
          >
            <div
              style={{
                ...summaryCardStyle,
                background: "rgba(34, 197, 94, 0.1)",
                borderColor: "rgba(34, 197, 94, 0.2)",
              }}
            >
              <div
                style={{
                  fontSize: "0.78rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(134, 239, 172, 0.8)",
                }}
              >
                NPC Total
              </div>
              <div
                style={{
                  marginTop: "12px",
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "#86efac",
                }}
              >
                {formatNumber(npcTotal)}
              </div>
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "0.88rem",
                  color: "rgba(220, 252, 231, 0.75)",
                }}
              >
                gold coins
              </div>
            </div>

            <div
              style={{
                ...summaryCardStyle,
                background: "rgba(245, 158, 11, 0.1)",
                borderColor: "rgba(245, 158, 11, 0.2)",
              }}
            >
              <div
                style={{
                  fontSize: "0.78rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(253, 224, 71, 0.8)",
                }}
              >
                Market Total
              </div>
              <div
                style={{
                  marginTop: "12px",
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "#fcd34d",
                }}
              >
                {formatNumber(marketTotal)}
              </div>
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "0.88rem",
                  color: "rgba(254, 243, 199, 0.75)",
                }}
              >
                gold coins
              </div>
            </div>

            <div
              style={{
                ...summaryCardStyle,
                background: "rgba(139, 92, 246, 0.1)",
                borderColor: "rgba(139, 92, 246, 0.2)",
              }}
            >
              <div
                style={{
                  fontSize: "0.78rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(196, 181, 253, 0.85)",
                }}
              >
                Base XP
              </div>
              <div
                style={{
                  marginTop: "12px",
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "#c4b5fd",
                }}
              >
                {formatNumber(xpResult.baseXp)}
              </div>
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "0.88rem",
                  color: "rgba(237, 233, 254, 0.75)",
                }}
              >
                before cap evaluation
              </div>
            </div>

            <div
              style={{
                ...summaryCardStyle,
                background: "rgba(217, 70, 239, 0.1)",
                borderColor: "rgba(217, 70, 239, 0.2)",
              }}
            >
              <div
                style={{
                  fontSize: "0.78rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(233, 213, 255, 0.85)",
                }}
              >
                Final XP
              </div>
              <div
                style={{
                  marginTop: "12px",
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "#e9d5ff",
                }}
              >
                {formatNumber(xpResult.finalXp)}
              </div>
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "0.88rem",
                  color: "rgba(250, 232, 255, 0.75)",
                }}
              >
                {xpResult.capped ? "cap applied" : "not capped"}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "24px",
              display: "grid",
              gap: "14px",
            }}
          >
            <div style={statCardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ color: "#94a3b8" }}>Selected item</span>
                <strong style={{ color: "#f8fafc" }}>{selectedItem?.name}</strong>
              </div>
            </div>

            <div style={statCardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ color: "#94a3b8" }}>Profit difference</span>
                <strong style={{ color: "#f8fafc" }}>
                  {formatNumber(profitDifference)} gp
                </strong>
              </div>
            </div>

            <div style={statCardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ color: "#94a3b8" }}>XP capped</span>
                <strong style={{ color: xpResult.capped ? "#fca5a5" : "#86efac" }}>
                  {xpResult.capped ? "Yes" : "No"}
                </strong>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "24px",
              borderRadius: "22px",
              padding: "20px",
              background:
                "linear-gradient(135deg, rgba(56,189,248,0.12), rgba(168,85,247,0.12))",
              border: "1px solid rgba(125, 211, 252, 0.14)",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#7dd3fc",
              }}
            >
              Recommendation
            </div>
            <p
              style={{
                margin: "12px 0 0 0",
                fontSize: "0.96rem",
                lineHeight: 1.8,
                color: "#e2e8f0",
              }}
            >
              {recommendation}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}