export default function AboutHomeopathyLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section Loading */}
      <div className="text-center mb-12">
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
        <div className="h-5 w-full max-w-2xl bg-gray-200 rounded animate-pulse mx-auto" />
        <div className="h-5 w-5/6 max-w-2xl bg-gray-200 rounded animate-pulse mx-auto mt-2" />
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-5 w-full bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
        <div className="aspect-video bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="aspect-video bg-gray-200 rounded animate-pulse md:order-1 order-2" />
        <div className="space-y-6 md:order-2 order-1">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-5 w-full bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Principles Section */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-5 w-full bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>
        <div className="space-y-4 max-w-3xl mx-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-5 w-full bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
