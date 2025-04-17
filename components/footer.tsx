"use client"

import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Mail, Phone, Clock, MapPin } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-brand text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info & Location */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Homeo South</h3>
            <div className="flex items-start space-x-2 mb-3">
              <MapPin className="w-5 h-5 mt-1" />
              <p className="text-sm">
                1st floor, serrao bhavan,
                <br />
                old road,mangalore,
                <br /> 575002
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <Link
                  href="tel:+919980555914"
                  className="text-sm relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300 active:text-white/70 active:scale-95"
                >
                  +91 99805 55914
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <Link
                  href="mailto:info@homeosouth.com"
                  className="text-sm relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300 active:text-white/70 active:scale-95"
                >
                  info@homeosouth.com
                </Link>
              </div>
            </div>
          </div>

          {/* Pharmacy Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pharmacy Hours</h3>
            <div className="flex items-start space-x-2">
              <Clock className="w-5 h-5 mt-1" />
              <div className="text-sm">
                <p className="mb-2">Monday - Saturday</p>
                <p>9:00 AM - 8:00 PM</p>
                <p className="mt-2">Sunday</p>
                <p>10:00 AM - 2:00 PM</p>
              </div>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for updates and health tips.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 placeholder:text-white/60 focus-visible:outline-0 focus-visible:border-0 focus-visible:ring-0"
              />
              <Button className="w-full bg-white text-brand hover:bg-white/90 transition-all duration-150 active:scale-95">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Quick Links */}
        <div className="border-t border-white/20 pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h4 className="font-semibold mb-3">Homeoapthy</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/products/homeopathy/dilutions"
                    className="transition-all duration-200 active:scale-95 active:text-gray-400 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    dilutions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/homeopathy/mother-tinctures"
                    className="transition-all duration-200 active:scale-95 active:text-gray-400 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    Mother Tinctures
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/homeopathy/biochemics"
                    className="transition-all duration-200 active:scale-95 active:text-gray-400 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    Biochemics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/homeopathy/bio-combinations"
                    className="transition-all duration-200 active:scale-95 active:text-gray-400 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    Bio Combinations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Other Products</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/products/personal-care"
                    className="transition-all duration-200 active:scale-95 active:text-gray-400 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    Personal Care
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/herbals"
                    className="transition-all duration-200 active:scale-95 active:text-gray-400 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    Herbals
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/ointments"
                    className="transition-all duration-200 active:scale-95 active:text-gray-400 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    Ointments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/eye-ear-drops"
                    className="transition-all duration-200 active:scale-95 active:text-gray-400 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    Eye & Ear Drops
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/faqs"
                    className="transition-all duration-200 active:scale-95 active:text-gray-400 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping-policy"
                    className="transition-all duration-200 active:scale-95 active:text-gray-400 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/return-policy"
                    className="transition-all duration-200 active:scale-95 active:text-gray-400 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    Return Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="transition-all duration-200 active:scale-95 active:text-gray-400 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about-homeopathy"
                    className="transition-all duration-200 active:scale-95 active:text-gray-400 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/team"
                    className="transition-all duration-200 active:scale-95 active:text-gray-400 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="transition-all duration-200 active:scale-95 active:text-gray-400 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="transition-all duration-200 active:scale-95 active:text-gray-400 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-300"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 text-center text-sm">
          <p>
            Copyright © {new Date().getFullYear()} Homeo South. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
