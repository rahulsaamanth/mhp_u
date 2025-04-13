"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { CartItem } from "@/store/cart"
import { CouponData, CheckoutFormData, processCheckout } from "../_lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { cartEvents } from "@/lib/cart-events"

interface CheckoutFormProps {
  cartItems: CartItem[]
  appliedCoupon: CouponData | null
}

export default function CheckoutForm({
  cartItems,
  appliedCoupon,
}: CheckoutFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    defaultValues: {
      paymentMethod: "cod",
    },
  })

  const paymentMethod = watch("paymentMethod")

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true)

    try {
      const result = await processCheckout(cartItems, data, appliedCoupon)

      if (result.success) {
        // Clear cart from local state
        cartEvents.notifyCartChanged()

        // Show success message
        toast.success(result.message)

        // Redirect to success page (would use a proper order confirmation page in production)
        router.push(`/?orderSuccess=true&orderId=${result.orderId}`)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("An unexpected error occurred during checkout")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4">
        <h2 className="text-xl font-medium">Shipping Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              {...register("fullName", { required: "Full name is required" })}
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email",
                },
              })}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="9876543210"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit phone number",
              },
            })}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="123 Main St"
            {...register("address", { required: "Address is required" })}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Mumbai"
              {...register("city", { required: "City is required" })}
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              placeholder="Maharashtra"
              {...register("state", { required: "State is required" })}
              className={errors.state ? "border-red-500" : ""}
            />
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">PIN Code</Label>
            <Input
              id="pincode"
              placeholder="400001"
              {...register("pincode", {
                required: "PIN code is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Please enter a valid 6-digit PIN code",
                },
              })}
              className={errors.pincode ? "border-red-500" : ""}
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm">{errors.pincode.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-medium mb-4">Payment Method</h2>

        <RadioGroup
          defaultValue="cod"
          {...register("paymentMethod", { required: true })}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border p-4 rounded-md">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod" className="flex-grow cursor-pointer">
              <div className="font-medium">Cash on Delivery</div>
              <div className="text-sm text-gray-500">
                Pay when your order arrives
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2 border p-4 rounded-md">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online" className="flex-grow cursor-pointer">
              <div className="font-medium">Online Payment</div>
              <div className="text-sm text-gray-500">
                Credit/Debit card, UPI, Net Banking
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={isProcessing}>
          {isProcessing
            ? "Processing..."
            : paymentMethod === "cod"
            ? "Place Order"
            : "Proceed to Payment"}
        </Button>
      </div>
    </form>
  )
}
