import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as _shcema from "@rahulsaamanth/mhp_shared-schema"

const connectionPool = postgres(process.env.DATABASE_URL!, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
})

export const db = drizzle(connectionPool, {
  schema: _shcema,
  // logger:true
})
