import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MI Estate: Find Your Ideal Home in Bangalore.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Og() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0E6476 0%, #063540 60%, #042129 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 34,
            color: "#E7B84B",
            fontWeight: 700,
          }}
        >
          🏠 MI Estate
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 74,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          Find Your Ideal Home in Bangalore
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 33,
            color: "#CDE9EE",
            maxWidth: 980,
          }}
        >
          Verified projects to buy, rent or resell. Honest advice, RERA-checked
          listings and end-to-end support across Bangalore.
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 14,
            fontSize: 24,
            color: "#9FD6C0",
          }}
        >
          <span>✓ Verified Projects</span>
          <span style={{ color: "#3A6470" }}>•</span>
          <span>✓ Honest Advice</span>
          <span style={{ color: "#3A6470" }}>•</span>
          <span>✓ End-to-End Support</span>
        </div>
      </div>
    ),
    size
  );
}
