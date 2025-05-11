export default function BrandsLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section Loading */}
      <div className="text-center mb-12">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
        <div className="h-5 w-full max-w-2xl bg-gray-200 rounded animate-pulse mx-auto" />
      </div>

      {/* Brands Grid Loading */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Featured Brands Section Loading */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-full h-40 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
