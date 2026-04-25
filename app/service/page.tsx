"use client";

import { useState, type FormEvent } from "react";

const SERVICE_TYPES = [
  { value: "warranty_repair", label: "Warranty Repair" },
  { value: "out_of_warranty_repair", label: "Out-of-Warranty Repair" },
  { value: "installation", label: "Installation / Setup" },
  { value: "return", label: "Return / Exchange" },
  { value: "product_damage", label: "Product Damaged on Delivery" },
  { value: "maintenance", label: "Preventive Maintenance" },
  { value: "other", label: "Other" },
];

const WHAT_TO_EXPECT = [
  {
    step: "1",
    title: "Confirmation",
    description: "You'll receive an SMS confirmation within 2 hours of submitting your request.",
  },
  {
    step: "2",
    title: "Assessment",
    description: "A service agent will review your request and contact you within 1 business day.",
  },
  {
    step: "3",
    title: "Scheduling",
    description: "We'll schedule a technician visit or arrange pickup at a convenient time for you.",
  },
  {
    step: "4",
    title: "Resolution",
    description: "Your issue will be resolved with a follow-up confirmation from our service team.",
  },
];

export default function ServiceRequestPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    orderNumber: "",
    productName: "",
    purchaseDate: "",
    serviceType: "",
    description: "",
    address: "",
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
            After-Sales
          </p>
          <h1 className="text-4xl font-bold mb-4">Service Request</h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Submit a service request for warranty repairs, installation, returns, or any
            product-related issue. Our technical team will follow up promptly.
          </p>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 py-16 space-y-12">
        {/* Process */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What to Expect</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHAT_TO_EXPECT.map((s) => (
              <div key={s.step} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="w-9 h-9 bg-[#127FFF] text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">
                  {s.step}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form + Side */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Side */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Need Urgent Help?</h3>
              <p className="text-sm text-gray-500 mb-4">
                For urgent issues, call our support line directly. Available 9 AM – 9 PM every day.
              </p>
              <a
                href="tel:01676888999"
                className="flex items-center gap-3 bg-[#127FFF] text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm font-semibold">01676888999</span>
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Service Coverage</h3>
              <ul className="space-y-2">
                {[
                  "All products purchased from River Electronics",
                  "Warranty & out-of-warranty repairs",
                  "AC, refrigerator, washing machine servicing",
                  "Home visit available in Dhaka metro",
                  "Drop-off available at Gulshan showroom",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                    <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Tip:</strong> Have your order number and product serial number ready before
                filling in the form. This helps us process your request faster.
              </p>
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    Your service request has been received. You will get an SMS confirmation shortly.
                    Our team will contact you within 1 business day.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Submit a Service Request</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Customer Info */}
                    <div className="border-b border-gray-100 pb-5">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
                        Your Information
                      </p>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="name" className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="John Doe"
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
                      <div className="grid sm:grid-cols-2 gap-5 mt-5">
                        <div>
                          <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Email Address
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="you@example.com"
                          />
                        </div>
                        <div>
                          <label htmlFor="address" className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Service Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="address"
                            name="address"
                            type="text"
                            required
                            value={form.address}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Full address"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="border-b border-gray-100 pb-5">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
                        Product Details
                      </p>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="orderNumber" className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Order Number
                          </label>
                          <input
                            id="orderNumber"
                            name="orderNumber"
                            type="text"
                            value={form.orderNumber}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="ORD-XXXXXXXX"
                          />
                        </div>
                        <div>
                          <label htmlFor="purchaseDate" className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Purchase Date
                          </label>
                          <input
                            id="purchaseDate"
                            name="purchaseDate"
                            type="date"
                            value={form.purchaseDate}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          />
                        </div>
                      </div>
                      <div className="mt-5">
                        <label htmlFor="productName" className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Product Name / Model <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="productName"
                          name="productName"
                          type="text"
                          required
                          value={form.productName}
                          onChange={handleChange}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="e.g. Samsung 55\" Smart TV, Model: UA55AU7700"
                        />
                      </div>
                    </div>

                    {/* Service Info */}
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
                        Service Details
                      </p>
                      <div>
                        <label htmlFor="serviceType" className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Service Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="serviceType"
                          name="serviceType"
                          required
                          value={form.serviceType}
                          onChange={handleChange}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                        >
                          <option value="">Select service type</option>
                          {SERVICE_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-5">
                        <label htmlFor="description" className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Problem Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={4}
                          required
                          value={form.description}
                          onChange={handleChange}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                          placeholder="Describe the issue in detail — when it started, symptoms, error messages, etc."
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#127FFF] text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? "Submitting..." : "Submit Service Request"}
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
