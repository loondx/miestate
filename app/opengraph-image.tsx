import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MI Estate: Verified Premium Properties. Expert Guidance.";
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
            gap: 16,
            fontSize: 34,
            color: "#67BF84",
            fontWeight: 700,
          }}
        >
          ✓ MI Estate
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          Verified Premium Properties.
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            color: "#CDE9EE",
            maxWidth: 900,
          }}
        >
          Expert guidance and verified, RERA-registered projects from trusted
          developers across Bangalore. Advisory, not sales pressure.
        </div>
      </div>
    ),
    size
  );
}
