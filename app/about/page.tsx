import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us — River Electronics",
  description:
    "Learn about River Electronics — our story, mission, and commitment to delivering premium home appliances in Bangladesh.",
};

const STATS = [
  { value: "15+", label: "Years of Experience" },
  { value: "50,000+", label: "Happy Customers" },
  { value: "500+", label: "Products" },
  { value: "20+", label: "Service Centers" },
];

const VALUES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "Quality First",
    description:
      "We source only certified, premium-grade appliances from globally trusted manufacturers to ensure lasting performance.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Customer-Centric",
    description:
      "Our customers are at the heart of everything we do. We listen, adapt, and deliver experiences that exceed expectations.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Innovation",
    description:
      "We constantly evolve our product range to include the latest in smart home technology and energy-efficient appliances.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Nationwide Reach",
    description:
      "With service centers across Bangladesh, we ensure that expert support is always within your reach.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-[#010103] text-white py-16">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
              Our Story
            </p>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Powering Homes Across Bangladesh
            </h1>
            <p className="text-gray-400 leading-relaxed text-sm">
              River Electronics has been a trusted partner for Bangladeshi households for over a
              decade — delivering quality appliances that enhance everyday living.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#127FFF] text-white">
        <div className="max-w-[1280px] mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-sm text-blue-100 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-[1280px] mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
              Who We Are
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              More Than Just an Electronics Store
            </h2>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                Founded with a vision to make premium home appliances accessible to every
                Bangladeshi household, River Electronics has grown into one of the country's
                leading electronics retailers.
              </p>
              <p>
                We partner with globally recognized brands — bringing world-class technology to
                your doorstep at competitive prices. From televisions and refrigerators to air
                conditioners and kitchen appliances, we carry products that combine performance,
                durability, and style.
              </p>
              <p>
                Beyond selling products, we are committed to providing an unparalleled after-sales
                experience. Our dedicated service team ensures that your appliances continue to
                perform at their best for years to come.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              To enrich the lives of Bangladeshi families by providing access to world-class home
              appliances — backed by honest advice, transparent pricing, and reliable after-sales
              service.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              To be Bangladesh's most trusted home appliance brand — known not just for our
              products, but for the relationships we build and the lives we improve.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">
              What Drives Us
            </p>
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-gray-50 rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:border-blue-100 transition-all"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  {v.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-[1280px] mx-auto px-4 py-16">
        <div className="bg-[#010103] rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Want to Work With Us?</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Whether you&apos;re a dealer, corporate buyer, or just want to say hello — we&apos;d
            love to hear from you.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#127FFF] text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
