import { Separator } from "@/components/ui/separator"

export default function CheckoutLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form Loading */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Shipping Information */}
            <div className="space-y-6">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Payment Method */}
            <div className="space-y-6">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 border rounded-lg">
                    <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse mt-1" />
                    <div className="space-y-2 flex-1">
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Loading */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6" />
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="flex justify-between">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code */}
            <div className="mb-6">
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Order Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold mb-6">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
