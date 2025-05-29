"use client"

import { useState, useEffect } from "react"

export function useMagicLinkState() {
  const [requestTime, setRequestTime] = useState<number | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    // Load on component mount
    const storedTime = localStorage.getItem("magic_link_requested")
    const storedEmail = localStorage.getItem("magic_link_email")

    if (storedTime) setRequestTime(parseInt(storedTime))
    if (storedEmail) setEmail(storedEmail)
  }, [])

  const startMagicLinkFlow = (userEmail: string) => {
    const timestamp = Date.now()
    localStorage.setItem("magic_link_requested", timestamp.toString())
    localStorage.setItem("magic_link_email", userEmail)
    setRequestTime(timestamp)
    setEmail(userEmail)
  }

  const clearMagicLinkState = () => {
    localStorage.removeItem("magic_link_requested")
    localStorage.removeItem("magic_link_email")
    setRequestTime(null)
    setEmail(null)
  }

  return {
    requestTime,
    email,
    startMagicLinkFlow,
    clearMagicLinkState,
  }
}
