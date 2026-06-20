import Link from "next/link";

export default function Footer() {
  const collections = [
    { label: "Anarkali Suits", href: "/shop?category=anarkali" },
    { label: "Lehenga Choli", href: "/shop?category=lehenga" },
    { label: "Sarees", href: "/shop?category=saree" },
    { label: "Kurta Sets", href: "/shop?category=kurta" },
    { label: "Bridal Edit", href: "/shop?bridal=true" },
    { label: "Sale", href: "/shop?sale=true" },
  ];

  const support = [
    { label: "Size Guide", href: "#" },
    { label: "Care Instructions", href: "#" },
    { label: "Returns & Exchanges", href: "#" },
    { label: "Track Your Order", href: "#" },
    { label: "Shipping Policy", href: "#" },
    { label: "Contact Us", href: "#" },
  ];

  const company = [
    { label: "Our Story", href: "#" },
    { label: "Artisan Partners", href: "#" },
    { label: "Sustainability", href: "#" },
    { label: "Press & Media", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ];

  return (
    <footer className="bg-[#080604] border-t border-[#c9a84c]/12 pt-16 pb-8">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="block font-serif text-[1.55rem] text-[#c9a84c] mb-4 hover:text-[#e8c96a] transition-colors">
              Taania Kandpal
            </Link>
            <p className="text-[#8a7d6e] text-sm leading-relaxed mb-6 max-w-xs">
              Luxury Indian ethnic wear crafted for the discerning woman. Each piece is a celebration of heritage, artistry, and timeless elegance.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/taaniakandpal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 border border-[#c9a84c]/20 flex items-center justify-center text-[#8a7d6e] hover:bg-[#c9a84c] hover:border-[#c9a84c] hover:text-[#0a0806] transition-all"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 border border-[#c9a84c]/20 flex items-center justify-center text-[#8a7d6e] hover:bg-[#c9a84c] hover:border-[#c9a84c] hover:text-[#0a0806] transition-all"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="w-9 h-9 border border-[#c9a84c]/20 flex items-center justify-center text-[#8a7d6e] hover:bg-[#c9a84c] hover:border-[#c9a84c] hover:text-[#0a0806] transition-all"
              >
                <span className="text-xs font-bold">P</span>
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-[0.68rem] tracking-[0.22em] uppercase text-[#c9a84c] font-semibold mb-5">
              Collections
            </h3>
            <ul className="space-y-2.5">
              {collections.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[#8a7d6e] text-sm hover:text-[#c9a84c] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[0.68rem] tracking-[0.22em] uppercase text-[#c9a84c] font-semibold mb-5">
              Customer Care
            </h3>
            <ul className="space-y-2.5">
              {support.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[#8a7d6e] text-sm hover:text-[#c9a84c] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[0.68rem] tracking-[0.22em] uppercase text-[#c9a84c] font-semibold mb-5">
              Company
            </h3>
            <ul className="space-y-2.5">
              {company.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[#8a7d6e] text-sm hover:text-[#c9a84c] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#c9a84c]/12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#6b6258] text-xs">
            © {new Date().getFullYear()} Taania Kandpal. All rights reserved. Crafted with ♡ in India.
          </p>
          <div className="flex items-center gap-2">
            {["Razorpay", "UPI", "Visa", "Mastercard", "COD"].map((p) => (
              <span
                key={p}
                className="text-[#6b6258] text-[0.65rem] border border-[#c9a84c]/15 px-2 py-1 tracking-wide"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
