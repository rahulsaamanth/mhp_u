import { NextRequest } from "next/server"
import { auth } from "./auth"

export default async function middleware(request: NextRequest) {
  const session = await auth()

  console.log(session)
}
