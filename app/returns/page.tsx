import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Refunds — River Electronics",
  description:
    "Read River Electronics' 14-day return policy and learn how to initiate a return or exchange.",
};

const ELIGIBLE = [
  "Item received damaged or defective",
  "Wrong item delivered",
  "Item significantly different from product description",
  "Item is unused and in original factory-sealed packaging",
  "All original accessories, manuals, and tags are intact",
];

const NOT_ELIGIBLE = [
  "Items returned after 14 days of delivery",
  "Used, installed, or physically damaged items (unless defective on arrival)",
  "Products with missing serial numbers or labels",
  "Items purchased during clearance or final-sale promotions",
  "Consumables (filters, batteries, etc.) once opened",
];

const STEPS = [
  {
    step: "1",
    title: "Contact Us",
    description:
      "Call 01676888999 or email shajjad.konok@river.com within 14 days of delivery. Have your order number ready.",
  },
  {
    step: "2",
    title: "Get Approval",
    description:
      "Our team will review your request and send a Return Merchandise Authorization (RMA) number within 24 hours.",
  },
  {
    step: "3",
    title: "Ship the Item",
    description:
      "Pack the item securely in its original packaging. Write the RMA number on the outside of the package.",
  },
  {
    step: "4",
    title: "Refund / Exchange",
    description:
      "Once we receive and inspect the item, your refund or exchange will be processed within 3–5 business days.",
  },
];

export default function ReturnsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-[#010103] text-white py-14">
        <div className="max-w-[1280px] mx-auto px-4">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
            Returns & Refunds
          </p>
          <h1 className="text-4xl font-bold mb-4">14-Day Return Policy</h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Not satisfied with your purchase? We make returns simple and hassle-free. Here&apos;s
            everything you need to know.
          </p>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 py-16 space-y-12">
        {/* Return Process */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Return an Item</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s) => (
              <div key={s.step} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="w-9 h-9 bg-[#127FFF] text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">
                  {s.step}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Eligible / Not eligible */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <h3 className="text-base font-semibold text-gray-900">Eligible for Return</h3>
            </div>
            <ul className="space-y-3">
              {ELIGIBLE.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              <h3 className="text-base font-semibold text-gray-900">Not Eligible for Return</h3>
            </div>
            <ul className="space-y-3">
              {NOT_ELIGIBLE.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Refund Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Refund Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Refund Timeline",
                description:
                  "Approved refunds are processed within 3–5 business days. Bank transfers may take an additional 2–3 business days depending on your bank.",
              },
              {
                title: "Refund Method",
                description:
                  "Refunds are issued via the original payment method — bKash, Nagad, bank transfer, or credit/debit card. Cash-on-delivery orders are refunded by bank transfer.",
              },
              {
                title: "Exchange Option",
                description:
                  "Prefer an exchange instead of a refund? We can arrange an exchange for the same or a different product of equal value. Contact us to discuss options.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#010103] rounded-2xl p-8 text-white text-center">
          <h3 className="text-lg font-bold mb-2">Ready to initiate a return?</h3>
          <p className="text-gray-400 text-sm mb-5">
            Our team is ready to help. Reach us at{" "}
            <a href="tel:01676888999" className="text-blue-400 hover:underline">
              01676888999
            </a>{" "}
            or submit a service request online.
          </p>
          <Link
            href="/service"
            className="inline-block bg-[#127FFF] text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
          >
            Submit a Return Request
          </Link>
        </div>
      </div>
    </div>
  );
}
