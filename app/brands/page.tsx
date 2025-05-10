import { executeRawQuery } from "@/db/db"
import { Card } from "@/components/ui/card"
import Image from "next/image"
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

  const defaultLogo = "/assets/default-brand-logo.png"

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center text-sm text-gray-500">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-brand">Brands</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Our Brands
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {manufacturers.map((manufacturer) => (
          <Link
            key={manufacturer.id}
            href={`/products/all?manufacturer=${encodeURIComponent(
              manufacturer.name
            )}`}
            className="block transition-transform hover:scale-105"
          >
            <Card className="overflow-hidden h-full border border-gray-200 hover:border-brand hover:shadow-md transition-all duration-300">
              <div className="p-6 flex flex-col items-center justify-center h-full">
                <div className="w-full aspect-square relative mb-4 flex items-center justify-center">
                  {manufacturer.logo ? (
                    <Image
                      src={manufacturer.logo || "assets/hero1.webp"}
                      alt={manufacturer.name}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
                      <span className="text-4xl font-bold text-gray-300">
                        {manufacturer.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-center font-semibold text-lg">
                  {manufacturer.name}
                </h3>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
