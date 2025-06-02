import React from "react"

const ShippingPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>

      <div className="bg-green-50 border-l-4 border-brand p-4 mb-6">
        <p className="text-sm">
          <span className="font-semibold">Note:</span> Mangalore Homeopathic
          Pharmacy is our registered business name. HomeoSouth is the digital
          brand representing our online presence.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Delivery Information</h2>

        <div className="space-y-4 mt-4">
          <div>
            <h3 className="text-xl font-semibold">
              1. Delivery and Risk Transfer
            </h3>
            <ul className="list-disc pl-8">
              <li>
                Risk of loss and title for products transfers to the customer
                when goods are delivered to the carrier
              </li>
              <li>
                Additional costs for re-delivery due to customer errors
                (incorrect name/address) will be charged to the customer
              </li>
              <li>
                Order cancellation requests will not be entertained once an
                order has been placed
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">2. Delivery Attempts</h3>
            <ul className="list-disc pl-8">
              <li>
                If the recipient is unavailable at the delivery address,
                products may be left with a neighbor along with a notification
                note
              </li>
              <li>
                If neighbors decline to accept the delivery, a message will be
                left requesting the recipient to contact our office
              </li>
              <li>
                Orders remain fully chargeable regardless of delivery outcome
              </li>
              <li>
                For courier/speed post/registered post deliveries, their
                respective delivery policies apply
              </li>
              <li>
                Mangalore Homeopathic Pharmacy (operating as HomeoSouth)
                reserves the right to charge for orders rejected by recipients
                for any reason
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">3. Delivery Timeframe</h3>
            <ul className="list-disc pl-8">
              <li>We strive to ensure prompt delivery of all orders</li>
              <li>
                Delayed or early deliveries, regardless of reason, do not
                entitle customers to damages or compensation
              </li>
              <li>
                Mangalore Homeopathic Pharmacy reserves the right to decline
                service to any customer without explanation
              </li>
              <li>
                Maximum delivery time will be 7 days from order confirmation
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">4. Address Information</h3>
            <ul className="list-disc pl-8">
              <li>
                Please provide accurate PIN codes and phone numbers to ensure
                timely delivery
              </li>
              <li>
                Shipping address changes must be requested via email before
                products have been dispatched from our warehouse
              </li>
              <li>
                Address change requests cannot be accommodated after order
                dispatch
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">Last Updated: May 2025</p>
          <p className="text-sm text-gray-600">
            For any questions regarding our shipping policy, please contact our
            customer service team.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ShippingPolicyPage
