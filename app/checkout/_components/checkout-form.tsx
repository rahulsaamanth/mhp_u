"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { CartItem } from "@/store/cart"
import { CouponData, CheckoutFormData, processCheckout } from "../_lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { cartEvents } from "@/lib/cart-events"
import { formatCurrency } from "@/lib/formatters"
import { useRazorpay } from "./razorpay-provider"

interface CheckoutFormProps {
  cartItems: CartItem[]
  appliedCoupon: CouponData | null
}

export default function CheckoutForm({
  cartItems,
  appliedCoupon,
}: CheckoutFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formData, setFormData] = useState<CheckoutFormData | null>(null)
  const { isRazorpayLoaded } = useRazorpay()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    defaultValues: {
      paymentMethod: "COD",
    },
  })

  const paymentMethod = watch("paymentMethod")

  const handleFormSubmit = (data: CheckoutFormData) => {
    if (data.paymentMethod === "ONLINE" && !isRazorpayLoaded) {
      toast.error(
        "Payment gateway is still loading. Please try again in a moment."
      )
      return
    }
    setFormData(data)
    setShowConfirmation(true)
  }

  const handleRazorpayPayment = async (
    orderId: string,
    amount: number,
    razorpayOrderId: string
  ) => {
    if (!isRazorpayLoaded || !(window as any).Razorpay) {
      toast.error("Payment gateway is not ready. Please try again.")
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      name: "HOMEOSOUTH",
      description: "Payment for your order",
      image: "/the_logo1.png",
      order_id: razorpayOrderId,
      handler: async (response: any) => {
        try {
          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          const verifyData = await verifyResponse.json()

          if (verifyData.success) {
            cartEvents.notifyCartChanged()
            toast.success("Payment successful!")
            router.push(`/order-confirmation/${orderId}`)
          } else {
            toast.error("Payment verification failed. Please contact support.")
          }
        } catch (error) {
          console.error("Payment verification failed:", error)
          toast.error("Payment verification failed. Please try again.")
        }
      },
      prefill: {
        name: formData?.fullName || "",
        email: formData?.email || "",
        contact: formData?.phone || "",
      },
      notes: {
        address: `${formData?.address}, ${formData?.city}, ${formData?.state} - ${formData?.pincode}`,
      },
      theme: {
        color: "#16a34a",
      },
      modal: {
        confirm_close: true,
        escape: false,
      },
    }

    try {
      const razorpay = new (window as any).Razorpay(options)
      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error)
        toast.error("Payment failed. Please try again.")
      })
      razorpay.open()
    } catch (error) {
      console.error("Failed to initialize Razorpay:", error)
      toast.error("Failed to initialize payment. Please try again.")
    }
  }

  const processOrder = async () => {
    if (!formData) return

    if (formData.paymentMethod === "ONLINE" && !isRazorpayLoaded) {
      toast.error("Payment gateway is not ready. Please try again.")
      return
    }

    setIsProcessing(true)
    setShowConfirmation(false)

    try {
      const result = await processCheckout(cartItems, formData, appliedCoupon)

      if (result.success) {
        if (formData.paymentMethod === "COD") {
          cartEvents.notifyCartChanged()
          toast.success(result.message)
          router.push(`/order-confirmation/${result.orderId}`)
        } else if (
          formData.paymentMethod === "ONLINE" &&
          result.razorpayOrderId
        ) {
          await handleRazorpayPayment(
            result.orderId!,
            result.amount,
            result.razorpayOrderId
          )
        }
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
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
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
            defaultValue="COD"
            value={watch("paymentMethod")}
            onValueChange={(value) => {
              const event = {
                target: {
                  name: "paymentMethod",
                  value: value,
                },
              }
              register("paymentMethod").onChange(event)
            }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 border p-4 rounded-md">
              <RadioGroupItem value="COD" id="cod" />
              <Label htmlFor="cod" className="flex-grow cursor-pointer">
                <div className="font-medium">Cash on Delivery</div>
                <div className="text-sm text-gray-500">
                  Pay when your order arrives
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border p-4 rounded-md">
              <RadioGroupItem value="ONLINE" id="online" />
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
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isProcessing}
          >
            {isProcessing
              ? "Processing..."
              : paymentMethod === "COD"
              ? "Place Order"
              : "Proceed to Payment"}
          </Button>
        </div>
      </form>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Order</DialogTitle>
            <DialogDescription>
              Please review your order details before confirming.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm space-y-2">
              <p>
                <strong>Delivery Address:</strong>
              </p>
              <p>{formData?.fullName}</p>
              <p>{formData?.address}</p>
              <p>
                {formData?.city}, {formData?.state} - {formData?.pincode}
              </p>
              <p>Phone: {formData?.phone}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm mb-2">
                <strong>Order Summary:</strong>
              </p>
              <div className="space-y-1 text-sm">
                <p>
                  Items ({cartItems.length}):{" "}
                  {formatCurrency(
                    cartItems.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )
                  )}
                </p>
                {appliedCoupon && (
                  <p className="text-green-600">
                    Discount: -{formatCurrency(appliedCoupon.discountAmount)}
                  </p>
                )}
                <p>Shipping: {formatCurrency(50)}</p>
                <p className="font-medium pt-2 border-t">
                  Total:{" "}
                  {formatCurrency(
                    cartItems.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    ) +
                      50 -
                      (appliedCoupon?.discountAmount || 0)
                  )}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              className="cursor-pointer"
            >
              Edit Order
            </Button>
            <Button
              onClick={processOrder}
              disabled={isProcessing}
              className="cursor-pointer"
            >
              {isProcessing ? "Processing..." : "Confirm Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
