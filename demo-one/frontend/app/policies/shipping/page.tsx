import PolicyLayout from "@/components/policies/PolicyLayout";

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      title="Shipping Policy"
      description="Delivery options, timelines, and tracking for Fashion-Fit orders."
    >
      <section>
        <h2>Processing time</h2>
        <p>
          Orders are processed within 1–2 business days (excluding public
          holidays). You will receive an email when your order ships.
        </p>
      </section>

      <section>
        <h2>Domestic delivery (South Africa)</h2>
        <p>
          Standard delivery: 3–7 business days. Express delivery: 1–3 business
          days where available. Rates are shown at checkout.
        </p>
      </section>

      <section>
        <h2>International delivery</h2>
        <p>
          International shipping times vary by destination (typically 7–21
          business days). Customs fees and import duties are the customer&apos;s
          responsibility unless stated otherwise.
        </p>
      </section>

      <section>
        <h2>Tracking</h2>
        <p>
          Tracking links are sent by email once the carrier scans your parcel.
          Integrate your courier API (e.g. Bob Go, Shippit, or your provider) in
          the backend and set webhook/API keys in your server environment when
          ready.
        </p>
      </section>

      <section className="policy-note">
        <h2>Configuration note (for store owner)</h2>
        <p>
          Set <code>COURIER_API_KEY</code> and <code>COURIER_API_URL</code> in
          your backend <code>.env</code> when connecting live shipping rates and
          tracking.
        </p>
      </section>
    </PolicyLayout>
  );
}
