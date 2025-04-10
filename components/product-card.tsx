import { discountType } from "@rahulsaamanth/mhp-schema"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardTitle } from "./ui/card"
import { ShoppingBag } from "lucide-react"
import { Button } from "./ui/button"

export interface ProductCardProps {
  id: string
  name: string
  form: string
  unit: string
  sales: string
  image: string[]
  mrp: number
  sellingPrice: number
  discountType: (typeof discountType.enumValues)[number]
  discount: number
  potencies: string[]
  packSizes: string[]
}

export default function ProductCard({
  product,
  featured = false,
}: {
  product: ProductCardProps
  featured?: boolean
}) {
  const {
    id,
    name,
    form,
    unit,
    sales,
    image,
    mrp,
    sellingPrice,
    discountType,
    discount,
    potencies,
    packSizes,
  } = product

  const discountPercentage =
    discountType === "PERCENTAGE"
      ? discount
      : Math.round(((mrp - sellingPrice) / mrp) * 100)

  return (
    <Card className="group border-0 shadow-none w-full h-full py-0 cursor-pointer rounded-none">
      <CardContent className="p-0">
        <div
          className="relative flex flex-col h-full outline outline-zinc-200  -outline-offset-1 p-2 hover:outline-0
          transition-all duration-200 before:content-[''] before:absolute before:inset-0  before:outline-brand before:outline-dashed before:outline-2 before:opacity-0 before:-outline-offset-1 hover:before:opacity-100 before:transition-opacity before:duration-500"
        >
          {discount > 0 && (
            <div className="absolute top-2 right-2 z-10 bg-brand/20 text-brand text-xs p-2 rounded-full font-semibold">
              -{discountPercentage}%
            </div>
          )}

          <div
            className={cn(
              "w-full overflow-hidden",
              featured ? "h-full" : "h-48"
            )}
          >
            <img
              src={image[0]}
              alt={name}
              className="w-full h-full object-contain rounded-lg p-4"
            />
          </div>

          <div className="flex flex-col p-4 flex-grow">
            <h3
              className={cn(
                "font-semibold line-clamp-2 h-24  text-center text-base md:text-lg transition-colors py-3 uppercase text-balance",
                featured && "md:text-2xl"
              )}
            >
              <span className="underline-animate w-auto inline-block text-balance">
                {name}
              </span>
            </h3>
            <p className="text-sm mb-1">{form}</p>

            <div className="min-h-[1.5rem]">
              {packSizes && packSizes.length > 0 && (
                <p className="text-sm  line-clamp-1 space-x-2">
                  PackSize:{"   "}
                  {packSizes.map((size, index) => (
                    <span
                      key={index}
                      className="bg-blue-600 p-1 text-white font-semibold"
                    >
                      {size}
                      {" " +
                        unit.replace("(s)", "").replace("TABLETS", "PILLS")}
                    </span>
                  ))}
                </p>
              )}
            </div>

            <div className="min-h-[1.5rem]">
              {potencies && potencies.length > 0 && (
                <p className="text-sm  line-clamp-1 space-x-2">
                  Potencies:{"   "}
                  {potencies.map((potency, index) => (
                    <span
                      key={index}
                      className="bg-blue-600 p-2 text-white font-semibold"
                    >
                      {potency}
                    </span>
                  ))}
                </p>
              )}
            </div>

            <div className="mb-4 pt-2">
              <p
                className={cn(
                  "text-2xl font-semibold space-x-3",
                  featured && "text-5xl"
                )}
              >
                {discount > 0 && (
                  <span className="text-base text-gray-500 line-through">
                    ₹{mrp}
                  </span>
                )}
                <span className="text-brand">₹{sellingPrice}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-auto">
              <Button
                variant="default"
                className="rounded-none py-5 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 bg-zinc-300/50 hover:bg-zinc-300 text-black cursor-pointer"
              >
                <ShoppingBag className="size-4" /> <span>Add to Cart</span>
              </Button>
              <Button
                variant="default"
                className="rounded-none py-5 px-4 bg-brand hover:bg-brand/90 text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
