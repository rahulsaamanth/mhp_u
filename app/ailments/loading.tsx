export default function AilmentsLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section Loading */}
      <div className="text-center mb-12">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
        <div className="h-5 w-full max-w-2xl bg-gray-200 rounded animate-pulse mx-auto" />
      </div>

      {/* Alphabet Filter Loading */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {[...Array(26)].map((_, i) => (
          <div key={i} className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>

      {/* Ailments Grid Loading */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse mb-4" />
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Featured Ailments Section Loading */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2 mb-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
