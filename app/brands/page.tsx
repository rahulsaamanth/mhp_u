import { executeRawQuery } from "@/db/db"
import Link from "next/link"

interface Manufacturer {
  id: string
  name: string
  logo?: string | null
}

async function getManufacturers(): Promise<Manufacturer[]> {
  const manufacturers = await executeRawQuery<Manufacturer>(
    `
    SELECT id, name
    FROM "Manufacturer"
    ORDER BY name ASC
    `
  )

  return manufacturers
}

export default async function BrandsPage() {
  const manufacturers = await getManufacturers()

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center text-sm text-gray-500">
        <Link
          href="/"
          className="hover:text-brand underline decoration-gray-300 hover:decoration-brand"
        >
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-brand">Brands</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Our Brands
      </h1>

      <div className="max-w-4xl mx-auto">
        <ul className="list-none divide-y divide-gray-200">
          {manufacturers.map((manufacturer) => (
            <li key={manufacturer.id} className="py-3">
              <Link
                href={`/products/all?manufacturer=${encodeURIComponent(
                  manufacturer.name
                )}`}
                className="flex items-center text-lg hover:text-brand transition-colors duration-200 underline decoration-gray-300 hover:decoration-brand"
              >
                <span className="mr-2">•</span>
                {manufacturer.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
