"use server"

// filepath: /home/saamanth/Code0/mhp_u/actions/addresses.ts
import { auth } from "@/auth"
import { db } from "@/db/db"
import { eq, and } from "drizzle-orm"
import { z } from "zod"
import { addressSchema as addressSchemaImport } from "@/schemas"
import { ENTITY_PREFIX } from "@/schemas"
import { revalidatePath } from "next/cache"

// Import address table from schema
// We need to access it from the imported schema
import * as dbSchema from "@rahulsaamanth/mhp-schema"
const { address } = dbSchema

// Use the address schema from our schemas directory
const AddressFormSchema = addressSchemaImport

export type AddressFormValues = z.infer<typeof AddressFormSchema>

/**
 * Fetches user addresses from the database
 */
export async function getUserAddresses() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { addresses: [], error: "Unauthorized" }
    }

    const userId = session.user.id

    const addresses = await db
      .select()
      .from(address)
      .where(eq(address.userId, userId))
      .orderBy(address.createdAt)

    return { addresses }
  } catch (error) {
    console.error("Error fetching user addresses:", error)
    return { addresses: [], error: "Failed to fetch addresses" }
  }
}

/**
 * Creates a new address for the user
 */
export async function createAddress(formData: AddressFormValues) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }
    ;``
    const userId = session.user.id

    // Validate form data
    const validatedFields = AddressFormSchema.safeParse(formData)
    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid form data",
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const addressData = validatedFields.data
    const isDefault = formData.isDefault || false

    // If this address is to be default, first reset others
    if (isDefault) {
      await db
        .update(address)
        .set({
          isDefault: false,
          updatedAt: new Date(),
        })
        .where(eq(address.userId, userId))
    }

    // Insert the new address
    const [newAddress] = await db
      .insert(address)
      .values({
        userId,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
        country: addressData.country,
        type: addressData.type,
        isDefault: isDefault,
      })
      .returning()

    // Revalidate the path to update UI
    revalidatePath("/profile/my-addresses")

    return {
      success: true,
      message: "Address created successfully",
      address: newAddress,
    }
  } catch (error) {
    console.error("Error creating address:", error)
    return {
      success: false,
      error: "Failed to create address",
    }
  }
}

/**
 * Updates an existing address
 */
export async function updateAddress(
  addressId: string,
  formData: AddressFormValues
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const userId = session.user.id

    // Validate form data
    const validatedFields = AddressFormSchema.safeParse(formData)
    if (!validatedFields.success) {
      return {
        success: false,
        error: "Invalid form data",
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      }
    }

    // Verify address belongs to user
    const existingAddress = await db
      .select()
      .from(address)
      .where(and(eq(address.id, addressId), eq(address.userId, userId)))
      .limit(1)

    if (existingAddress.length === 0) {
      return { success: false, error: "Address not found" }
    }

    const isDefault = formData.isDefault || false

    // If this address is to be default, first reset others
    if (isDefault) {
      await db
        .update(address)
        .set({
          isDefault: false,
          updatedAt: new Date(),
        })
        .where(eq(address.userId, userId))
    }

    // Update the address
    await db
      .update(address)
      .set({
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        isDefault: isDefault,
        updatedAt: new Date(),
      })
      .where(and(eq(address.id, addressId), eq(address.userId, userId)))

    // Revalidate the path to update UI
    revalidatePath("/profile/my-addresses")

    return {
      success: true,
      message: "Address updated successfully",
    }
  } catch (error) {
    console.error("Error updating address:", error)
    return {
      success: false,
      error: "Failed to update address",
    }
  }
}

/**
 * Deletes an address
 */
export async function deleteAddress(addressId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const userId = session.user.id

    // Verify address belongs to user
    const existingAddress = await db
      .select()
      .from(address)
      .where(and(eq(address.id, addressId), eq(address.userId, userId)))
      .limit(1)

    if (existingAddress.length === 0) {
      return { success: false, error: "Address not found" }
    }

    // Check if the address being deleted is a default address
    const isDefault = existingAddress[0].isDefault

    // Delete the address
    await db
      .delete(address)
      .where(and(eq(address.id, addressId), eq(address.userId, userId)))

    // If we deleted a default address, set a new one as default (if any exist)
    if (isDefault) {
      const remainingAddresses = await db
        .select()
        .from(address)
        .where(eq(address.userId, userId))
        .limit(1)

      if (remainingAddresses.length > 0) {
        await db
          .update(address)
          .set({
            isDefault: true,
            updatedAt: new Date(),
          })
          .where(eq(address.id, remainingAddresses[0].id))
      }
    }

    // Revalidate the path to update UI
    revalidatePath("/profile/my-addresses")

    return {
      success: true,
      message: "Address deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting address:", error)
    return {
      success: false,
      error: "Failed to delete address",
    }
  }
}

/**
 * Sets an address as default
 */
export async function setDefaultAddress(addressId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const userId = session.user.id

    // Verify address belongs to user
    const existingAddress = await db
      .select()
      .from(address)
      .where(and(eq(address.id, addressId), eq(address.userId, userId)))
      .limit(1)

    if (existingAddress.length === 0) {
      return { success: false, error: "Address not found" }
    }

    // First set all user addresses as non-default
    await db
      .update(address)
      .set({
        isDefault: false,
        updatedAt: new Date(),
      })
      .where(eq(address.userId, userId))

    // Then set the selected address as default
    await db
      .update(address)
      .set({
        isDefault: true,
        updatedAt: new Date(),
      })
      .where(eq(address.id, addressId))

    // Revalidate the path to update UI
    revalidatePath("/profile/my-addresses")

    return {
      success: true,
      message: "Address set as default successfully",
    }
  } catch (error) {
    console.error("Error setting default address:", error)
    return {
      success: false,
      error: "Failed to set default address",
    }
  }
}
