export default function HomeLoading() {
  return (
    <main className="flex flex-col gap-8">
      {/* Hero Section Loading */}
      <div className="bg-gray-100 w-full">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-5/6 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 w-40 bg-gray-200 rounded animate-pulse mt-6" />
            </div>
            <div className="aspect-[4/3] w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Search By Ailment Loading */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
          <div className="h-5 w-96 bg-gray-200 rounded mx-auto mt-3 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Popular Products Loading */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
          <div className="h-5 w-96 bg-gray-200 rounded mx-auto mt-3 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Loading */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
          <div className="h-5 w-96 bg-gray-200 rounded mx-auto mt-3 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/2 aspect-square bg-gray-200 animate-pulse" />
              <div className="md:w-1/2 p-6 space-y-4">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Products Loading */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
          <div className="h-5 w-96 bg-gray-200 rounded mx-auto mt-3 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>

      {/* Testimonials Loading */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
            <div className="h-5 w-96 bg-gray-200 rounded mx-auto mt-3 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
