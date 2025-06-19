import React from "react"

const TermsAndConditionsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

      <div className="bg-green-50 border-l-4 border-brand p-4 mb-6">
        <p className="text-sm">
          <span className="font-semibold">Important:</span> "Mangalore
          Homoeopathic Pharmacy" is our registered business name. "HomeoSouth"
          is the digital brand representing our online presence at
          homeosouth.com.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">General Agreement</h2>
        <p>
          These Terms and Conditions govern the use of our website and the
          purchase of homeopathic products offered by Mangalore Homoeopathic
          Pharmacy, a business operating under the brand name{" "}
          <span className="uppercase bg-brand/10 p-1">HOMEOSOUTH</span> at
          homeosouth.com (hereinafter referred to as "we", "us", or "our").
        </p>

        <p>
          By accessing our website or placing an order through
          www.homeosouth.com, you ("Customer", "User", or "you") acknowledge
          that you have read, understood, and agree to be bound by these Terms
          and Conditions.
        </p>

        <p>
          HOMEOSOUTH reserves the right to share your information with relevant
          authorities or third parties when necessary to resolve disputes
          related to our services, in compliance with applicable laws.
        </p>

        <p>
          This document constitutes the complete agreement between HOMEOSOUTH
          and the Customer, superseding all previous communications whether
          electronic, verbal, or written.
        </p>

        <h2 className="text-2xl font-bold mt-8">
          Payment and Delivery Policies
        </h2>
        <h3 className="text-xl font-semibold mt-4">Cash on Delivery Service</h3>

        <div className="space-y-4 mt-4">
          <div>
            <h3 className="text-xl font-semibold">1. Service Availability</h3>
            <ul className="list-disc pl-8">
              <li>
                Cash on Delivery (COD) is available for orders valued above ₹500
              </li>
              <li>
                This service is subject to geographical limitations and delivery
                partner availability
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">2. Order Verification</h3>
            <ul className="list-disc pl-8">
              <li>
                HOMEOSOUTH may initiate a pre-delivery verification call to
                confirm order details
              </li>
              <li>
                Orders may be canceled if verification cannot be completed
                successfully
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">3. Payment Protocol</h3>
            <ul className="list-disc pl-8">
              <li>
                Full payment must be tendered to the delivery personnel upon
                receipt of products
              </li>
              <li>
                We recommend having the exact amount ready to facilitate smooth
                transactions
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">4. Delivery Process</h3>
            <ul className="list-disc pl-8">
              <li>
                Customers should thoroughly examine all products at the time of
                delivery
              </li>
              <li>
                Any damage or discrepancy must be immediately reported to both
                the delivery agent and our customer service team
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">
              5. Order Modifications and Cancellations
            </h3>
            <ul className="list-disc pl-8">
              <li>COD orders may be canceled at no charge prior to dispatch</li>
              <li>
                Cancellation requests received after dispatch cannot be
                accommodated
              </li>
              <li>
                If you are unavailable during delivery attempts, HOMEOSOUTH
                reserves the right to cancel the order after reasonable efforts
                to contact you
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">6. Additional Fees</h3>
            <ul className="list-disc pl-8">
              <li>
                Delivery charges and any applicable surcharges will be clearly
                communicated during checkout
              </li>
              <li>These charges may vary based on location and order value</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">
              7. Returns and Refund Process
            </h3>
            <ul className="list-disc pl-8">
              <li>COD purchases are eligible for our standard return policy</li>
              <li>
                Approved refunds for COD orders will be processed via bank
                transfer to your designated account
              </li>
              <li>
                Processing time for refunds is typically 5-7 business days after
                return approval
              </li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">Policy Amendments</h2>
        <p className="mt-2">
          HOMEOSOUTH maintains the right to modify these Terms and Conditions
          periodically. Any significant changes will be communicated through our
          website or via email to registered customers. Continued use of our
          services following such modifications constitutes acceptance of the
          updated terms.
        </p>
      </div>
    </div>
  )
}

export default TermsAndConditionsPage
