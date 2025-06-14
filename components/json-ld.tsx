import React from "react"

interface JsonLdProps {
  data: Record<string, any> | Array<Record<string, any>>
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
