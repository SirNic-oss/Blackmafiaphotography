import Link from "next/link";

const policyLinks = [
  { href: "/policies/pricing", label: "Pricing" },
  { href: "/policies/refund", label: "Refunds" },
  { href: "/policies/cancellation", label: "Cancellations" },
  { href: "/policies/shipping", label: "Shipping" },
  { href: "/policies/terms", label: "Terms" },
  { href: "/policies/privacy", label: "Privacy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <p className="text-white font-bold text-xl tracking-tight">
            FASHION FIT
          </p>
          <p className="text-zinc-400 mt-3 text-sm leading-6">
            Premium footwear and apparel. Crafted for those who move with
            intention.
          </p>
        </div>

        <div>
          <p className="text-white text-sm uppercase tracking-widest mb-4">
            Shop
          </p>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>
              <Link href="/shop" className="hover:text-white transition">
                All products
              </Link>
            </li>
            <li>
              <Link href="/story" className="hover:text-white transition">
                Our story
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-white text-sm uppercase tracking-widest mb-4">
            Policies
          </p>
          <ul className="space-y-2 text-sm text-zinc-400">
            {policyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white transition">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/policies" className="hover:text-white transition">
                View all policies
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Fashion-Fit. All rights reserved.
      </div>
    </footer>
  );
}
