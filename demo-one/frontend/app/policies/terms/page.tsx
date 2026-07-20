import PolicyLayout from "@/components/policies/PolicyLayout";

export default function TermsOfServicePage() {
  return (
    <PolicyLayout
      title="Terms of Service"
      description="By using fashion-fit.com you agree to these terms."
    >
      <section>
        <h2>Use of the website</h2>
        <p>
          You must be at least 18 years old or have guardian consent to purchase.
          You agree not to misuse the site, attempt unauthorized access, or
          interfere with other users.
        </p>
      </section>

      <section>
        <h2>Products &amp; availability</h2>
        <p>
          We strive for accurate descriptions and imagery. Colours may vary
          slightly by screen. If an item is unavailable after you order, we will
          notify you and offer a refund or alternative.
        </p>
      </section>

      <section>
        <h2>Orders &amp; payment</h2>
        <p>
          Placing an order constitutes an offer to purchase. We may decline
          orders for fraud prevention, stock issues, or pricing errors. Payment
          is processed securely through our payment partners.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          Fashion-Fit is not liable for indirect or consequential losses except
          where required by South African consumer law. Nothing in these terms
          limits your statutory rights.
        </p>
      </section>

      <section>
        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of the Republic of South Africa.
          Disputes should first be raised with{" "}
          <a href="mailto:support@fashionfit.com">support@fashionfit.com</a>.
        </p>
      </section>
    </PolicyLayout>
  );
}
