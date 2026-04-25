import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support — River Electronics",
  description:
    "Get help from River Electronics' support team via phone, email, or live chat.",
};

const SUPPORT_OPTIONS = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: "Call Us",
    description: "Speak directly with a support agent.",
    detail: "01676888999",
    sub: "9 AM – 9 PM, 7 days a week",
    action: { label: "Call Now", href: "tel:01676888999" },
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Email Us",
    description: "Send us your query and we'll respond within 24 hours.",
    detail: "shajjad.konok@river.com",
    sub: "Response within 24 hours",
    action: { label: "Send Email", href: "mailto:shajjad.konok@river.com" },
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Service Request",
    description: "Submit a warranty claim, return, or repair request.",
    detail: "Online Form",
    sub: "Track your request anytime",
    action: { label: "Submit Request", href: "/service" },
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Visit Us",
    description: "Come to our showroom for in-person assistance.",
    detail: "Road 126, Gulshan 1, Dhaka",
    sub: "Sat–Thu 10 AM – 8 PM",
    action: { label: "Get Directions", href: "https://maps.google.com" },
  },
];

const TOPICS = [
  { label: "Track My Order", icon: "📦", href: "/faq#orders" },
  { label: "Returns & Refunds", icon: "↩️", href: "/returns" },
  { label: "Warranty Claims", icon: "🛡️", href: "/service" },
  { label: "Product Installation", icon: "🔧", href: "/service" },
  { label: "Payment Issues", icon: "💳", href: "/faq#payments" },
  { label: "Shipping Information", icon: "🚚", href: "/shipping" },
];

export default function SupportPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-[#010103] text-white py-14">
        <div className="max-w-[1280px] mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
            Customer Support
          </p>
          <h1 className="text-4xl font-bold mb-4">How Can We Help?</h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Our dedicated support team is available 9 AM – 9 PM, 7 days a week. Choose the
            channel that works best for you.
          </p>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 py-16 space-y-12">
        {/* Support Channels */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SUPPORT_OPTIONS.map((opt) => (
            <div
              key={opt.title}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                {opt.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">{opt.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{opt.description}</p>
              <p className="text-sm font-medium text-gray-800 mb-1">{opt.detail}</p>
              <p className="text-xs text-gray-400 mb-5">{opt.sub}</p>
              <a
                href={opt.action.href}
                className="mt-auto block text-center bg-[#F4F4F4] hover:bg-[#127FFF] hover:text-white text-gray-800 text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                {opt.action.label}
              </a>
            </div>
          ))}
        </div>

        {/* Quick topics */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Topic</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {TOPICS.map((t) => (
              <Link
                key={t.label}
                href={t.href}
                className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md hover:border-blue-100 transition-all"
              >
                <div className="text-2xl mb-2">{t.icon}</div>
                <p className="text-xs font-medium text-gray-700 leading-tight">{t.label}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Check our FAQ First
              </h2>
              <p className="text-sm text-gray-500 max-w-lg">
                Many common questions about orders, shipping, returns, and products are answered
                in our FAQ section. You might find your answer instantly.
              </p>
            </div>
            <Link
              href="/faq"
              className="flex-shrink-0 bg-[#127FFF] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors whitespace-nowrap"
            >
              Visit FAQ →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
