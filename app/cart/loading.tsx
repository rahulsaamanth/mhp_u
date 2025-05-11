import { Separator } from "@/components/ui/separator"

export default function CartLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Loading */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Cart Header */}
            <div className="flex justify-between pb-4 border-b">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Cart Items */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex border-b py-4">
                <div className="w-24 h-24 bg-gray-200 rounded animate-pulse flex-shrink-0" />
                <div className="flex-1 ml-4 space-y-3">
                  <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex flex-col items-end justify-between ml-4">
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}

            {/* Empty Cart Message (hidden when loading) */}
            <div className="hidden py-12 text-center space-y-4">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
              <div className="h-5 w-96 bg-gray-200 rounded animate-pulse mx-auto" />
              <div className="h-10 w-40 bg-gray-200 rounded animate-pulse mx-auto mt-4" />
            </div>
          </div>
        </div>

        {/* Cart Summary Loading */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold mb-6">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="space-y-4">
              <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
