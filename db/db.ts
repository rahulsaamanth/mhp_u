import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { Pool } from "@neondatabase/serverless"
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

const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(sql, { schema })

export { sql, pool }

// // Add this to your db.ts file
// const cleanup = async () => {
//   await pool.end()
//   console.log("Connection pool closed")
// }

// // Only run on server side
// if (typeof window === "undefined") {
//   // For normal Node.js shutdowns (Ctrl+C)
//   process.on("SIGINT", cleanup)

//   // For production deployments (cloud platform sending termination signal)
//   process.on("SIGTERM", cleanup)

//   // For natural process completion
//   process.on("beforeExit", cleanup)
// }
