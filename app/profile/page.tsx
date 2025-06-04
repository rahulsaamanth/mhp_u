import { redirect } from "next/navigation"

export default function ProfilePage() {
  // Redirect to the addresses page by default
  redirect("/profile/my-addresses")
}
