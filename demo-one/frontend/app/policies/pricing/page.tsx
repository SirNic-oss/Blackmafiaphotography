import PolicyLayout from "@/components/policies/PolicyLayout";

export default function PricingPolicyPage() {
  return (
    <PolicyLayout
      title="Pricing Structure"
      description="Last updated: July 2026. All prices are listed in South African Rand (ZAR) unless stated otherwise."
    >
      <section>
        <h2>Listed prices</h2>
        <p>
          Product prices on Fashion-Fit include the item cost as shown on each
          product page. Prices may change without notice, but confirmed orders
          are charged at the price shown at checkout.
        </p>
      </section>

      <section>
        <h2>Promotions &amp; discounts</h2>
        <p>
          Promotional codes apply only when entered at checkout and cannot be
          combined unless explicitly stated. Discounts do not apply to gift
          cards or shipping fees unless a promotion says otherwise.
        </p>
      </section>

      <section>
        <h2>Shipping &amp; taxes</h2>
        <p>
          Shipping is calculated at checkout based on delivery address and
          selected service. Applicable VAT or duties for international orders
          may be charged by the carrier or customs authority.
        </p>
      </section>

      <section>
        <h2>Payment methods</h2>
        <p>
          We accept card and supported digital wallet payments through our
          payment provider. Configure your live payment keys in{" "}
          <code>frontend/.env.local</code> and backend environment variables
          (see notes at the bottom of this page).
        </p>
      </section>

      <section className="policy-note">
        <h2>Configuration note (for store owner)</h2>
        <ul>
          <li>
            <strong>Stripe / PayPal:</strong> Add keys in backend{" "}
            <code>STRIPE_SECRET_KEY</code>, <code>STRIPE_WEBHOOK_SECRET</code>,{" "}
            and frontend <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> when
            you enable live checkout.
          </li>
          <li>
            <strong>API URL:</strong> Set{" "}
            <code>NEXT_PUBLIC_API_URL</code> in{" "}
            <code>frontend/.env.local</code> to your deployed backend URL.
          </li>
        </ul>
      </section>
    </PolicyLayout>
  );
}
