import { db } from "@/db/db"
import { currentUser } from "@/lib/auth"
import { NextResponse } from "next/server"
import { CartItem } from "@/store/cart"
import { cart } from "@rahulsaamanth/mhp-schema"
import { eq, isNull } from "drizzle-orm"
import { generateId } from "@/lib/generate-id"

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { items } = body as { items: CartItem[] }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No items to merge",
        stats: { created: 0, updated: 0, total: 0 },
      })
    }

    const results = await Promise.all(
      items.map(async (item) => {
        const conditions = [
          eq(cart.userId, user.id!),
          eq(cart.productId, item.productId),
          eq(cart.variantId, item.variantId),
        ]

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

        const existingItem = await db.query.cart.findFirst({
          where: (fields, { and }) => and(...conditions),
        })

        if (existingItem) {
          await db
            .update(cart)
            .set({
              quantity: existingItem.quantity + item.quantity,
              updatedAt: new Date(),
            })
            .where(eq(cart.id, existingItem.id))

          return { action: "updated", itemId: existingItem.id }
        } else {
          const newItemId = generateId()
          await db.insert(cart).values({
            id: newItemId,
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
