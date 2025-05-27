"use client"

import React from "react"

export default function GlobalLoading({ page = "Home" }: { page?: string }) {
  // Initialize with a more meaningful default
  const [currentPage, setCurrentPage] = React.useState(page)

  // Update the current page on component mount
  React.useEffect(() => {
    // Try to determine the current page from pathname
    try {
      const path = window.location.pathname
      if (path === "/") {
        setCurrentPage("Home")
      } else {
        // Extract last segment and format as title case
        const pathSegments = path.split("/").filter(Boolean)
        const lastSegment = pathSegments[pathSegments.length - 1] || ""

        if (lastSegment) {
          const formattedPage =
            lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
          setCurrentPage(formattedPage)
        }
      }
    } catch (error) {
      console.error("Error detecting current page:", error)
      // Keep the default value
    }
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-[9999]">
      <div className="flex flex-col items-center p-8 rounded-lg">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-t-brand-foreground border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin duration-1000"></div>
          <div
            className="absolute inset-3 border-4 border-t-transparent border-r-brand border-b-transparent border-l-transparent rounded-full animate-spin duration-700"
            style={{ animationDirection: "reverse" }}
          ></div>
        </div>
        <p className="mt-6 text-gray-700 font-medium text-lg">
          Loading {currentPage}...
        </p>
      </div>
    </div>
  )
}
