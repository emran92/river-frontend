"use client";

import { useState, type FormEvent } from "react";

const BENEFITS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Competitive Wholesale Pricing",
    description: "Access exclusive dealer pricing and volume discounts on our full product range.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: "Dedicated Account Manager",
    description: "A dedicated point of contact to manage your orders, queries, and after-sales needs.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: "Priority Stock Access",
    description: "Get early access to new arrivals and priority fulfillment on high-demand products.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "After-Sales Support",
    description: "Full access to our service network for warranty claims and technical assistance.",
  },
];

export default function CorporatePage() {
  const [form, setForm] = useState({
    company: "",
    contactName: "",
    email: "",
    phone: "",
    type: "",
    employees: "",
    products: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-[#010103] text-white py-14">
        <div className="max-w-[1280px] mx-auto px-4">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
            Business Partnerships
          </p>
          <h1 className="text-4xl font-bold mb-4">Corporate &amp; Dealer Inquiry</h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Partner with River Electronics to bring premium home appliances to your customers.
            Enjoy competitive pricing, dedicated support, and priority stock access.
          </p>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 py-16 space-y-12">
        {/* Benefits */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3">
                {b.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{b.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Side info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Who Should Apply?</h3>
              <ul className="space-y-3">
                {[
                  "Retail electronics stores",
                  "Interior design firms",
                  "Real estate developers",
                  "Hotel & hospitality businesses",
                  "Corporate offices & institutions",
                  "Online resellers & distributors",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#127FFF] rounded-2xl p-6 text-white">
              <h3 className="text-base font-semibold mb-2">Need Immediate Assistance?</h3>
              <p className="text-sm text-blue-100 mb-4">
                Speak directly with our corporate sales team.
              </p>
              <a
                href="tel:01676888999"
                className="block text-center bg-white text-blue-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
              >
                Call 01676888999
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Inquiry Submitted!</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    Thank you for your interest in partnering with River Electronics. Our corporate
                    team will contact you within 1–2 business days.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Partnership Inquiry Form</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="company" className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          required
                          value={form.company}
                          onChange={handleChange}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="Your Company Ltd."
                        />
                      </div>
                      <div>
                        <label htmlFor="contactName" className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Contact Person <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="contactName"
                          name="contactName"
                          type="text"
                          required
                          value={form.contactName}
                          onChange={handleChange}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="Full Name"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="you@company.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="01XXXXXXXXX"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="type" className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Business Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="type"
                          name="type"
                          required
                          value={form.type}
                          onChange={handleChange}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                        >
                          <option value="">Select type</option>
                          <option value="retailer">Retailer</option>
                          <option value="distributor">Distributor</option>
                          <option value="corporate">Corporate / Office</option>
                          <option value="hotel">Hotel / Hospitality</option>
                          <option value="developer">Real Estate Developer</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="employees" className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Company Size
                        </label>
                        <select
                          id="employees"
                          name="employees"
                          value={form.employees}
                          onChange={handleChange}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                        >
                          <option value="">Select size</option>
                          <option value="1-10">1–10 employees</option>
                          <option value="11-50">11–50 employees</option>
                          <option value="51-200">51–200 employees</option>
                          <option value="201+">201+ employees</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="products" className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Products of Interest
                      </label>
                      <input
                        id="products"
                        name="products"
                        type="text"
                        value={form.products}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="e.g. Televisions, Air Conditioners, Refrigerators"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Additional Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                        placeholder="Tell us more about your requirements..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#127FFF] text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? "Submitting..." : "Submit Inquiry"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
