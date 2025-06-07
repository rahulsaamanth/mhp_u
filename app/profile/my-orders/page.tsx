"use client"

import React, { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Eye, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import FallbackImage from "@/components/ui/fallback-image"
import { getUserOrders, Order, OrderItem } from "@/actions/orders"

// Empty array for initial orders state
const initialOrders: Order[] = []

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

// Helper function to get status badge color
function getStatusColor(status: Order["status"]): string {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800"
    case "processing":
      return "bg-blue-100 text-blue-800"
    case "shipped":
      return "bg-purple-100 text-purple-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true)
        const { orders, error } = await getUserOrders()

        if (error) {
          setError(error)
        } else {
          setOrders(orders)
        }
      } catch (err) {
        setError("Failed to fetch your orders. Please try again later.")
        console.error("Error fetching orders:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

  // Helper function to get the correct image URL
  const getImageUrl = (image: string | string[]): string => {
    if (!image) return "/placeholder.png"
    if (Array.isArray(image)) {
      const validImage = image.find(
        (img) => img && img !== "null" && img.trim() !== ""
      )
      return validImage || "/placeholder.png"
    }
    if (
      typeof image === "string" &&
      image &&
      image !== "null" &&
      image.trim() !== ""
    ) {
      return image
    }
    return "/placeholder.png"
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-[50vh]">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-brand text-white p-2 rounded-full">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>

      <div className="bg-green-50 border-l-4 border-brand p-4 mb-6">
        <p className="text-sm">
          <span className="font-semibold">Note:</span> Mangalore Homeopathic
          Pharmacy is our registered business name. HomeoSouth is the digital
          brand representing our online presence.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Order History</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="h-10 bg-gray-300 rounded w-40"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-medium text-lg text-red-600">Error</h3>
          <p className="text-gray-700 mt-2 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <ShoppingBag className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <h3 className="font-medium text-lg">No orders yet</h3>
          <p className="text-gray-500 mt-2 mb-4">
            You haven't placed any orders yet.
          </p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Order #{order.id}</h3>
                      <Badge
                        className={`capitalize ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on {formatDate(order.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      ₹{order.total.toFixed(2)}
                    </span>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="border-t bg-gray-50">
                  <div className="p-4 space-y-4">
                    {/* Order items */}
                    <div>
                      <h4 className="font-medium mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 bg-white p-3 rounded-md"
                          >
                            <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-md border">
                              <FallbackImage
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="object-cover object-center h-full w-full"
                                fallbackSrc="/placeholder.png"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="text-sm font-medium">
                                {item.name}
                              </h5>
                              <div className="text-xs text-gray-500 mt-1">
                                Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Order summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Payment info */}
                      <div>
                        <h4 className="font-medium mb-2">
                          Payment Information
                        </h4>
                        <p className="text-sm">
                          Payment Method:{" "}
                          <span className="font-medium">
                            {order.paymentMethod}
                          </span>
                        </p>
                        <div className="mt-2 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>
                              ₹
                              {order.items
                                .reduce(
                                  (sum, item) =>
                                    sum + item.price * item.quantity,
                                  0
                                )
                                .toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>₹50.00</span>
                          </div>
                          <div className="flex justify-between font-medium mt-1">
                            <span>Total</span>
                            <span>₹{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping info */}
                      <div>
                        <h4 className="font-medium mb-2">Shipping Address</h4>
                        <p className="text-sm font-medium">
                          {order.shippingAddress.name}
                        </p>
                        <p className="text-sm">
                          {order.shippingAddress.address}
                        </p>
                        <p className="text-sm">
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state} -{" "}
                          {order.shippingAddress.pincode}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                      <Link href={`/order-confirmation/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
