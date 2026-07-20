import PolicyLayout from "@/components/policies/PolicyLayout";

export default function CancellationPolicyPage() {
  return (
    <PolicyLayout
      title="Cancellation Policy"
      description="When and how you can cancel an order with Fashion-Fit."
    >
      <section>
        <h2>Before dispatch</h2>
        <p>
          You may cancel an order within 2 hours of placement if it has not
          entered processing. Contact us immediately with your order number.
        </p>
      </section>

      <section>
        <h2>After processing starts</h2>
        <p>
          Once an order is packed or handed to the courier, cancellation is no
          longer possible. You may refuse delivery or use our{" "}
          <a href="/policies/refund">Refund Policy</a> after receiving the item.
        </p>
      </section>

      <section>
        <h2>Partial cancellations</h2>
        <p>
          If only part of your order is unavailable, we will cancel those items
          and refund the difference, or offer a substitute with your approval.
        </p>
      </section>

      <section>
        <h2>Payment holds</h2>
        <p>
          Authorizations on your card may appear before shipment. If we cancel
          your order, the hold is released according to your bank&apos;s timeline.
        </p>
      </section>
    </PolicyLayout>
  );
}
