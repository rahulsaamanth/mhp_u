export default function LoginLoading() {
  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md w-full max-w-md mx-auto sm:my-8 sm:border-t">
      {/* Logo Loading */}
      <div className="text-center space-y-2 mb-6">
        <div className="mx-auto w-32 h-20 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
        <div className="h-5 w-64 bg-gray-200 rounded animate-pulse mx-auto mt-2" />
      </div>

      {/* Welcome Text Loading */}
      <div className="space-y-2 text-center mb-6">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
        <div className="h-5 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
      </div>

      {/* Form Loading */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse mt-6" />
      </div>

      {/* Footer Text Loading */}
      <div className="h-4 w-full bg-gray-200 rounded animate-pulse mx-auto mt-8" />
    </div>
  )
}
