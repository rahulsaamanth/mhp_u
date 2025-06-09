"use server"

import { db } from "@/db/db"
import { generateId } from "@/lib/generate-id"
import { currentUser } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { subscriber } from "@rahulsaamanth/mhp-schema"

// Type for the subscriber model
export interface Subscriber {
  id: string
  email: string
  isActive: boolean
  createdAt: Date
  userId?: string | null
}

/**
 * Subscribe to newsletter
 * This function takes an email address and subscribes it to the newsletter
 * If the user is logged in, it associates the subscription with their account
 */
export async function subscribeToNewsletter(formData: FormData) {
  try {
    const email = formData.get("email")

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return { success: false, error: "Invalid email address" }
    }

    // Check if the email is already subscribed
    const existingSubscriber = await db.query.subscriber.findFirst({
      where: eq(subscriber.email, email),
    })

    if (existingSubscriber) {
      return { success: false, error: "This email is already subscribed" }
    }

    await db.insert(subscriber).values({
      email: email,
      isActive: true,
    })

    return {
      success: true,
      message: "Successfully subscribed to our newsletter!",
    }
  } catch (error) {
    console.error("Failed to subscribe to newsletter:", error)
    return {
      success: false,
      error: "Failed to subscribe. Please try again later.",
    }
  }
}
