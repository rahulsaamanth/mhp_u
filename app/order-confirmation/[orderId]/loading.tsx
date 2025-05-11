import { Separator } from "@/components/ui/separator"

export default function OrderConfirmationLoading() {
  return (
    <div className="min-h-[60vh] bg-gray-50">
      <div className="bg-white py-14 shadow-sm">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-5">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
            </div>
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-14">
        <div className="bg-white rounded-xl shadow-md p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="h-6 w-48 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-1">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="h-6 w-36 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-full bg-gray-200 rounded animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="h-6 w-32 bg-gray-200 rounded mb-6 animate-pulse" />
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex justify-between py-2">
                      <div className="space-y-1">
                        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between">
                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-12">
            <div className="h-11 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-11 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
