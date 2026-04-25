"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    category: "Orders & Payments",
    questions: [
      {
        q: "How do I place an order?",
        a: "Browse our product catalog, add items to your cart, and proceed to checkout. You can pay via bKash, Nagad, bank transfer, or cash on delivery.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept bKash, Nagad, Rocket, all major credit/debit cards, bank transfers, and cash on delivery for eligible orders.",
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "Orders can be modified or cancelled within 2 hours of placement. Please contact our support team immediately at 01676888999.",
      },
      {
        q: "Will I receive a confirmation after ordering?",
        a: "Yes, you will receive an SMS and email confirmation with your order details and estimated delivery date immediately after placing your order.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Dhaka metro deliveries typically take 1–2 business days. Other districts take 3–5 business days depending on location and product availability.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Free shipping is available on orders over ৳5,000 within Dhaka metro. Flat-rate shipping fees apply for other areas.",
      },
      {
        q: "Can I track my order?",
        a: "Yes. Once your order is dispatched, you will receive a tracking link via SMS. You can also track your order from your account dashboard.",
      },
      {
        q: "Do you deliver outside Dhaka?",
        a: "We deliver nationwide across Bangladesh. Delivery to remote areas may take slightly longer. Some large appliances may require special arrangement.",
      },
    ],
  },
  {
    category: "Returns & Warranty",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 14-day return window for most products. Items must be unused, in original packaging, and accompanied by proof of purchase.",
      },
      {
        q: "How do I initiate a return?",
        a: "Contact our support team within 14 days of delivery via phone, email, or the Service Request form. Our team will guide you through the process.",
      },
      {
        q: "What warranty do products come with?",
        a: "All products come with the manufacturer's warranty. Warranty periods vary by brand and product type — typically 1 to 5 years. Check the product page for specific details.",
      },
      {
        q: "What if my product arrives damaged?",
        a: "Please inspect your delivery upon receipt. If any damage is found, refuse the delivery or contact us within 24 hours with photos. We will arrange a replacement promptly.",
      },
    ],
  },
  {
    category: "Products & Technical",
    questions: [
      {
        q: "Are all products genuine?",
        a: "Yes, 100%. All products sold by River Electronics are brand-new, original, and sourced directly from authorized manufacturers and distributors.",
      },
      {
        q: "Do you provide installation services?",
        a: "Yes, free installation is available for air conditioners and some large appliances within Dhaka metro. Charges may apply outside Dhaka.",
      },
      {
        q: "Can I get a demo before purchasing?",
        a: "Visit our showroom at Gulshan 1, Dhaka for live product demonstrations. Our trained staff will help you choose the right product.",
      },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        className="w-full flex items-center justify-between py-4 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-medium text-gray-800">{q}</span>
        <svg
          className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p className="text-sm text-gray-500 leading-relaxed pb-4">{a}</p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-[#010103] text-white py-14">
        <div className="max-w-[1280px] mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
            Help Center
          </p>
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Can&apos;t find your answer? Reach us at{" "}
            <a href="tel:01676888999" className="text-blue-400 hover:underline">
              01676888999
            </a>{" "}
            or{" "}
            <a href="mailto:shajjad.konok@river.com" className="text-blue-400 hover:underline">
              shajjad.konok@river.com
            </a>
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-[1280px] mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-8">
          {FAQ_ITEMS.map((section) => (
            <div key={section.category} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
                <h2 className="text-base font-semibold text-gray-900">{section.category}</h2>
              </div>
              <div className="px-6">
                {section.questions.map((item) => (
                  <AccordionItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div className="max-w-3xl mx-auto mt-10">
          <div className="bg-[#127FFF] rounded-2xl p-8 text-white text-center">
            <h3 className="text-lg font-bold mb-2">Still have questions?</h3>
            <p className="text-blue-100 text-sm mb-5">
              Our support team is available 9 AM – 9 PM, 7 days a week.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="tel:01676888999"
                className="bg-white text-blue-600 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
              >
                Call Us
              </a>
              <a
                href="/contact"
                className="border border-white text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Send a Message
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
