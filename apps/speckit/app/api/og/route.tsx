import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "80px",
          background: "linear-gradient(135deg, #6366f1, #0f172a)",
          color: "white",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ fontSize: 24, opacity: 0.85 }}>speckit.airnub.io</div>
        <div>
          <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.1 }}>End vibe-coding</div>
          <div style={{ fontSize: 28, marginTop: 24, maxWidth: "80%", opacity: 0.9 }}>
            Govern specs, policy gates, and evidence in one loop.
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 24 }}>
          <span>Spec loop</span>
          <span>Policy gates</span>
          <span>Evidence</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
