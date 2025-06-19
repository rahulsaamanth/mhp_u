"use client"

import React from "react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const FAQPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>

      <div className="space-y-8 mb-8">
        <div className="bg-green-50 border-l-4 border-brand p-4 mb-6">
          <p className="text-sm">
            <span className="font-semibold">Important Note:</span> Mangalore
            Homoeopathic Pharmacy is our registered business name and physical
            store. HomeoSouth is the digital brand representing our online
            presence.
          </p>
        </div>

        <p className="mb-4">
          Welcome to our FAQ section. Here you'll find answers to the most
          common questions about our products, services, ordering process, and
          more. If you can't find what you're looking for, please don't hesitate
          to contact our customer support team.
        </p>
      </div>

      {/* General Questions */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">General Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="about-our-business">
            <AccordionTrigger className="text-lg">
              What is the relationship between Mangalore Homoeopathic Pharmacy
              and HomeoSouth?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Mangalore Homoeopathic Pharmacy is our registered business name
                and physical store located in Mangalore. HomeoSouth is the
                digital brand name representing our online presence at
                homeosouth.com. Both entities are the same business, with
                HomeoSouth being the consumer-facing digital brand of our
                established Mangalore Homoeopathic Pharmacy business.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="what-is-homeopathy">
            <AccordionTrigger className="text-lg">
              What is Homeopathy?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Homeopathy is a natural form of medicine used by over 200
                million people worldwide to treat both acute and chronic
                conditions. It is based on the principle of 'like cures like' –
                in other words, a substance that would cause symptoms in a
                healthy person is used to treat those same symptoms in illness.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="quality-standards">
            <AccordionTrigger className="text-lg">
              What quality standards do your products follow?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                All our homeopathic medicines are manufactured according to the
                principles of the Homeopathic Pharmacopoeia and comply with Good
                Manufacturing Practices (GMP). We ensure the highest quality in
                our products through rigorous testing and quality control
                processes.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="product-shelf-life">
            <AccordionTrigger className="text-lg">
              What is the shelf life of your products?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Most of our homeopathic medicines have a shelf life of 3-5 years
                from the date of manufacture when stored properly. The expiry
                date is clearly mentioned on the product packaging. We recommend
                storing the medicines in a cool, dry place away from direct
                sunlight and strong-smelling substances.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Order & Shipping */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Order & Shipping</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="order-tracking">
            <AccordionTrigger className="text-lg">
              How can I track my order?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Once your order is shipped, you will receive an email with a
                tracking number and link. You can use this tracking number to
                monitor the progress of your delivery. Alternatively, you can
                log in to your account on our website and check the status of
                your order in the "My Orders" section.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shipping-time">
            <AccordionTrigger className="text-lg">
              How long will it take to receive my order?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Standard shipping typically takes 3-5 business days for domestic
                orders. International shipping can take 7-14 business days
                depending on the destination country. Please note that these are
                estimates and actual delivery times may vary based on factors
                such as location, customs clearance, and local postal services.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shipping-areas">
            <AccordionTrigger className="text-lg">
              Do you ship to all areas?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                We currently ship across India and to select international
                destinations. Some remote areas might have restrictions or
                additional delivery time. During checkout, you can verify if we
                deliver to your location. If you face any issues, please contact
                our customer support for assistance.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="order-modification">
            <AccordionTrigger className="text-lg">
              Can I modify or cancel my order after placing it?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                You can modify or cancel your order within 2 hours of placing
                it, provided it hasn't been processed for shipping yet. To do
                so, please contact our customer support team immediately with
                your order details. Once an order has been processed or shipped,
                it cannot be modified or canceled.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Payment Related */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Payment Related</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="payment-methods">
            <AccordionTrigger className="text-lg">
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                We accept various payment methods including credit cards (Visa,
                MasterCard, American Express), debit cards, UPI, net banking,
                and popular digital wallets. All payments are processed securely
                through our payment gateway to ensure the safety of your
                financial information.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="payment-security">
            <AccordionTrigger className="text-lg">
              Is my payment information secure?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Yes, all payment transactions on our website are secure and
                encrypted. We use industry-standard SSL (Secure Socket Layer)
                encryption technology to protect your personal and financial
                information. We do not store your credit card details on our
                servers.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="payment-failed">
            <AccordionTrigger className="text-lg">
              What should I do if my payment fails?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                If your payment fails, please check if you have sufficient funds
                in your account and that your payment details are entered
                correctly. You can try again or use an alternative payment
                method. If the issue persists, please contact your bank or our
                customer support team for assistance.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Product Related */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Product Related</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="product-authenticity">
            <AccordionTrigger className="text-lg">
              How do I verify the authenticity of products?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                All our products come with authentication marks such as batch
                numbers, manufacturing dates, and expiry dates. You can verify
                the authenticity of our products by checking these details on
                the packaging. Additionally, we are an authorized retailer of
                all brands we sell, ensuring you receive genuine products.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="product-usage">
            <AccordionTrigger className="text-lg">
              How should I take homeopathic medicines?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Homeopathic medicines should typically be taken on a clean
                mouth, away from food, drinks, or strong flavors like mint
                (toothpaste), coffee, or spices. The dosage instructions are
                provided on the product packaging or as prescribed by your
                homeopathic practitioner. For detailed usage instructions for
                specific products, please refer to the product descriptions on
                our website or consult with a qualified homeopathic
                practitioner.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="product-side-effects">
            <AccordionTrigger className="text-lg">
              Do homeopathic medicines have side effects?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Homeopathic medicines are generally considered safe with minimal
                to no side effects when taken as directed. They are made from
                highly diluted natural substances. However, individual
                sensitivity may vary, and some people might experience a
                temporary worsening of symptoms (known as a homeopathic
                aggravation) before improvement. If you experience any
                concerning symptoms, please consult a healthcare professional.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Account Related */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Account Related</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="create-account">
            <AccordionTrigger className="text-lg">
              How do I create an account?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                To create an account, click on the "Sign Up" or "Register"
                button at the top of our website. Fill in the required
                information such as your name, email address, and password. Once
                you submit the registration form, you'll receive a verification
                email. Click on the verification link to activate your account.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="forgot-password">
            <AccordionTrigger className="text-lg">
              What if I forget my password?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                If you forget your password, click on the "Forgot Password" link
                on the login page. Enter your registered email address, and
                we'll send you a password reset link. Follow the instructions in
                the email to create a new password and regain access to your
                account.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="update-account">
            <AccordionTrigger className="text-lg">
              How can I update my account information?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                To update your account information, log in to your account and
                navigate to the "My Account" or "Profile" section. Here, you can
                edit your personal details, change your password, update your
                shipping address, and manage your communication preferences.
                Remember to save your changes before exiting the page.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="delete-account">
            <AccordionTrigger className="text-lg">
              How can I delete my account?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                If you wish to delete your account, please contact our customer
                support team with your request. Please note that deleting your
                account will remove all your personal information from our
                system and you will lose access to your order history and any
                other account-related data.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <p className="mb-2">
          Didn't find what you were looking for? Contact our customer support:
        </p>
        <p className="mb-1">
          <strong>Phone:</strong> +91 99805 55914
        </p>
        <p>
          <strong>Email:</strong> info@homeosouth.com
        </p>
        <p className="text-sm text-gray-600 mt-4">Last Updated: May 28, 2025</p>
      </div>
    </div>
  )
}

export default FAQPage
