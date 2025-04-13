"use server"

import { db } from "@/db/db"
import { CartItem, AddToCartInput } from "@/store/cart"
import { currentUser } from "@/lib/auth"
import { eq, isNull } from "drizzle-orm"
import { cart, product, productVariant } from "@rahulsaamanth/mhp-schema"
import { generateId } from "@/lib/generate-id"

export async function getUserCart() {
  const user = await currentUser()
  if (!user?.id) return { items: [] }

  try {
    const cartItems = await db
      .select({
        id: cart.id,
        productId: cart.productId,
        variantId: cart.variantId,
        quantity: cart.quantity,
        potency: cart.potency,
        packSize: cart.packSize,
      })
      .from(cart)
      .where(eq(cart.userId, user.id))

    // Fetch product details for each cart item
    const items = await Promise.all(
      cartItems.map(async (item) => {
        const productData = await db.query.product.findFirst({
          where: eq(product.id, item.productId),
          columns: {
            name: true,
          },
        })

        const variantData = await db.query.productVariant.findFirst({
          where: eq(productVariant.id, item.variantId),
          columns: {
            variantImage: true,
            sellingPrice: true,
            stockByLocation: true,
          },
        })

        // Calculate total stock across all locations
        const stocks =
          variantData?.stockByLocation?.map((data) => data.stock) || []
        const totalStock = stocks.reduce((acc, stock) => acc + stock, 0)

        return {
          id: item.id,
          productId: item.productId,
          variantId: item.variantId,
          name: productData?.name || "Unknown Product",
          image: variantData?.variantImage?.[0] || "",
          price: variantData?.sellingPrice || 0,
          quantity: item.quantity,
          potency: item.potency || undefined,
          packSize: item.packSize || undefined,
          totalStock: totalStock || 0,
        } as CartItem
      })
    )

    return { items }
  } catch (error) {
    console.error("Failed to fetch cart:", error)
    return { items: [] }
  }
}

export async function addToCart(item: AddToCartInput) {
  const user = await currentUser()
  if (!user?.id)
    return { success: false, error: "Please login to add items to cart" }

  try {
    // First, check available stock
    const variantData = await db.query.productVariant.findFirst({
      where: eq(productVariant.id, item.variantId),
      columns: {
        stockByLocation: true,
      },
    })

    // Calculate total stock across all locations
    const stocks = variantData?.stockByLocation?.map((data) => data.stock) || []
    const totalStock = stocks.reduce((acc, stock) => acc + stock, 0)

    // Build the where conditions properly to handle null/undefined values
    const conditions = [
      eq(cart.userId, user.id),
      eq(cart.productId, item.productId),
      eq(cart.variantId, item.variantId),
    ]

    // For potency and packSize, we need to handle both the case where they match
    // and the case where they are both null in the database
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

    // Use the properly built conditions for the query
    const existingItem = await db.query.cart.findFirst({
      where: (fields, { and }) => and(...conditions),
    })

    console.log(
      "Existing item check:",
      existingItem ? "Found existing item" : "No existing item found"
    )

    // Calculate new quantity (existing + new)
    const newQuantity = (existingItem?.quantity || 0) + item.quantity

    // Check if new quantity exceeds available stock
    if (newQuantity > totalStock) {
      return {
        success: false,
        error: `Cannot add more items. Only ${totalStock} available in stock.`,
      }
    }

    if (existingItem) {
      console.log("Updating quantity for existing item:", existingItem.id)
      await db
        .update(cart)
        .set({
          quantity: newQuantity,
          updatedAt: new Date(),
        })
        .where(eq(cart.id, existingItem.id))
    } else {
      console.log("Adding new item to cart")
      const newItemId = generateId()
      await db.insert(cart).values({
        id: newItemId,
        userId: user.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        potency: item.potency || null,
        packSize: item.packSize || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log("Added new item with ID:", newItemId)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to add to cart:", error)
    return { success: false, error: "Failed to add item to cart" }
  }
}

export async function removeCartItem(itemId: string) {
  const user = await currentUser()
  if (!user?.id) return { success: false, error: "User not authenticated" }

  try {
    // Verify the item belongs to the user
    const existingItem = await db.query.cart.findFirst({
      where: (fields) => eq(fields.id, itemId),
    })

    if (!existingItem || existingItem.userId !== user.id) {
      return { success: false, error: "Item not found or unauthorized" }
    }

    await db.delete(cart).where(eq(cart.id, itemId))
    return { success: true }
  } catch (error) {
    console.error("Failed to remove cart item:", error)
    return { success: false, error: "Failed to remove item" }
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const user = await currentUser()
  if (!user?.id) return { success: false, error: "User not authenticated" }

  try {
    // Check if this cart item belongs to the current user
    const existingItem = await db.query.cart.findFirst({
      where: (fields) => eq(fields.id, itemId),
    })

    if (!existingItem || existingItem.userId !== user.id) {
      return { success: false, error: "Item not found or unauthorized" }
    }

    // Check available stock
    const variantData = await db.query.productVariant.findFirst({
      where: eq(productVariant.id, existingItem.variantId),
      columns: {
        stockByLocation: true,
      },
    })

    // Calculate total stock across all locations
    const stocks = variantData?.stockByLocation?.map((data) => data.stock) || []
    const totalStock = stocks.reduce((acc, stock) => acc + stock, 0)

    // Check if quantity exceeds available stock
    if (quantity > totalStock) {
      return {
        success: false,
        error: `Cannot update quantity. Only ${totalStock} available in stock.`,
      }
    }

    await db
      .update(cart)
      .set({
        quantity: quantity,
        updatedAt: new Date(),
      })
      .where(eq(cart.id, itemId))

    return { success: true }
  } catch (error) {
    console.error("Failed to update cart item quantity:", error)
    return { success: false, error: "Failed to update quantity" }
  }
}

export async function clearUserCart() {
  const user = await currentUser()
  if (!user?.id) return { success: false, error: "User not authenticated" }

  try {
    await db.delete(cart).where(eq(cart.userId, user.id))
    return { success: true }
  } catch (error) {
    console.error("Failed to clear cart:", error)
    return { success: false, error: "Failed to clear cart" }
  }
}
