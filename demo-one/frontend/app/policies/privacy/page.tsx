import PolicyLayout from "@/components/policies/PolicyLayout";

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      description="How Fashion-Fit handles your personal information."
    >
      <section>
        <h2>Information we collect</h2>
        <p>
          We collect information you provide at checkout and contact forms
          (name, email, phone, delivery address, order history) and technical
          data such as IP address and browser type for security and analytics.
        </p>
      </section>

      <section>
        <h2>How we use it</h2>
        <p>
          To process orders, provide customer support, send transactional emails,
          improve our store, and comply with legal obligations. Marketing emails
          are sent only with your consent.
        </p>
      </section>

      <section>
        <h2>Sharing</h2>
        <p>
          We share data with payment processors, couriers, and hosting providers
          only as needed to fulfil your order. We do not sell your personal
          information.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          You may request access, correction, or deletion of your data subject
          to POPIA (Protection of Personal Information Act). Contact{" "}
          <a href="mailto:privacy@fashionfit.com">privacy@fashionfit.com</a>.
        </p>
      </section>

      <section className="policy-note">
        <h2>Configuration note (for store owner)</h2>
        <ul>
          <li>
            <strong>Analytics:</strong> Add{" "}
            <code>NEXT_PUBLIC_GA_MEASUREMENT_ID</code> in frontend{" "}
            <code>.env.local</code> if using Google Analytics.
          </li>
          <li>
            <strong>Email:</strong> Configure transactional email (e.g. Resend,{" "}
            <code>RESEND_API_KEY</code>) in the backend for order confirmations.
          </li>
        </ul>
      </section>
    </PolicyLayout>
  );
}
