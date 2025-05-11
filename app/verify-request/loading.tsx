export default function VerifyRequestLoading() {
  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-200 animate-pulse" />
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
          <div className="space-y-2">
            <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-5/6 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  )
}
