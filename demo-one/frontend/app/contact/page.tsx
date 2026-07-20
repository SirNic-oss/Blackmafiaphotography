export default function ContactPage() {
  return (
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-white text-6xl font-bold mb-8">Contact</h1>
        <p className="text-zinc-400 mb-10">
          Questions about orders, sizing, or collaborations? Send us a
          message and we will get back within one business day.
        </p>

        <p className="text-sm text-amber-200/90 mb-8 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
          Store owner: connect this form to your email API by setting{" "}
          <code className="text-zinc-200">RESEND_API_KEY</code> (or SendGrid) in
          the backend and posting submissions to an API route.
        </p>

        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm text-zinc-400 mb-2"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm text-zinc-400 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm text-zinc-400 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-white text-black font-medium hover:opacity-90 transition-opacity"
          >
            Send message
          </button>
        </form>
      </div>
    </main>
  );
}
