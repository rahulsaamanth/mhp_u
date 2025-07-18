import { executeRawQuery } from "@/db/db"
import { notFound } from "next/navigation"
import { formatCurrency } from "@/lib/formatters"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2 } from "lucide-react"
import { OrderConfirmationHeader } from "@/components/order-confirmation-header"

const checkmarkAnimation = {
  "@keyframes checkmark": {
    "0%": { transform: "scale(0)", opacity: 0 },
    "50%": { transform: "scale(1.2)" },
    "100%": { transform: "scale(1)", opacity: 1 },
  },
}

interface OrderDetails {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  paymentStatus: string
  createdAt: Date
  subtotal: number
  shippingCost: number
  discount: number
  tax: number
  totalAmountPaid: number
  invoiceNumber: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
  } | null
  payment: Array<{
    paymentType: string
    status: string
  }>
  orderDetails: Array<{
    id: string
    quantity: number
    unitPrice: number
    discountAmount: number
    taxAmount: number
    variant: {
      variantImage: string[]
      product: {
        name: string
      }
    }
  }>
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params

  const orderData = (await executeRawQuery<OrderDetails>(
    `
    SELECT 
      o.*,
      jsonb_build_object(
        'street', a.street,
        'city', a.city,
        'state', a.state,
        'postalCode', a."postalCode"
      ) as address,
      COALESCE(
        jsonb_agg(
          DISTINCT jsonb_build_object(
            'paymentType', p."paymentType",
            'status', p.status
          )
        ) FILTER (WHERE p.id IS NOT NULL),
        '[]'
      ) as payment,
      COALESCE(
        jsonb_agg(
          DISTINCT jsonb_build_object(
            'id', od.id,
            'quantity', od.quantity,
            'unitPrice', od."unitPrice",
            'discountAmount', od."discountAmount",
            'taxAmount', od."taxAmount",
            'variant', jsonb_build_object(
              'variantImage', CASE 
                WHEN pv."variantImage" IS NOT NULL 
                  AND pv."variantImage" != '{}' 
                  AND array_length(pv."variantImage", 1) > 0 
                THEN pv."variantImage"
                ELSE '{}'::text[]
              END,
              'product', jsonb_build_object(
                'name', prod.name
              )
            )
          )
        ) FILTER (WHERE od.id IS NOT NULL),
        '[]'
      ) as "orderDetails"
    FROM "Order" o
    LEFT JOIN "Address" a ON o."addressId" = a.id
    LEFT JOIN "Payment" p ON p."orderId" = o.id
    LEFT JOIN "OrderDetails" od ON od."orderId" = o.id
    LEFT JOIN "ProductVariant" pv ON od."productVariantId" = pv.id
    LEFT JOIN "Product" prod ON pv."productId" = prod.id
    WHERE o.id = $1
    GROUP BY o.id, a.id
  `,
    [orderId]
  )) as OrderDetails[] | null

  const order = orderData?.[0]

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-[60vh] bg-gray-50">
      <OrderConfirmationHeader invoiceNumber={order.invoiceNumber} />

      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  Order Information
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500">Invoice Number</p>
                      <p className="font-medium">{order.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Order ID</p>
                      <p className="font-medium">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Order Date</p>
                      <p className="font-medium">
                        {order.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500">Payment Method</p>
                      <p className="font-medium">
                        {order.payment?.[0]?.paymentType}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Payment Status</p>
                      <p className="font-medium">{order.paymentStatus}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Delivery Details
                </h2>
                <div className="text-sm space-y-2">
                  <p className="font-medium text-base">{order.customerName}</p>
                  <p className="text-gray-600">{order.address?.street}</p>
                  <p className="text-gray-600">
                    {order.address?.city}, {order.address?.state} -{" "}
                    {order.address?.postalCode}
                  </p>
                  <p className="text-gray-600">Phone: {order.customerPhone}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg h-fit">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4">
                {order.orderDetails.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 py-3 border-b last:border-b-0"
                  >
                    <div className="w-16 h-16 relative flex-shrink-0 border rounded-md overflow-hidden">
                      <Image
                        src={
                          Array.isArray(item.variant.variantImage) &&
                          item.variant.variantImage.length > 0
                            ? item.variant.variantImage.find(
                                (img) =>
                                  img && img !== "null" && img.trim() !== ""
                              ) || "/placeholder.png"
                            : "/placeholder.png"
                        }
                        alt={item.variant.product.name}
                        fill
                        className="object-contain p-1"
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement>
                        ) => {
                          e.currentTarget.src = "/placeholder.png"
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-sm">
                        {item.variant.product.name}
                      </p>
                      <p className="text-gray-600 text-xs">
                        Qty: {item.quantity} x {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <p className="font-medium text-sm">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                ))}

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{formatCurrency(order.shippingCost)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmountPaid)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/orders">View Orders</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
