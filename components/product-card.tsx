import { discountType } from "@rahulsaamanth/mhp-schema"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import Image from "next/image"
import Link from "next/link"

export interface ProductCardProps {
  id: string
  name: string
  manufacturer: string
  form: string
  unit: string
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
    manufacturer,
    form,
    unit,
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
    <Link
      href={`/product/${id}`}
      className="w-full p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-sm"
    >
      <Card className="group border-0 shadow-none w-full h-full py-0 cursor-pointer rounded-none active:scale-[0.98] transition-transform">
        <CardContent className="p-0">
          <div
            className="relative flex flex-col h-full outline outline-zinc-200  -outline-offset-1 p-2 hover:outline-0
            transition-all duration-200 before:content-[''] before:absolute before:inset-0  before:outline-brand before:outline-dashed before:outline-2 before:opacity-0 before:-outline-offset-1 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
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
              <Image
                src={image[0] || "/assets/hero1.jpg"}
                alt={name}
                width={500}
                height={500}
                className="w-full h-full object-contain rounded-lg p-4 my-2"
              />
            </div>
            <div className="flex flex-col p-4 flex-grow">
              <h3
                className={cn(
                  "font-bold text-center text-balance min-h-[4rem] max-h-[6rem] w-full overflow-hidden text-sm md:text-base transition-colors uppercase",
                  featured && "md:text-lg lg:text-xl xl:text-2xl"
                )}
              >
                <span
                  className="underline-animate w-auto inline-block text-center"
                  title={name}
                >
                  {`${manufacturer} ${name}`}
                </span>
              </h3>
              <p className="text-sm mb-1">{form}</p>
              <div className="py-2">
                {packSizes && packSizes.length > 0 && (
                  <p className="text-xs line-clamp-1 flex 2xl:gap-1 flex-wrap items-center">
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
                  <p className="text-xs line-clamp-1 flex 2xl:gap-1 flex-wrap items-center">
                    Potencies:{"   "}
                    {potencies.map((potency, index) => (
                      <span
                        key={index}
                        className="bg-blue-600 p-1 text-white font-semibold"
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
                {/* <AddToCartButton
                  productId={id}
                  variantId={variantId || ""}
                  name={name}
                  image={image[0]}
                  price={sellingPrice}
                  potency={potencies?.[0]}
                  packSize={packSizes?.[0]}
                /> */}
                <Button
                  variant="default"
                  className="rounded-none py-5 px-4 md:px-3 xl:px-4 bg-brand hover:bg-brand/90 text-white text-sm font-medium cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-brand/20 focus:ring-offset-2 active:scale-95 transition-transform"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
