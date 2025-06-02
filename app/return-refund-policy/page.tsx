import React from "react"

const RefundPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Cancellation and Refund Policy
      </h1>

      <div className="bg-green-50 border-l-4 border-brand p-4 mb-6">
        <p className="text-sm">
          <span className="font-semibold">Note:</span> Mangalore Homeopathic
          Pharmacy is our registered business name. HomeoSouth is the digital
          brand representing our online presence.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
          <p className="font-semibold">Important Notice:</p>
          <p>
            Refund policy only applies to orders with a value above ₹1000 and on
            all wholesale/bulk orders.
          </p>
        </div>

        <h2 className="text-2xl font-bold">Cancellation Policy</h2>

        <div className="space-y-4 mt-4">
          <div>
            <h3 className="text-xl font-semibold">1. Order Cancellation</h3>
            <ul className="list-disc pl-8">
              <li>
                Customers can cancel an order within 24 hours from the time of
                order confirmation
              </li>
              <li>Orders that have already been shipped cannot be cancelled</li>
              <li>
                To cancel an order, please contact our customer service
                immediately
              </li>
              <li>
                For orders placed using online payment methods, refunds will be
                processed within 72 business hours after cancellation approval
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">2. Our Right to Cancel</h3>
            <ul className="list-disc pl-8">
              <li>
                Mangalore Homeopathic Pharmacy (operating as HomeoSouth)
                reserves the right to cancel any order without assigning any
                reason or ground
              </li>
              <li>
                In such cases, any amount collected will be refunded within 72
                business hours
              </li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">Return & Refund Policy</h2>

        <div className="space-y-4 mt-4">
          <div>
            <h3 className="text-xl font-semibold">1. Valid Return Reasons</h3>
            <p className="mb-2">
              Products may be returned if a complaint is raised with customer
              care within 24 hours of receipt for the following reasons:
            </p>
            <ul className="list-disc pl-8">
              <li>
                Product(s) delivered were defective or damaged (will not be
                accepted if it has a tampered seal)
              </li>
              <li>Product(s) delivered are past their expiration date</li>
              <li>Product(s) delivered do not match your order</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">2. Return Process</h3>
            <ul className="list-disc pl-8">
              <li>
                When returning products, please quote your order number, name,
                product name, and reason for return
              </li>
              <li>
                Our customer care team will verify the claim within 72 business
                hours from receipt of complaint
              </li>
              <li>
                Once verified as genuine, we will either replace the product(s)
                or refund the amount at our discretion
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">3. Refund Processing</h3>
            <ul className="list-disc pl-8">
              <li>
                For orders cancelled within 24 hours of order confirmation,
                refunds will be processed within 72 business hours
              </li>
              <li>
                For orders that could not be executed, collected amounts will be
                refunded within 72 business hours from order cancellation
                confirmation
              </li>
              <li>
                Refunds will be processed via the original payment method or
                another mode as deemed appropriate by HOMEOSOUTH
              </li>
              <li>
                For order values above ₹1000 and wholesale/bulk orders, refund
                processing time may vary based on payment method and banking
                processes
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">4. Non-Returnable Cases</h3>
            <p className="mb-2">
              Returns will not be accepted in the following cases:
            </p>
            <ul className="list-disc pl-8">
              <li>Used products</li>
              <li>
                Return request made outside the specified 24-hour timeframe
              </li>
              <li>
                Products with tampered or missing serial numbers, including
                price tags and labels
              </li>
              <li>Products ordered incorrectly by customer</li>
              <li>
                Products where the batch number doesn't match as mentioned on
                the invoice
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-md">
          <p className="mb-2">
            For any defect or complaints, please contact us at:
          </p>
          <p className="mb-1">
            <strong>Phone:</strong> +91 99805 55914
          </p>
          <p>
            <strong>Email:</strong> info@homeosouth.com
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Last Updated: May 28, 2025
          </p>
        </div>
      </div>
    </div>
  )
}

export default RefundPolicyPage
