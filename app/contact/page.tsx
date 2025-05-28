import React from "react"
import { Mail, Phone, Clock, MapPin } from "lucide-react"
import Link from "next/link"

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Address Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start mb-4">
            <MapPin className="w-6 h-6 text-brand mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Our Location</h2>
              <p className="text-gray-700">
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
              href="https://maps.google.com/?q=Homeo+South+Mangalore"
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

      {/* Contact Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-12">
        <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="Full Name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              placeholder="How can we help you?"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              placeholder="Your message..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-brand text-white font-medium rounded-md hover:bg-brand-dark transition-colors duration-300"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">
              How can I track my order?
            </h3>
            <p className="text-gray-700">
              Once your order is shipped, you will receive an email with
              tracking information. You can also track your order by logging
              into your account and visiting the order history section.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">
              Do you offer wholesale or bulk orders?
            </h3>
            <p className="text-gray-700">
              Yes, we offer special pricing for wholesale and bulk orders.
              Please contact us directly via email at info@homeosouth.com or
              call us at +91 99805 55914 for more information.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">
              What is your shipping policy?
            </h3>
            <p className="text-gray-700">
              We typically process orders within 1-2 business days. Delivery
              times vary depending on your location. You can read our full
              shipping policy{" "}
              <Link
                href="/shipping-policy"
                className="text-brand hover:underline"
              >
                here
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
