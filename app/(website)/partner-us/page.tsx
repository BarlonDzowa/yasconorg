import Link from "next/link";

const partnershipTracks = [
  {
    title: "Corporate & CSR",
    desc: "Co-design employee volunteering, ESG-aligned grants, or customer give-back campaigns that highlight measurable conservation outcomes.",
  },
  {
    title: "Foundations & Philanthropy",
    desc: "Fund youth leadership pipelines, climate resilience pilots, or long-term ecosystem restoration with rigorous learning agendas.",
  },
  {
    title: "Technical Partners",
    desc: "Bring expertise in GIS, nurseries, monitoring, renewable energy, or storytelling to strengthen community projects.",
  },
];

const steps = [
  "Share your focus areas and timeline.",
  "Map your objectives to our programs and regions.",
  "Co-create a plan with milestones and budgets.",
  "Launch with visibility, updates, and reporting.",
];

export default function PartnerUsPage() {
  return (
    <main className="bg-white text-[#1a2e1a]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f1a0f] via-[#1a2e1a] to-[#2d4a2d] text-white">
        <div className="absolute inset-0">
          <div className="absolute -left-16 top-10 h-64 w-64 rounded-full bg-[#52b788]/20 blur-3xl" />
          <div className="absolute right-[-10%] bottom-[-15%] h-80 w-80 rounded-full bg-[#d4a017]/18 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.08),transparent_45%)]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-24">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#d4a017]">
            <span className="h-px w-8 bg-[#d4a017]" />
            Partner with us
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-5 leading-tight">
            Let's build conservation solutions together.
          </h1>
          <p className="text-white/80 text-lg max-w-3xl">
            YASCON unites youth clubs, communities, and experts to protect
            Malawi's natural heritage. Partner with us to scale impact, test
            innovations, and spotlight youth leadership.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
            <Link
              href="#start"
              className="bg-[#d4a017] text-[#0f1a0f] font-semibold px-6 py-3 rounded-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              Start a conversation
            </Link>
            <Link
              href="/donate"
              className="border border-white/40 text-white font-semibold px-6 py-3 rounded-sm hover:bg-white/10 transition-all hover:-translate-y-0.5"
            >
              Explore giving
            </Link>
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4a017]">
            Partnership tracks
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
            Collaborate in the way that fits you best.
          </h2>
          <p className="text-[#2e3d35]">
            We align scope, geography, and reporting with your goals - from
            single-district pilots to multi-year national programs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {partnershipTracks.map((track) => (
            <article
              key={track.title}
              className="bg-[#f9f7f1] border border-[#ede8d8] rounded-lg p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition duration-200"
            >
              <h3 className="text-xl font-bold mb-3 text-[#1a2e1a]">
                {track.title}
              </h3>
              <p className="text-[#4a5a4a]">{track.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#0f1a0f] text-white py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#d4a017]">
            <span className="h-px w-8 bg-[#d4a017]" />
            How we work
          </div>
          <h3 className="text-3xl font-bold mt-3 mb-8">
            A clear path from idea to impact.
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((step, idx) => (
              <div
                key={step}
                className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-3"
              >
                <span className="h-10 w-10 rounded-full bg-[#d4a017]/20 text-[#d4a017] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <p className="text-sm text-white/85">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section
        id="start"
        className="max-w-5xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-start"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4a017]">
            Start here
          </p>
          <h3 className="text-3xl font-bold mt-3 mb-4 text-[#1a2e1a]">
            Tell us about your partnership idea.
          </h3>
          <p className="text-[#4a5a4a] mb-5">
            Share your objectives, regions of interest, and how you would like
            to engage. We will respond with next steps and a tailored proposal
            outline.
          </p>
          <ul className="space-y-2 text-sm text-[#2e3d35]">
            <li>- Youth clubs in all 28 districts are ready to collaborate.</li>
            <li>- We provide site visits, reporting, and storytelling assets.</li>
            <li>- Co-branding and campaign activation available.</li>
          </ul>
        </div>

        <div className="bg-white border border-[#ede8d8] rounded-lg shadow-lg p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1a2e1a]">
                Name
              </label>
              <input
                type="text"
                className="w-full border border-[#dfe4dc] rounded-md px-3 py-3 focus:ring-2 focus:ring-[#52b788] focus:outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1a2e1a]">
                Organisation
              </label>
              <input
                type="text"
                className="w-full border border-[#dfe4dc] rounded-md px-3 py-3 focus:ring-2 focus:ring-[#52b788] focus:outline-none"
                placeholder="Company / foundation / agency"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1a2e1a]">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-[#dfe4dc] rounded-md px-3 py-3 focus:ring-2 focus:ring-[#52b788] focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1a2e1a]">
                Region or program interest
              </label>
              <input
                type="text"
                className="w-full border border-[#dfe4dc] rounded-md px-3 py-3 focus:ring-2 focus:ring-[#52b788] focus:outline-none"
                placeholder="e.g. Southern region, tree planting, youth jobs"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1a2e1a]">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full border border-[#dfe4dc] rounded-md px-3 py-3 focus:ring-2 focus:ring-[#52b788] focus:outline-none"
                placeholder="Share objectives, timelines, and any reporting needs."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1a2e1a] text-white font-semibold py-3 rounded-sm hover:bg-[#0f1a0f] transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f9f7f1] border-t border-[#ede8d8] py-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4a017]">
              Ready to collaborate
            </p>
            <h4 className="text-2xl font-bold mt-2 text-[#1a2e1a]">
              Prefer a quick call? We will schedule within two business days.
            </h4>
            <p className="text-[#4a5a4a] mt-2">
              You can also reach us through the contact page if you need a rapid
              response.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-[#d4a017] text-[#0f1a0f] font-semibold px-6 py-3 rounded-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}
