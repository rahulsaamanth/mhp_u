"use client"

import Link from "next/link"
import { ArrowLeft, Mail, Clock, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function VerifyRequest() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [minutes, setMinutes] = useState(10)
  const [seconds, setSeconds] = useState(0)

  // 1. Store verification timestamp in localStorage when component mounts
  useEffect(() => {
    if (!localStorage.getItem("magic_link_requested")) {
      localStorage.setItem("magic_link_requested", Date.now().toString())
    }
  }, [])

  // 2. Use the stored timestamp for accurate timer display
  useEffect(() => {
    const requestTime = parseInt(
      localStorage.getItem("magic_link_requested") || Date.now().toString()
    )
    const expiryTime = requestTime + 10 * 60 * 1000 // 10 minutes in milliseconds

    const timer = setInterval(() => {
      const now = Date.now()
      const remaining = Math.max(0, expiryTime - now)

      if (remaining <= 0) {
        setMinutes(0)
        setSeconds(0)
        clearInterval(timer)
      } else {
        setMinutes(Math.floor(remaining / (60 * 1000)))
        setSeconds(Math.floor((remaining % (60 * 1000)) / 1000))
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 3. Poll for session status and redirect when authenticated
  useEffect(() => {
    if (status === "authenticated" && session) {
      localStorage.removeItem("magic_link_requested")
      router.push("/") // Redirect to home or dashboard
    }

    // Check every 2 seconds for auth changes
    const interval = setInterval(() => {
      // Force session refresh
      const event = new Event("visibilitychange")
      document.dispatchEvent(event)
    }, 2000)

    // Listen for auth events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_completed") {
        router.push("/")
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [status, session, router])

  // Get email from localStorage
  const [userEmail, setUserEmail] = useState<string>("")

  useEffect(() => {
    // Get the email address from localStorage
    const email = localStorage.getItem("magic_link_email")
    if (email) {
      setUserEmail(email)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-brand text-white p-6 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              type: "spring",
              stiffness: 100,
            }}
            className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4"
          >
            <Mail className="h-8 w-8" />
          </motion.div>
          <h1 className="text-2xl font-bold">Check Your Email</h1>
          <p className="mt-2 text-white/80">
            We&apos;ve sent a magic link to{" "}
            {userEmail ? <strong>{userEmail}</strong> : "your email address"}
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-blue-700">
                  Link expires in{" "}
                  <span className="font-bold">
                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm text-amber-700">
                  If you don&apos;t see the email, check your spam folder or
                  make sure you entered the correct email address.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href="/auth/login"
              className="flex items-center justify-center space-x-2 w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to login</span>
            </Link>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            Need help?{" "}
            <a
              href="mailto:support@yourdomain.com"
              className="text-brand hover:underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </motion.div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Please note that the magic link will work only once</p>
        <p className="mt-1">© {new Date().getFullYear()} Homeo South</p>
      </div>
    </div>
  )
}
