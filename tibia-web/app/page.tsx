import Calculator from "../components/calculator";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 20px 32px",
        color: "#e2e8f0",
      }}
    >
      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
        }}
      >
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "28px",
            padding: "36px",
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(17,24,39,0.92) 50%, rgba(30,41,59,0.95) 100%)",
            border: "1px solid rgba(148, 163, 184, 0.14)",
            boxShadow: "0 24px 70px rgba(0, 0, 0, 0.35)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at top, rgba(56,189,248,0.18), transparent 30%), radial-gradient(circle at right, rgba(168,85,247,0.14), transparent 28%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 14px",
                borderRadius: "999px",
                background: "rgba(56, 189, 248, 0.12)",
                border: "1px solid rgba(56, 189, 248, 0.18)",
                color: "#7dd3fc",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Tibia Utility
            </span>

            <h1
              style={{
                margin: "18px 0 14px 0",
                fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                lineHeight: 1.02,
                fontWeight: 900,
                color: "#f8fafc",
              }}
            >
              Tibia Task or Sell
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: "760px",
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "#cbd5e1",
              }}
            >
              Compare NPC price, Market price, and Delivery Task XP to decide
              whether it is better to sell your items immediately or use them
              for progression.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "24px",
              }}
            >
              {[
                "Modern calculator UI",
                "Live XP and gold comparison",
                "Clear recommendation system",
              ].map((text) => (
                <div
                  key={text}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "16px",
                    background: "rgba(15, 23, 42, 0.72)",
                    border: "1px solid rgba(148, 163, 184, 0.12)",
                    color: "#cbd5e1",
                    fontSize: "0.92rem",
                  }}
                >
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginTop: "28px" }}>
          <Calculator />
        </section>

        <footer
          style={{
            marginTop: "28px",
            textAlign: "center",
            color: "#64748b",
            fontSize: "0.92rem",
          }}
        >
          Built for Tibia players who want a faster way to decide between profit
          and progression.
        </footer>
      </div>
    </main>
  );
}