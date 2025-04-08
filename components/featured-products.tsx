import { db } from "@/db/db"
import { product, type Variant } from "@rahulsaamanth/mhp-schema"
import { and, eq, ilike } from "drizzle-orm"
import { ProductCard, type ProductVariant } from "./product-card"

export default async function FeaturedProducts() {
  const products = await db.query.product.findMany({
    where: and(ilike(product.name, "%allen%"), eq(product.form, "TABLETS")),
    columns: {
      id: true,
      name: true,
      form: true,
    },
    with: {
      variants: {
        columns: {
          variantImage: true,
          id: true,
          packSize: true,
          potency: true,
          mrp: true,
          sellingPrice: true,
          discount: true,
          discountType: true,
        },
      },
    },
  })

  return (
    <div>
      Featured Products
      {/* <ProductCard
        key={_product.id}
        id={_product.id}
        name={_product.name}
        form={_product.form}
        variants={_product.variants as unknown as ProductVariant[]}
      /> */}
    </div>
  )
}
