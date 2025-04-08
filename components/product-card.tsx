import { discountType } from "@rahulsaamanth/mhp-schema"

export interface ProductCardProps {
  id: string
  name: string
  form: string
  sales: string
  image: string[]
  mrp: number
  sellingPrice: number
  discountType: (typeof discountType.enumValues)[number]
  discount: number
  potencies: string[]
}

export default function ProductCard({
  product,
}: {
  product: ProductCardProps
}) {
  const {
    id,
    name,
    form,
    sales,
    image,
    mrp,
    sellingPrice,
    discountType,
    discount,
    potencies,
  } = product

  return (
    <div className="border-2 border-solid border-brand/30 hover:border-dashed hover:border-brand transition-all duration-500 size-fit p-20">
      <div className="flex items-center justify-center">
        <img
          src={image[0] || ""}
          alt={name}
          className="rounded-lg shadow-lg"
          width={200}
          height={200}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-500">Form: {form}</p>
        {potencies && (
          <div className="text-sm text-gray-500">
            Potency:{" "}
            {potencies.map((dosage, idx) => (
              <span className="p-1 bg-brand" key={idx}>
                {dosage}
              </span>
            ))}
          </div>
        )}
        <p>
          <span className="line-through">{mrp}</span>{" "}
          <span>{sellingPrice}</span>
        </p>
      </div>
    </div>
  )
}
