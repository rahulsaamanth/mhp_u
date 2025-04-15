// hooks/use-products-search.ts
"use client"
import {
  useQueryState,
  parseAsStringLiteral,
  parseAsIndex,
  parseAsInteger,
} from "nuqs"
import { useQuery } from "@tanstack/react-query"

export function useProductsSearch() {
  // URL state with nuqs
  const [query, setQuery] = useQueryState("q")
  const [category, setCategory] = useQueryState("category")
  const [manufacturer, setManufacturer] = useQueryState("manufacturer")
  const [potency, setPotency] = useQueryState("potency")
  const [form, setForm] = useQueryState(
    "form",
    parseAsStringLiteral(["DILUTION", "TABLET", "OINTMENT", "NONE"])
  )
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(12)
  )

  // Data fetching with TanStack Query
  const searchResult = useQuery({
    queryKey: [
      "products",
      "search",
      { query, category, manufacturer, potency, form, page, limit },
    ],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (query) searchParams.set("q", query)
      if (category) searchParams.set("category", category)
      if (manufacturer) searchParams.set("manufacturer", manufacturer)
      if (potency) searchParams.set("potency", potency)
      if (form) searchParams.set("form", form)
      searchParams.set("page", String(page))
      searchParams.set("limit", String(limit))

      const response = await fetch(`/api/search?${searchParams.toString()}`)
      if (!response.ok) throw new Error("Search failed")
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Helper function to reset page when filters change
  const updateFilter = (
    type: "query" | "category" | "manufacturer" | "potency" | "form",
    value: string | null
  ) => {
    setPage(1)

    switch (type) {
      case "query":
        setQuery(value)
        break
      case "category":
        setCategory(value)
        break
      case "manufacturer":
        setManufacturer(value)
        break
      case "potency":
        setPotency(value)
        break
      case "form":
        setForm(value as any)
        break
    }
  }

  return {
    // Search state
    filters: { query, category, manufacturer, potency, form, page, limit },

    // Search results
    results: searchResult.data?.products || [],
    totalItems: searchResult.data?.total || 0,
    totalPages: searchResult.data?.totalPages || 0,

    // Loading and error states
    isLoading: searchResult.isLoading,
    error: searchResult.error,

    // Update methods
    updateFilter,
    setPage,
    setLimit,
  }
}
