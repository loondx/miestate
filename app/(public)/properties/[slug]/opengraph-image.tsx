import { ImageResponse } from "next/og";
import { getPropertyBySlug } from "@/lib/data/properties";

export const runtime = "nodejs";
export const alt = "Property on MI Estate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Og({ params }: { params: { slug: string } }) {
  const p = await getPropertyBySlug(params.slug);

  if (!p) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0E6476 0%, #063540 100%)",
            color: "white",
            fontSize: 56,
            fontWeight: 800,
          }}
        >
          🏠 MI Estate
        </div>
      ),
      size
    );
  }

  const photo = p.photos?.[0];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#063540" }}>
        {/* Photo background */}
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        {/* Dark gradient for legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(4,33,41,0.25) 0%, rgba(4,33,41,0.55) 55%, rgba(4,33,41,0.92) 100%)",
          }}
        />

        {/* Top bar: brand + verified */}
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 56,
            right: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 32, fontWeight: 700, color: "white" }}>
            🏠 MI Estate
          </div>
          {p.verified && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#E7B84B",
                color: "#1a1300",
                fontSize: 24,
                fontWeight: 700,
                padding: "10px 20px",
                borderRadius: 999,
              }}
            >
              ✓ Verified by MI Estate
            </div>
          )}
        </div>

        {/* Bottom: details */}
        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            bottom: 52,
            display: "flex",
            flexDirection: "column",
            color: "white",
          }}
        >
          <div style={{ fontSize: 26, color: "#CDE9EE", display: "flex" }}>{p.developer}</div>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, marginTop: 6, display: "flex" }}>
            {p.name}
          </div>
          <div style={{ fontSize: 30, color: "#E2E8E6", marginTop: 14, display: "flex" }}>
            📍 {p.locality}, Bangalore
          </div>
          <div
            style={{
              marginTop: 22,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.95)",
                color: "#0E6476",
                fontSize: 32,
                fontWeight: 800,
                padding: "12px 24px",
                borderRadius: 14,
              }}
            >
              {p.priceFromLabel}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
