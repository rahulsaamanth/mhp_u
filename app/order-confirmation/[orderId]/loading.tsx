import { Separator } from "@/components/ui/separator"

export default function OrderConfirmationLoading() {
  return (
    <div className="min-h-[50vh] bg-gray-50">
      {/* Header Section */}
      <div className="bg-white py-8 shadow-sm">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-200" />
            </div>
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto" />
            <div className="h-4 w-96 bg-gray-200 rounded mx-auto" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Order Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-1">
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="h-6 w-36 bg-gray-200 rounded mb-4" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 w-full bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex justify-between py-2">
                      <div className="space-y-1">
                        <div className="h-4 w-48 bg-gray-200 rounded" />
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                      </div>
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                    </div>
                  ))}

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between">
                    <div className="h-5 w-16 bg-gray-200 rounded" />
                    <div className="h-5 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-center mt-8">
            <div className="h-11 w-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
