// "use server"

// import { db } from "@/db/db"

// export async function getPopularProducts() {
//     try{
//        const products = await db.query.product.findMany({
//            where: and(ilike(product.name, "%allen%"), eq(product.form, "TABLETS")),
//            columns: {
//              id: true,
//              name: true,
//              form: true,
//            },
//            with: {
//              variants: {
//                columns: {
//                  variantImage: true,
//                  id: true,
//                  packSize: true,
//                  potency: true,
//                  mrp: true,
//                  sellingPrice: true,
//                  discount: true,
//                  discountType: true,
//                },
//              },
//            },
//          })
//     }catch(error){
//         console.error(error)
//         return {
//             data: null,
//             sucess: false
//         }
//     }
// }
