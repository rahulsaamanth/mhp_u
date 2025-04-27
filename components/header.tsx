"use client"

import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Cart from "./cart"
import MobileNavigation from "./mobile-navbar"
import DesktopNavbar from "./navbar"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import UserButton from "./user-button"
import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useRouter } from "next/navigation" // Fixed import for App Router
import Fuse from "fuse.js"

// Define proper interfaces for products
interface Product {
  id: string
  name: string
  category?: string
  manufacturer?: string
  potency?: string
  imageUrl?: string
}

// Client-side search index (sample product data)
const localProducts: Product[] = [
  // This will be populated from the server or through static props
]

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("searchHistory")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const searchCache = useRef(new Map<string, Product[]>())

  // Fuse.js for fuzzy searching
  const fuse = useMemo(() => {
    return new Fuse(localProducts, {
      keys: ["name", "category", "manufacturer", "potency"],
      threshold: 0.3,
      includeScore: true,
    })
  }, [])

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Handle clicks outside search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        event.target instanceof Node &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Optimize search query
  const optimizeSearchQuery = useCallback((query: string) => {
    let optimized = query.trim().replace(/\s+/g, " ")
    const stopWords = ["the", "a", "an", "of", "for", "with"]
    optimized = optimized
      .split(" ")
      .filter((word) => !stopWords.includes(word.toLowerCase()))
      .join(" ")
    return optimized
  }, [])

  // Get quick local suggestions (instant results)
  const getQuickSuggestions = useCallback(
    (query: string) => {
      if (!query || query.length < 2) return []

      // First try exact prefix matches (fastest)
      const prefixMatches = localProducts
        .filter((product) =>
          product.name.toLowerCase().startsWith(query.toLowerCase())
        )
        .slice(0, 3)

      if (prefixMatches.length > 0) {
        return prefixMatches
      }

      // Then try fuzzy search
      return fuse
        .search(query)
        .slice(0, 3)
        .map((result) => result.item)
    },
    [fuse]
  )

  // Fetch server-side suggestions
  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!query || query.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      // Show quick local suggestions immediately
      const quickResults = getQuickSuggestions(query)
      if (quickResults.length > 0) {
        setSuggestions(quickResults)
        setShowSuggestions(true)
      }

      // Check cache first
      const optimizedQuery = optimizeSearchQuery(query)
      if (searchCache.current.has(optimizedQuery)) {
        setSuggestions(searchCache.current.get(optimizedQuery) || [])
        setShowSuggestions(true)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(optimizedQuery)}`
        )
        const data = await response.json()

        // Cache the results
        searchCache.current.set(optimizedQuery, data.suggestions || [])

        // Update suggestions
        setSuggestions(data.suggestions || [])
        setShowSuggestions(true)
      } catch (error) {
        console.error("Error fetching suggestions:", error)
        // Fall back to local suggestions if API fails
        setSuggestions(quickResults)
      } finally {
        setIsLoading(false)
      }
    },
    [getQuickSuggestions, optimizeSearchQuery]
  )

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      fetchSuggestions(debouncedQuery)
    }
  }, [debouncedQuery, fetchSuggestions])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    // Show local results immediately for a responsive feel
    if (query.length >= 2) {
      const quickResults = getQuickSuggestions(query)
      setSuggestions(quickResults)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    if (searchQuery.trim()) {
      // Store in search history
      const updatedHistory = [
        searchQuery,
        ...searchHistory.filter((item) => item !== searchQuery),
      ].slice(0, 5)
      setSearchHistory(updatedHistory)
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory))

      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: Product) => {
    // First add to search history
    const updatedHistory = [
      suggestion.name,
      ...searchHistory.filter((item) => item !== suggestion.name),
    ].slice(0, 5)
    setSearchHistory(updatedHistory)
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory))

    // Clear search UI state
    setSuggestions([])
    setShowSuggestions(false)

    // Important: Clear search query after storing it in history
    // This prevents the query from showing in the search box after navigation
    setSearchQuery("")

    // Navigate to product page
    router.push(`/product/${suggestion.id}`)
  }

  // Handle history item click
  const handleHistoryClick = (query: string) => {
    setSearchQuery(query)
    setShowSuggestions(false)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <section className="flex w-full flex-col items-center justify-center px-4 py-2 md:py-0 md:flex-row md:gap-x-12 lg:gap-x-32">
        {/* Logo */}
        <div className="flex justify-between items-center w-full md:w-auto shrink-0">
          <Link
            href="/"
            className="relative transition-transform duration-150 active:scale-98"
          >
            <Image
              src="/the_logo.png"
              alt="LOGO"
              width={500}
              height={500}
              className="object-contain w-[120px] h-[80px] md:w-[160px] md:h-[100px] lg:w-[200px] lg:h-[100px]"
              priority
            />
          </Link>
          {/* Mobile cart and login */}
          <div className="flex md:hidden items-center justify-center gap-3 md:gap-4 ml-auto">
            <UserButton />
            <Cart />
            <div className="block md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="w-full max-w-2xl px-2 sm:px-0 relative" ref={searchRef}>
          <form
            onSubmit={handleSearch}
            className="flex items-center justify-center"
          >
            <Input
              className="rounded-none focus-visible:ring-offset-0 focus-visible:ring-0 border-r-0"
              placeholder="Search products by ailment, brand, category, potency..."
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => {
                if (searchQuery.length >= 2) setShowSuggestions(true)
                else if (searchHistory.length > 0) setShowSuggestions(true)
              }}
            />
            <Button
              type="submit"
              variant="default"
              className="bg-brand hover:bg-brand/90 rounded-none transition-colors cursor-pointer"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>

          {/* Search Suggestions and History Dropdown */}
          {showSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-72 overflow-y-auto">
              {/* Search History */}
              {searchQuery.length < 2 && searchHistory.length > 0 && (
                <div className="px-2 py-1 border-b">
                  <p className="text-xs text-gray-500 px-2 py-1">
                    Recent Searches
                  </p>
                  {searchHistory.map((query, index) => (
                    <div
                      key={`history-${index}`}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleHistoryClick(query)}
                    >
                      <Search className="h-3 w-3 mr-2 text-gray-400" />
                      <span>{query}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Search Results */}
              {searchQuery.length >= 2 &&
                (isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    Loading...
                  </div>
                ) : suggestions.length > 0 ? (
                  <ul className="py-1">
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.imageUrl && (
                          <div className="w-10 h-10 mr-3 flex-shrink-0">
                            <Image
                              src={suggestion.imageUrl}
                              alt={suggestion.name}
                              width={40}
                              height={40}
                              className="rounded-sm object-contain"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{suggestion.name}</p>
                          {suggestion.category && (
                            <p className="text-xs text-gray-500">
                              {suggestion.category}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  searchQuery.trim() !== "" &&
                  !isLoading && (
                    <div className="p-4 text-center text-gray-500">
                      No results found
                    </div>
                  )
                ))}
            </div>
          )}
        </div>

        {/* Desktop cart and login */}
        <div className="hidden md:flex items-center justify-center gap-4">
          <Cart />
          <UserButton />
        </div>
      </section>
      <DesktopNavbar />
    </header>
  )
}
