import { Separator } from "@/components/ui/separator"

export default function ProductLoading() {
  return (
    <div>
      <main className="container mx-auto px-4 py-20">
        {/* Product Variant Selector Loading */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <div className="aspect-square relative border rounded-lg overflow-hidden bg-gray-100 animate-pulse" />
          </div>
          <div className="flex flex-col space-y-6">
            <div className="space-y-3">
              <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-20 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-24 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-12 flex-1 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 flex-1 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Description and Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          <div className="md:col-span-3 space-y-8">
            <div className="space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-4 w-full bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-4 w-11/12 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-4 w-10/12 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Information Table */}
        <div className="mb-12">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4 animate-pulse" />
          <div className="border rounded overflow-hidden">
            <div className="divide-y">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "bg-gray-50" : ""}`}
                >
                  <div className="w-1/3 px-6 py-3">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="px-6 py-3 flex-1">
                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Related Products Section */}
      <div className="py-8 mx-auto">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6 mx-auto animate-pulse" />
        <div className="w-3/4 2xl:w-2/3 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[400px] bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
