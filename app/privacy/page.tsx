import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — River Electronics",
  description:
    "Learn how River Electronics collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "January 1, 2025";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content: [
      "Personal identification information: name, email address, phone number, and delivery address when you create an account or place an order.",
      "Payment information: transaction details processed through secure third-party payment gateways. We do not store full payment card details.",
      "Device and usage data: IP address, browser type, pages visited, and referring URLs collected via cookies and analytics tools.",
      "Communications: records of your correspondence with our support team for quality and training purposes.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "To process and fulfill your orders, including sending confirmations, delivery updates, and receipts.",
      "To provide customer support and respond to your inquiries.",
      "To improve our website, products, and services based on usage patterns.",
      "To send promotional emails and offers — only with your explicit consent, and you can opt out at any time.",
      "To prevent fraud, enforce our terms, and comply with legal obligations.",
    ],
  },
  {
    title: "3. Information Sharing",
    content: [
      "We share your delivery address and contact number with our logistics partners solely for the purpose of delivering your order.",
      "Payment information is processed by secure third-party gateways (bKash, Nagad, SSLCommerz). We do not have access to your full payment credentials.",
      "We do not sell, trade, or rent your personal information to third parties for marketing purposes.",
      "We may disclose information when required by law, court order, or government regulation.",
    ],
  },
  {
    title: "4. Cookies",
    content: [
      "We use cookies to maintain your session, remember your preferences, and analyze website traffic.",
      "You can disable cookies through your browser settings. Note that disabling cookies may affect some website functionality.",
      "We use Google Analytics to understand how visitors use our website. This data is anonymous and aggregated.",
    ],
  },
  {
    title: "5. Data Security",
    content: [
      "We implement industry-standard security measures including SSL encryption to protect your data in transit.",
      "Access to personal data is restricted to authorized personnel who need it to perform their job functions.",
      "While we take every precaution, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.",
    ],
  },
  {
    title: "6. Data Retention",
    content: [
      "We retain your personal data for as long as necessary to fulfill the purposes outlined in this policy.",
      "Order and transaction records are kept for a minimum of 7 years for accounting and legal compliance.",
      "You may request deletion of your account and personal data by contacting us. We will comply unless retention is required by law.",
    ],
  },
  {
    title: "7. Your Rights",
    content: [
      "You have the right to access, correct, or delete your personal information held by us.",
      "You can opt out of marketing communications at any time by clicking 'Unsubscribe' in any email or contacting us.",
      "You may request a copy of the personal data we hold about you by emailing shajjad.konok@river.com.",
    ],
  },
  {
    title: "8. Children's Privacy",
    content: [
      "Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children.",
      "If you believe a child has provided us with personal information, please contact us and we will promptly delete it.",
    ],
  },
  {
    title: "9. Changes to This Policy",
    content: [
      "We may update this Privacy Policy periodically. The 'Last Updated' date at the top of this page reflects the most recent revision.",
      "Continued use of our website after changes constitutes acceptance of the revised policy.",
    ],
  },
  {
    title: "10. Contact Us",
    content: [
      "If you have any questions or concerns about this Privacy Policy, please contact us at shajjad.konok@river.com or call 01676888999.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-[#010103] text-white py-14">
        <div className="max-w-[1280px] mx-auto px-4">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Intro */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
            <p className="text-sm text-blue-800 leading-relaxed">
              River Electronics (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
              This policy explains what information we collect, how we use it, and your rights.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {SECTIONS.map((section) => (
              <div key={section.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-4">{section.title}</h2>
                <ul className="space-y-2.5">
                  {section.content.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
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
