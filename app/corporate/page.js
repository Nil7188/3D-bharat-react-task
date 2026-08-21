export default function CorporatePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: "#64748b",
            marginBottom: "8px",
          }}
        >
          3D Bharat
        </p>

        <h1
          style={{
            color: "#0f172a",
            margin: 0,
          }}
        >
          Corporate Dashboard
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "10px",
          }}
        >
          Corporate investment overview and portfolio
          management.
        </p>

        <div
          style={{
            marginTop: "30px",
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.06)",
          }}
        >
          <h2>Corporate Dashboard</h2>

          <p style={{ color: "#64748b" }}>
            Corporate analytics module is ready for
            further development.
          </p>
        </div>
      </div>
    </main>
  );
}