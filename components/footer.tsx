"use client"

import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Mail, Phone, Clock, MapPin } from "lucide-react"

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
                <a href="tel:+919876543210" className="text-sm hover:underline">
                  +91 99805 55914
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <a
                  href="mailto:info@homeosouth.com"
                  className="text-sm hover:underline"
                >
                  info@homeosouth.com
                </a>
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
              <Button className="w-full bg-white text-brand hover:bg-white/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Quick Links */}
        <div className="border-t border-white/20 pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h4 className="font-semibold mb-3">Products</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:underline">
                    Homeopathic Medicines
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Health Supplements
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Mother Tinctures
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Bio Combinations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:underline">
                    Online Consultation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Medicine Delivery
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Health Packages
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Lab Tests
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:underline">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Return Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Contact
                  </a>
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
