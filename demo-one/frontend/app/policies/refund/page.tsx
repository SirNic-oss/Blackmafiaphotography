import PolicyLayout from "@/components/policies/PolicyLayout";

export default function RefundPolicyPage() {
  return (
    <PolicyLayout
      title="Refund Policy"
      description="Our commitment to fair returns and refunds for Fashion-Fit purchases."
    >
      <section>
        <h2>Return window</h2>
        <p>
          Unworn items in original packaging may be returned within 14 days of
          delivery. Sale items marked final sale are not eligible unless
          defective.
        </p>
      </section>

      <section>
        <h2>Eligible condition</h2>
        <p>
          Items must be unused, with tags attached, and include proof of
          purchase. Footwear must be tried indoors only on clean surfaces.
        </p>
      </section>

      <section>
        <h2>Refund processing</h2>
        <p>
          Approved refunds are issued to the original payment method within 5–10
          business days after we receive and inspect the return.
        </p>
      </section>

      <section>
        <h2>Non-refundable items</h2>
        <p>
          Gift cards, personalized products, and hygiene-sensitive items (e.g.
          worn underwear or swimwear) cannot be refunded unless faulty.
        </p>
      </section>

      <section>
        <h2>How to start a return</h2>
        <p>
          Email{" "}
          <a href="mailto:support@fashionfit.com">support@fashionfit.com</a>{" "}
          with your order number and reason for return. Replace the support
          address with your official business email before going live.
        </p>
      </section>
    </PolicyLayout>
  );
}
