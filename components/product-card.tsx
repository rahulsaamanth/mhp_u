import { discountType } from "@rahulsaamanth/mhp-schema"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import Link from "next/link"
import FallbackImage from "./ui/fallback-image"

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
      className="w-full h-fit p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-sm"
    >
      <Card className="group w-full h-fit flex flex-col cursor-pointer rounded-none active:scale-[0.98] outline-1 outline-primary-foreground border-transparent hover:border-brand focus:border-brand active:border-brand border-2 hover:border-dashed focus:border-dashed active:border-dashed -outline-offset-2 ring-1 ring-stone-200 hover:ring-0 focus:ring-0 active:ring-0 transition-all duration-300 ease-out shadow-md hover:shadow-none focus:shadow-none active:shadow-none">
        <CardContent className="p-0 flex flex-col">
          <div className="relative flex flex-col">
            {discount > 0 && (
              <div className="absolute top-2 right-2 z-10 bg-brand/20 text-brand text-xs p-2 rounded-full font-semibold">
                -{discountPercentage}%
              </div>
            )}
            <div
              className={cn(
                "w-full overflow-hidden flex-shrink-0",
                featured ? "h-[240px] md:h-[360px] 2xl:h-[540px]" : "h-48"
              )}
            >
              <FallbackImage
                src={image && image.length > 0 ? image[0] : "/placeholder.png"}
                fallbackSrc="/placeholder.png"
                alt={name}
                width={500}
                height={500}
                className="w-full h-full object-contain rounded-lg p-4 my-2 group-hover:scale-105 transition-all duration-400 ease-out"
                unoptimized={true}
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
                  className="underline-animate w-auto inline-block text-center group-active:after:w-full 
          group-focus:after:w-full md:group-hover:after:w-full"
                  title={name}
                >
                  {`${name}`}
                </span>
              </h3>
              <p className="text-sm mb-1">{form}</p>

              {/* Pack sizes - show as many as fit and then ellipses */}
              <div className="min-h-[1.75rem] overflow-hidden">
                {packSizes && packSizes.length > 0 && (
                  <p className="text-xs">
                    PackSize:{" "}
                    <span className="inline-flex flex-wrap items-center gap-1">
                      {packSizes.slice(0, 3).map((size, index) => (
                        <span
                          key={index}
                          className="bg-blue-600 p-1 text-white font-semibold"
                        >
                          {size}
                          {" " +
                            unit.replace("(s)", "").replace("TABLETS", "PILLS")}
                        </span>
                      ))}
                      {packSizes.length > 3 && (
                        <span className="font-semibold text-gray-500 whitespace-nowrap">
                          +{packSizes.length - 3} more
                        </span>
                      )}
                    </span>
                  </p>
                )}
              </div>

              {/* Potencies - show as many as fit and then ellipses */}
              <div className="min-h-[1.75rem] mb-1 overflow-hidden">
                {potencies && potencies.length > 0 && (
                  <p className="text-xs">
                    Potencies:{" "}
                    <span className="inline-flex flex-wrap items-center gap-1">
                      {potencies.slice(0, 3).map((potency, index) => (
                        <span
                          key={index}
                          className="bg-blue-600 p-1 text-white font-semibold"
                        >
                          {potency}
                        </span>
                      ))}
                      {potencies.length > 3 && (
                        <span className="font-semibold text-gray-500 whitespace-nowrap">
                          +{potencies.length - 3} more
                        </span>
                      )}
                    </span>
                  </p>
                )}
              </div>

              <div className="mb-4 pt-2">
                <p
                  className={cn(
                    "font-semibold space-x-3 flex items-end",
                    featured && "lg:text-3xl"
                  )}
                >
                  {discount > 0 && (
                    <span className="text-sm text-gray-500 line-through font-sans">
                      ₹{mrp}
                    </span>
                  )}
                  <span className="text-xl text-brand-foreground font-bold font-sans">
                    ₹{sellingPrice}
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-auto">
                <Button
                  variant="default"
                  className="rounded-none py-5 px-4 md:px-3 xl:px-4 bg-brand hover:bg-brand/90 focus:bg-brand/90 active:bg-brand/80 text-white text-sm font-medium cursor-pointer
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
