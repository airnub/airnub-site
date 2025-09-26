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
          background: "linear-gradient(135deg, #0f172a, #0ea5e9)",
          color: "white",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ fontSize: 24, opacity: 0.85 }}>airnub.io</div>
        <div>
          <div style={{ fontSize: 60, fontWeight: 600, lineHeight: 1.1 }}>Governed developer platforms</div>
          <div style={{ fontSize: 28, marginTop: 24, maxWidth: "80%", opacity: 0.9 }}>
            Operationalize trust across specs, guardrails, and evidence with Airnub and Speckit.
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 24 }}>
          <span>Govern</span>
          <span>Automate</span>
          <span>Prove</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
