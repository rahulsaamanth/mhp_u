import { db } from "@/db/db"
import { currentUser } from "@/lib/auth"
import { NextResponse } from "next/server"
import { CartItem } from "@/store/cart"
import { cart } from "@rahulsaamanth/mhp-schema"
import { eq, isNull } from "drizzle-orm"
import { generateId } from "@/lib/generate-id"

export async function POST(request: Request) {
  try {
    // Get current user
    const user = await currentUser()
    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      )
    }

    // Get cart items from request body
    const body = await request.json()
    const { items } = body as { items: CartItem[] }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No items to merge",
        stats: { created: 0, updated: 0, total: 0 },
      })
    }

    // Process each item to merge with server cart
    const results = await Promise.all(
      items.map(async (item) => {
        // Build the where conditions to check if item exists
        const conditions = [
          eq(cart.userId, user.id!),
          eq(cart.productId, item.productId),
          eq(cart.variantId, item.variantId),
        ]

        // For potency and packSize, handle null/undefined values
        if (item.potency) {
          conditions.push(eq(cart.potency, item.potency))
        } else {
          conditions.push(isNull(cart.potency))
        }

        if (item.packSize) {
          conditions.push(eq(cart.packSize, item.packSize))
        } else {
          conditions.push(isNull(cart.packSize))
        }

        // Check if this item already exists in the server cart
        const existingItem = await db.query.cart.findFirst({
          where: (fields, { and }) => and(...conditions),
        })

        if (existingItem) {
          // Item exists - update quantity
          await db
            .update(cart)
            .set({
              quantity: existingItem.quantity + item.quantity,
              updatedAt: new Date(),
            })
            .where(eq(cart.id, existingItem.id))

          return { action: "updated", itemId: existingItem.id }
        } else {
          // Item doesn't exist - create new
          const newItemId = generateId()
          await db.insert(cart).values({
            id: newItemId, // Make sure ID is included
            userId: user.id!,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            potency: item.potency || null,
            packSize: item.packSize || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          })

          return { action: "created", itemId: newItemId }
        }
      })
    )

    // Count how many items were created vs updated
    const created = results.filter((r) => r.action === "created").length
    const updated = results.filter((r) => r.action === "updated").length

    return NextResponse.json({
      success: true,
      message: `Cart merged successfully: ${created} items added, ${updated} items updated`,
      stats: { created, updated, total: items.length },
    })
  } catch (error) {
    console.error("Error merging cart:", error)
    return NextResponse.json({ error: "Failed to merge cart" }, { status: 500 })
  }
}
