import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping Policy — River Electronics",
  description:
    "Learn about River Electronics' shipping zones, delivery times, and fees across Bangladesh.",
};

const ZONES = [
  {
    zone: "Dhaka Metro",
    delivery: "1–2 Business Days",
    fee: "Free on orders ৳5,000+",
    flatFee: "৳60",
  },
  {
    zone: "Chittagong, Sylhet, Rajshahi",
    delivery: "2–3 Business Days",
    fee: "৳120",
    flatFee: "৳120",
  },
  {
    zone: "Other Districts",
    delivery: "3–5 Business Days",
    fee: "৳150",
    flatFee: "৳150",
  },
  {
    zone: "Remote Areas",
    delivery: "5–7 Business Days",
    fee: "৳200+",
    flatFee: "৳200+",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Order Confirmed",
    description: "You receive an SMS & email confirmation immediately after placing your order.",
  },
  {
    step: "2",
    title: "Processing",
    description: "Our team verifies your order and prepares it for dispatch within 24 hours.",
  },
  {
    step: "3",
    title: "Dispatched",
    description: "Your order is handed to our delivery partner. You receive a tracking number via SMS.",
  },
  {
    step: "4",
    title: "Delivered",
    description: "Our delivery agent calls you before arrival. Please ensure someone is available to receive.",
  },
];

export default function ShippingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-[#010103] text-white py-14">
        <div className="max-w-[1280px] mx-auto px-4">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
            Shipping Info
          </p>
          <h1 className="text-4xl font-bold mb-4">Shipping Policy</h1>
          <p className="text-gray-400 text-sm max-w-xl">
            We deliver nationwide across Bangladesh. Here&apos;s everything you need to know about our
            shipping process, timelines, and fees.
          </p>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 py-16 space-y-12">
        {/* Delivery Process */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How Delivery Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s) => (
              <div key={s.step} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative">
                <div className="w-9 h-9 bg-[#127FFF] text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">
                  {s.step}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Zones & Fees */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Zones & Fees</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Zone</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Estimated Delivery</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Shipping Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ZONES.map((z) => (
                    <tr key={z.zone} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{z.zone}</td>
                      <td className="px-6 py-4 text-gray-600">{z.delivery}</td>
                      <td className="px-6 py-4 text-gray-600">{z.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            * Free shipping on Dhaka metro orders above ৳5,000. Large appliances (refrigerators, ACs, washing machines) may incur additional handling charges.
          </p>
        </div>

        {/* Important Notes */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Important Notes</h3>
            <ul className="space-y-3">
              {[
                "Orders placed before 2 PM are dispatched the same day (business days only).",
                "Delivery times are estimates and may vary during peak seasons or national holidays.",
                "Our agent will call you before delivery. Please keep your phone accessible.",
                "If you miss the delivery, re-delivery will be attempted the next business day.",
                "Some remote areas may require additional time or special arrangements.",
              ].map((note) => (
                <li key={note} className="flex items-start gap-3 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Large Appliance Delivery</h3>
            <ul className="space-y-3">
              {[
                "Refrigerators, ACs, and washing machines are delivered by specialized teams.",
                "Free installation for ACs within Dhaka metro. Charges apply outside Dhaka.",
                "Please ensure access to the installation location before scheduling delivery.",
                "Stair-carry service is available upon request for an additional fee.",
                "Our technician will test the appliance after installation.",
              ].map((note) => (
                <li key={note} className="flex items-start gap-3 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#127FFF] rounded-2xl p-8 text-white text-center">
          <h3 className="text-lg font-bold mb-2">Have a shipping question?</h3>
          <p className="text-blue-100 text-sm mb-5">
            Our support team is here to help — 9 AM to 9 PM, every day.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
