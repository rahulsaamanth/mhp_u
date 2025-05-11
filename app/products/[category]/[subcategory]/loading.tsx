import { Separator } from "@/components/ui/separator"

export default function ProductsSubcategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Loading */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Loading */}
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Category Title */}
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-4" />
            
            {/* Filter Sections */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-3">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid Loading */}
        <div className="md:col-span-3">
          {/* Category Header */}
          <div className="mb-6">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Sorting and Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-9 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
