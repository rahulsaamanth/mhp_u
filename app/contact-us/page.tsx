import { Mail, Phone, Clock, MapPin } from "lucide-react"
import Link from "next/link"

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <div className="bg-green-50 border-l-4 border-brand p-4 mb-6">
        <p className="text-sm">
          <span className="font-semibold">Important Note:</span> Mangalore
          Homeopathic Pharmacy is our registered business name and physical
          store. HomeoSouth is the digital brand representing our online
          presence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Address Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start mb-4">
            <MapPin className="w-6 h-6 text-brand mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Our Location</h2>
              <p className="text-gray-700">
                Mangalore Homeopathic Pharmacy,
                <br />
                1st floor, Serrao Bhavan,
                <br />
                Old Road, Mangalore,
                <br />
                Karnataka - 575002
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href="https://maps.app.goo.gl/WbMhQWfeUo8X72G26"
              target="_blank"
              className="inline-block text-brand hover:underline"
            >
              View on Google Maps
            </Link>
          </div>
        </div>
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start mb-6">
            <Phone className="w-6 h-6 text-brand mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Phone</h2>
              <Link
                href="tel:+919980555914"
                className="text-gray-700 hover:text-brand transition-colors"
              >
                +91 99805 55914
              </Link>
            </div>
          </div>

          <div className="flex items-start">
            <Mail className="w-6 h-6 text-brand mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Email</h2>
              <Link
                href="mailto:info@homeosouth.com"
                className="text-gray-700 hover:text-brand transition-colors"
              >
                info@homeosouth.com
              </Link>
              <p className="text-xs text-gray-500 mt-1">
                (Digital brand of Mangalore Homeopathic Pharmacy)
              </p>
            </div>
          </div>
        </div>
        {/* Business Hours */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start">
            <Clock className="w-6 h-6 text-brand mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Business Hours</h2>
              <div className="text-gray-700">
                <div className="mb-2">
                  <p className="font-medium">Monday - Saturday:</p>
                  <p>9:00 AM - 8:00 PM</p>
                </div>
                <div>
                  <p className="font-medium">Sunday:</p>
                  <p>10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
