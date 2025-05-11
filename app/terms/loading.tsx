export default function TermsLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section Loading */}
      <div className="text-center mb-8">
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
      </div>

      {/* Content Loading */}
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
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
