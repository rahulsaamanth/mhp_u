"use client"

import { useEffect } from "react"

export default function ScrollToTop({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return <>{children}</>
}
