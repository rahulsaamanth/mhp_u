"use server"

import { currentUser } from "@/lib/auth"
import { db } from "@/db/db"
import { executeRawQuery } from "@/db/db"

/**
 * Type definitions for order data
 */
export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string | string[]
}

export interface Order {
  id: string
  date: string
  status: "delivered" | "processing" | "shipped" | "cancelled"
  total: number
  items: OrderItem[]
  paymentMethod: string
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    pincode: string
  }
}

/**
 * Fetches user orders from the database
 */
export async function getUserOrders() {
  try {
    const user = await currentUser()
    if (!user?.id) {
      return { error: "Unauthorized", orders: [] }
    }

    const userId = user.id

    // Fetch orders from the database
    const ordersData = await executeRawQuery(
      `
      SELECT 
        o.id,
        o."createdAt" as date,
        CASE
          WHEN o."deliveryStatus" = 'PROCESSING' THEN 'processing'
          WHEN o."deliveryStatus" = 'SHIPPED' THEN 'shipped'
          WHEN o."deliveryStatus" = 'DELIVERED' THEN 'delivered'
          WHEN o."deliveryStatus" = 'CANCELLED' THEN 'cancelled'
          ELSE 'processing'
        END as status,
        o."totalAmountPaid" as total,
        CASE 
          WHEN p."paymentType" = 'CASH_ON_DELIVERY' THEN 'Cash on Delivery'
          WHEN p."paymentType" = 'UPI' THEN 'Online - Razorpay'
          ELSE 'Online Payment'
        END as "paymentMethod",
        jsonb_build_object(
          'name', o."customerName",
          'address', a.street,
          'city', a.city,
          'state', a.state,
          'pincode', a."postalCode"
        ) as "shippingAddress",
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', od.id,
              'name', prod.name,
              'price', od."unitPrice",
              'quantity', od.quantity,
              'image', CASE 
                WHEN pv."variantImage" IS NOT NULL 
                  AND pv."variantImage" != '{}' 
                  AND array_length(pv."variantImage", 1) > 0 
                THEN pv."variantImage"
                ELSE '{}'::text[]
              END
            )
          )
          FROM "OrderDetails" od
          JOIN "ProductVariant" pv ON od."productVariantId" = pv.id
          JOIN "Product" prod ON pv."productId" = prod.id
          WHERE od."orderId" = o.id
        ) as items
      FROM "Order" o
      LEFT JOIN "Address" a ON o."addressId" = a.id
      LEFT JOIN "Payment" p ON p."orderId" = o.id
      WHERE o."userId" = $1
      ORDER BY o."createdAt" DESC
    `,
      [userId]
    )

    return { orders: ordersData || [] }
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return { error: "Failed to fetch orders", orders: [] }
  }
}
