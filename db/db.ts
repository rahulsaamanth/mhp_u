import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless" // Note: using neon-serverless, not neon-http
import * as schema from "@rahulsaamanth/mhp-schema"

let pool: Pool
try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })
  console.log("Database pool initialized successfully")
} catch (error) {
  console.error("Failed to initialize database pool:", error)
  throw new Error("Database connection failed")
}

export const db = drizzle(pool, { schema })
export { pool }

export async function executeRawQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  const client = await pool.connect()
  try {
    const result = await client.query(query, params)
    return result.rows as T[]
  } finally {
    client.release()
  }
}
