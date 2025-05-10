"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  AlertTriangle,
  ShieldX,
  Info,
  RefreshCw,
} from "lucide-react"
import { motion } from "framer-motion"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorInfo = {
    default: {
      title: "Authentication Error",
      description: "There was a problem with your authentication request.",
      icon: AlertTriangle,
      color: "bg-red-500",
      bgColor: "bg-red-50",
    },
    configuration: {
      title: "Server Configuration Error",
      description:
        "There is a problem with the server configuration. Please contact support.",
      icon: ShieldX,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
    },
    accessdenied: {
      title: "Access Denied",
      description: "You do not have permission to sign in.",
      icon: ShieldX,
      color: "bg-red-500",
      bgColor: "bg-red-50",
    },
    verification: {
      title: "Verification Error",
      description:
        "The verification link may have expired or already been used.",
      icon: AlertTriangle,
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
    },
    oauthsignin: {
      title: "OAuth Sign In Error",
      description: "There was a problem signing in with the selected provider.",
      icon: AlertTriangle,
      color: "bg-red-500",
      bgColor: "bg-red-50",
    },
    oauthcallback: {
      title: "OAuth Callback Error",
      description: "There was a problem completing the sign in process.",
      icon: AlertTriangle,
      color: "bg-red-500",
      bgColor: "bg-red-50",
    },
    sessionrequired: {
      title: "Session Required",
      description: "You must be signed in to access this page.",
      icon: Info,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
  }

  const {
    title,
    description,
    icon: Icon,
    color,
    bgColor,
  } = errorInfo[error as keyof typeof errorInfo] || errorInfo.default

  return (
    <div className="h-[70vh] bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className={`${color} text-white p-6 text-center`}>
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
            <Icon className="h-8 w-8" />
          </motion.div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-white/80">{description}</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div
              className={`flex items-start space-x-3 p-4 ${bgColor} rounded-lg`}
            >
              <Info className="h-5 w-5 text-gray-700 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700">
                  {error === "verification"
                    ? "Please try signing in again to receive a new verification link."
                    : error === "sessionrequired"
                    ? "Please sign in to continue to your destination page."
                    : "You can try again or use a different sign-in method."}
                </p>
              </div>
            </div>

            {error && (
              <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded overflow-auto">
                <p>Error code: {error}</p>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href="/auth/login"
              className="flex items-center justify-center space-x-2 w-full p-3 bg-brand hover:bg-brand/90 rounded-lg transition-colors text-white font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Sign In</span>
            </Link>

            {error === "verification" && (
              <Link
                href="/auth/login"
                className="flex items-center justify-center space-x-2 w-full p-3 border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors text-gray-700 font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Get a New Magic Link</span>
              </Link>
            )}
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
        <p>© {new Date().getFullYear()} Homeo South</p>
      </div>
    </div>
  )
}
