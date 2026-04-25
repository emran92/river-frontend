import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — River Electronics",
  description: "Read the terms and conditions governing your use of River Electronics.",
};

const LAST_UPDATED = "January 1, 2025";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using the River Electronics website and purchasing our products, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services. River Electronics reserves the right to update these terms at any time, and continued use of our services constitutes acceptance of any changes.",
  },
  {
    title: "2. Products and Pricing",
    content:
      "All product descriptions, images, and specifications are provided in good faith. We reserve the right to correct any errors or inaccuracies and to change or update information without prior notice. Prices are listed in Bangladeshi Taka (BDT) and are subject to change without notice. All prices are inclusive of applicable VAT unless stated otherwise.",
  },
  {
    title: "3. Order Placement and Acceptance",
    content:
      "Placing an order constitutes an offer to purchase. An order is not accepted until we send a confirmation SMS or email. River Electronics reserves the right to refuse or cancel any order for reasons including but not limited to: product unavailability, pricing errors, or suspected fraudulent activity. In the event of cancellation, any payment made will be fully refunded.",
  },
  {
    title: "4. Payment",
    content:
      "Payment must be made in full before shipment for online orders. We accept bKash, Nagad, Rocket, bank transfer, and major credit/debit cards. Cash on delivery is available for eligible orders within designated areas. River Electronics uses secure payment gateways and does not store payment card details.",
  },
  {
    title: "5. Delivery",
    content:
      "Estimated delivery times are provided in good faith but are not guaranteed. River Electronics is not liable for delays caused by circumstances beyond our control, including natural disasters, civil unrest, or carrier disruptions. Risk of loss transfers to the buyer upon delivery. Please inspect your order upon receipt and report any damage within 24 hours.",
  },
  {
    title: "6. Returns and Refunds",
    content:
      "Returns are accepted within 14 days of delivery subject to our Return Policy. Products must be unused, in original packaging, and accompanied by proof of purchase. Refunds are processed within 3–5 business days of receiving the returned item. Certain products are non-returnable as specified in our Return Policy.",
  },
  {
    title: "7. Warranty",
    content:
      "Products are sold with the manufacturer's warranty where applicable. Warranty terms vary by brand and product. River Electronics acts as a facilitator for warranty claims but is not responsible for manufacturer warranty decisions. Warranties do not cover damage resulting from misuse, unauthorized modifications, or accidents.",
  },
  {
    title: "8. Intellectual Property",
    content:
      "All content on this website including text, graphics, logos, images, and software is the property of River Electronics or its content suppliers and is protected by applicable intellectual property laws. Unauthorized use, reproduction, or distribution is strictly prohibited.",
  },
  {
    title: "9. Limitation of Liability",
    content:
      "To the fullest extent permitted by law, River Electronics shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our products or services. Our maximum liability shall not exceed the amount you paid for the product in question.",
  },
  {
    title: "10. Governing Law",
    content:
      "These Terms and Conditions are governed by and construed in accordance with the laws of the People's Republic of Bangladesh. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.",
  },
  {
    title: "11. Contact",
    content:
      "If you have questions about these Terms and Conditions, please contact us at shajjad.konok@river.com or call 01676888999.",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-[#010103] text-white py-14">
        <div className="max-w-[1280px] mx-auto px-4">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1 className="text-4xl font-bold mb-4">Terms &amp; Conditions</h1>
          <p className="text-gray-400 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Intro */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
            <p className="text-sm text-blue-800 leading-relaxed">
              Please read these Terms and Conditions carefully before using the River Electronics
              website or purchasing our products. These terms apply to all visitors, users, and
              customers.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {SECTIONS.map((section) => (
              <div key={section.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">{section.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-8 text-center">
            © River Electronics {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
