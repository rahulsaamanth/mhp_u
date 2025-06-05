import { ImageResponse } from "next/og"
import { getProduct } from "@/actions/products"

export const runtime = "edge"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function Image({ params }: { params: { id: string } }) {
  try {
    const product = await getProduct(params.id)

    if (!product) {
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
            }}
          >
            Product Not Found
          </div>
        ),
        { ...size }
      )
    }

    const { name, brand } = product
    const brandName = brand?.name || "HomeoSouth"

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            background: "linear-gradient(to bottom, #ffffff, #f3f4f6)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#2D5575",
              marginBottom: "20px",
              textAlign: "center",
              maxWidth: "80%",
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
              marginBottom: "20px",
              width: "100%",
              maxHeight: "350px",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={name}
                style={{
                  objectFit: "contain",
                  maxHeight: "300px",
                  maxWidth: "80%",
                }}
              />
            ) : (
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                }}
              >
                No Image
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#555555",
            }}
          >
            By {brandName}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "30px",
              fontSize: 24,
              color: "#4b5563",
            }}
          >
            HomeoSouth - Premium Homeopathic Medicines
          </div>
        </div>
      ),
      { ...size }
    )
  } catch (e) {
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
          }}
        >
          Error Generating Image
        </div>
      ),
      { ...size }
    )
  }
}
