import * as z from "zod"

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is requried",
  }),
})

export const ENTITY_PREFIX = "mhp"

export const addressSchema = z.object({
  street: z
    .string()
    .min(5, "Street address is required and must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().regex(/^\d{6}$/, "PIN code must be 6 digits"),
  country: z.string().default("India"),
  type: z.enum(["SHIPPING"]).default("SHIPPING"),
  isDefault: z.boolean().optional().default(false),
})

export type AddressFormValues = z.infer<typeof addressSchema>
