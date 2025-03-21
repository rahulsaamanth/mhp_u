import { db } from "@/db/db"

export default async function Home() {
  const data = await db.query.product.findMany()
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      testing: {JSON.stringify(data)}
    </main>
  )
}
