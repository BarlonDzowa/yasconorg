import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-[#0f1a0f] via-[#1a2e1a] to-[#2d4a2d] text-white">
      <div className="absolute inset-0">
        <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-[#d4a017]/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] h-72 w-72 rounded-full bg-[#52b788]/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_45%)]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-28 flex flex-col md:flex-row items-center gap-12">
        <div className="text-center md:text-left space-y-6 md:space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#d4a017] ring-1 ring-white/15">
            <span className="h-2 w-2 rounded-full bg-[#d4a017]" />
            Page Not Found
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              We could not find the page you were looking for.
            </h1>
            <p className="text-white/80 text-lg max-w-2xl">
              The link may be broken or the page might have moved. Let’s get you
              back to the green path.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <Link
              href="/"
              className="bg-[#d4a017] text-[#0f1a0f] font-semibold px-6 py-3 rounded-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              Return Home
            </Link>
            <Link
              href="/contact"
              className="border border-white/30 text-white px-6 py-3 rounded-sm font-semibold hover:bg-white/10 transition-all hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-sm text-white/80 max-w-xl">
            <div className="rounded-md bg-white/5 px-4 py-3 border border-white/10">
              <p className="text-white font-semibold">Try the navigation</p>
              <p>Use the menu to find programs, news, or how to get involved.</p>
            </div>
            <div className="rounded-md bg-white/5 px-4 py-3 border border-white/10">
              <p className="text-white font-semibold">Stay updated</p>
              <p>Visit our news page for the latest conservation stories.</p>
            </div>
            <div className="rounded-md bg-white/5 px-4 py-3 border border-white/10">
              <p className="text-white font-semibold">Need help?</p>
              <p>Reach out and we will guide you to the right information.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative h-48 w-48 sm:h-56 sm:w-56 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-md">
            <div className="absolute inset-4 rounded-full bg-white/5 border border-white/15" />
            <div className="text-center">
              <p className="text-lg font-semibold text-[#d4a017] tracking-[0.2em]">
                ERROR
              </p>
              <p className="text-6xl sm:text-7xl font-black leading-none">404</p>
              <p className="mt-2 text-sm text-white/70">Lost in the forest</p>
            </div>
          </div>
          <div className="absolute -z-10 -inset-6 rounded-full bg-[#d4a017]/15 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
