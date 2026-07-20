import Link from "next/link";

const policies = [
  {
    href: "/policies/pricing",
    title: "Pricing",
    description: "How we price products, promotions, and currency.",
  },
  {
    href: "/policies/refund",
    title: "Refund Policy",
    description: "Returns, refunds, and exchange eligibility.",
  },
  {
    href: "/policies/cancellation",
    title: "Cancellation Policy",
    description: "Order cancellations before and after dispatch.",
  },
  {
    href: "/policies/shipping",
    title: "Shipping Policy",
    description: "Delivery times, fees, and tracking.",
  },
  {
    href: "/policies/terms",
    title: "Terms of Service",
    description: "Rules for using the Fashion-Fit website and services.",
  },
  {
    href: "/policies/privacy",
    title: "Privacy Policy",
    description: "How we collect, use, and protect your data.",
  },
];

export default function PoliciesPage() {
  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-6xl font-bold mb-4">Policies</h1>
        <p className="text-zinc-400 text-lg mb-12 max-w-2xl">
          Transparent information about pricing, orders, refunds, and your
          rights when shopping with Fashion-Fit.
        </p>

        <div className="grid gap-4">
          {policies.map((policy) => (
            <Link
              key={policy.href}
              href={policy.href}
              className="block rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
            >
              <h2 className="text-xl font-semibold text-white">
                {policy.title}
              </h2>
              <p className="mt-2 text-zinc-400">{policy.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
