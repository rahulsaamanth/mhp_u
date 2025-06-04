import * as z from "zod"

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is requried",
  }),
})

// Export other schemas
export * from "./address"

// Use the same prefix as in the server actions
export const ENTITY_PREFIX = "mhp"
