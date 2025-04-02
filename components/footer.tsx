import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-brand border-t w-full h-[768px]">
      {/* Bottom Bar */}
      <div className="border-t py-2 md:py-6 text-center">
        Copyright © {new Date().getFullYear()} Homeo South. All rights reserved.
      </div>
    </footer>
  )
}
