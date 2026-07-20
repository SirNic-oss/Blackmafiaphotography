export default function CheckoutPage() {
  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-white text-6xl font-bold mb-4">Checkout</h1>
        <p className="text-zinc-400 mb-8">
          Checkout is coming soon. By placing an order you agree to our{" "}
          <a href="/policies/terms" className="text-white underline">
            Terms of Service
          </a>
          ,{" "}
          <a href="/policies/refund" className="text-white underline">
            Refund Policy
          </a>
          , and{" "}
          <a href="/policies/cancellation" className="text-white underline">
            Cancellation Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}