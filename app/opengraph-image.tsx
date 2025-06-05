import { ImageResponse } from "next/og"

export const runtime = "edge"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(to bottom, #ffffff, #f3f4f6)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#2D5575",
            marginBottom: "20px",
          }}
        >
          HomeoSouth
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#555555",
            marginTop: "10px",
          }}
        >
          Premium Homeopathic Medicines from India
        </div>
      </div>
    ),
    { ...size }
  )
}
