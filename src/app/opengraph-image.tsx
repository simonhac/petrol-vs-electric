import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        {/* Lightning bolt icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <svg width="200" height="200" viewBox="0 0 24 24" fill="#ef4444">
            <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33a2.5 2.5 0 002.5 2.5c.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5a2.5 2.5 0 005 0V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z" />
          </svg>
          <span style={{ color: "#a1a1aa", fontSize: 24, fontWeight: 500 }}>
            vs
          </span>
          <svg width="200" height="200" viewBox="0 0 24 24" fill="#22c55e">
            <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          Petrol vs Electric
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Live cost per km for the top 10 petrol cars vs top 10 EVs in Melbourne
        </div>

        {/* Colour bar */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              width: "200px",
              height: "8px",
              borderRadius: "4px",
              background: "#ef4444",
            }}
          />
          <div
            style={{
              width: "200px",
              height: "8px",
              borderRadius: "4px",
              background: "#22c55e",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
