import Image from "next/image";
import Link from "next/link";

const USEFUL_LINKS = [
  { label: "FAQ", href: "/faq" },
  { label: "About Us", href: "/about" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Support", href: "/support" },
];

const CATEGORIES = [
  { label: "Televisions", href: "/categories/televisions" },
  { label: "Refrigerators", href: "/categories/refrigerators" },
  { label: "Air Conditioners", href: "/categories/air-conditioners" },
  { label: "Washing Machines", href: "/categories/washing-machines" },
  { label: "Kitchen Appliances", href: "/categories/kitchen" },
  { label: "Small Appliances", href: "/categories/small-appliances" },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.45333 8.85324C5.91999 8.85324 5.38666 8.85324 4.85333 8.85324C4.74666 8.85324 4.66666 8.82657 4.61333 8.77324C4.55999 8.7199 4.53333 8.62212 4.53333 8.4799V6.5599C4.53333 6.41768 4.55999 6.32879 4.61333 6.29324C4.66666 6.25768 4.74666 6.2399 4.85333 6.2399H6.45333V4.7999C6.45333 4.12435 6.60444 3.5199 6.90666 2.98657C7.20888 2.45324 7.67999 2.06212 8.31999 1.81324C8.7111 1.67101 9.11999 1.5999 9.54666 1.5999H11.1467C11.36 1.5999 11.4667 1.70657 11.4667 1.9199V3.73324C11.4667 3.94657 11.3422 4.07101 11.0933 4.10657H9.81333C9.38666 4.10657 9.17333 4.3199 9.17333 4.74657V6.18657H11.04C11.1467 6.18657 11.2267 6.21324 11.28 6.26657C11.3333 6.3199 11.36 6.41768 11.36 6.5599V8.4799C11.36 8.62212 11.3422 8.71101 11.3067 8.74657C11.2711 8.78212 11.1822 8.7999 11.04 8.7999H9.17333V14.0266C9.17333 14.1688 9.14666 14.2666 9.09333 14.3199C9.03999 14.3732 8.94221 14.3999 8.79999 14.3999H6.77333C6.55999 14.3999 6.45333 14.2932 6.45333 14.0799V8.85324Z" fill="white"/>
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.49337 6.77333L15.3067 0H13.92L8.85337 5.86667L4.85337 0H0.160034L6.29337 8.90667L0.160034 16H1.5467L6.88003 9.81333L11.1467 16H15.84L9.49337 6.77333ZM7.57337 8.96L6.9867 8.10667L2.0267 1.01333H4.16003L13.92 14.9867H11.84L7.57337 8.96Z" fill="white"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#010103] text-gray-300">
      <div className="max-w-[1280px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div>
            <div className="relative h-10 w-36 mb-4">
              <Image
                src="/logo-blue.svg"
                alt="River Electronics"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              River Electronics — your trusted destination for premium home appliances. Quality products, competitive prices, and excellent service.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl border border-gray-800 hover:bg-river-blue flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Useful Links
            </h4>
            <ul className="space-y-2">
              {USEFUL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Category
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-white-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:01676888999" className="hover:text-white transition-colors">01676888999</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-white-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:shaphal.surovi@river.com" className="hover:text-white transition-colors break-all">
                  shajjad.konok@river.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-white-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Road 126, Gulshan 1, Dhaka</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-[1280px] mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© River Electronics {new Date().getFullYear()} | By Septolab</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
