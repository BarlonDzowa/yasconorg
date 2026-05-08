import Link from "next/link";
import Image from "next/image";

const givingOptions = [
  {
    title: "Project Sponsorship",
    desc: "Fund a specific reforestation, youth training, or biodiversity project with clear milestones and transparent reporting.",
    cta: "Sponsor a project",
  },
  {
    title: "Monthly Giving",
    desc: "Join a circle of recurring supporters powering seedlings, tools, and youth-led conservation actions in every season.",
    cta: "Set up monthly support",
  },
  {
    title: "In-Kind Support",
    desc: "Donate seedlings, field gear, media space, or technical expertise that keeps our teams effective on the ground.",
    cta: "Offer in-kind help",
  },
];

const impactHighlights = [
  {
    label: "28 District Footprint",
    detail: "Youth clubs activated across Malawi with local leadership.",
  },
  {
    label: "Community First",
    detail: "Programs co-designed with schools, chiefs, and cooperatives.",
  },
  {
    label: "Verified Outcomes",
    detail: "We track seedlings raised, hectares restored, and club members trained.",
  },
];

export default function DonatePage() {
  return (
    <main className="bg-[#f7f3f0] text-[#1a2e1a] text-[#1a2e1a]">
        <div className="fixed inset-0 -z-10">
              <Image
                src="/team/river-forest.avif"
                alt=""
                fill
                className="object-cover object-center"
                priority
              />
              {/* Heavy dark overlay so cards are always readable */}
              <div className="absolute inset-0 bg-[#0d1a0e]/80" />
            </div>
      
      {/* Hero */}
      <section className="relative overflow-hidden bg-[url('/team/river-forest.avif')] bg-cover bg-center text-white  px-4">
        <div className="absolute inset-0">
          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#d4a017]/20 blur-3xl" />
          <div className="absolute left-10 bottom-[-12%] h-72 w-72 rounded-full bg-[#52b788]/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_45%)]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#d4a017]">
            <span className="h-px w-8 bg-[#d4a017]" />
            Donate
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-5 leading-tight">
            Fuel youth-led conservation and restoration across Malawi.
          </h1>
          <p className="text-white/80 text-lg max-w-3xl">
            Your gift equips young people with seedlings, training, and tools
            to restore forests, protect biodiversity, and strengthen climate
            resilience in communities that depend on healthy ecosystems.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
            <Link
              href="#pledge"
              className="bg-[#d4a017] text-[#0f1a0f] font-semibold px-6 py-3 rounded-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              Make a pledge
            </Link>
            <Link
              href="/contact"
              className="border border-white/40 text-white font-semibold px-6 py-3 rounded-sm hover:bg-white/10 transition-all hover:-translate-y-0.5"
            >
              Talk to our team
            </Link>
          </div>
        </div>
      </section>

      {/* Giving options */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4a017]">
            Ways to give
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
            Choose how you want to power the mission.
          </h2>
          <p className="text-[#2e3d35]">
            Whether you represent a company, foundation, or family, we will
            align your support with measurable impact and clear stewardship.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {givingOptions.map((option) => (
            <article
              key={option.title}
              className="bg-white rounded-lg shadow-lg border border-[#ede8d8] p-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl transition duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-[#f2f6f3] border border-[#d4a017]/30 flex items-center justify-center text-[#d4a017] font-bold">
                  *
                </span>
                <h3 className="text-lg font-bold text-[#1a2e1a]">
                  {option.title}
                </h3>
              </div>
              <p className="text-[#4a5a4a] flex-1">{option.desc}</p>
              <span className="text-sm font-semibold text-[#1a2e1a]">
                {option.cta} &rarr;
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* Impact */}
      <section className="bg-white py-14 md:py-16 border-t border-[#ede8d8]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {impactHighlights.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-[#ede8d8] p-6 shadow-sm bg-[#f9f7f1]"
            >
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d4a017] mb-2">
                {item.label}
              </p>
              <p className="text-[#2e3d35]">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pledge form */}
      <section
        id="pledge"
        className="max-w-5xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-5 gap-10 items-start"
      >
        <div className="md:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4a017]">
            Pledge
          </p>
          <h3 className="text-3xl font-bold mt-3 mb-4 text-[#1a2e1a]">
            Share your intent to give.
          </h3>
          <p className="text-[#4a5a4a] mb-4">
            Tell us about your preferred amount, timeline, and any reporting
            requirements. A team member will follow up with bank, mobile money,
            or invoicing details.
          </p>
          <ul className="space-y-2 text-sm text-[#2e3d35]">
            <li>- Receipts and acknowledgements provided on request.</li>
            <li>- Restricted and unrestricted gifts are welcome.</li>
            <li>- We can align with your ESG or CSR priorities.</li>
          </ul>
        </div>

        <div className="md:col-span-3 bg-white border border-[#ede8d8] rounded-lg shadow-lg p-6">
          <form className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-[#1a2e1a]">
                Full name
              </label>
              <input
                type="text"
                className="w-full border border-[#dfe4dc] rounded-md px-3 py-3 focus:ring-2 focus:ring-[#52b788] focus:outline-none"
                placeholder="Your name"
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
                Organisation (optional)
              </label>
              <input
                type="text"
                className="w-full border border-[#dfe4dc] rounded-md px-3 py-3 focus:ring-2 focus:ring-[#52b788] focus:outline-none"
                placeholder="Company / foundation"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1a2e1a]">
                Gift type
              </label>
              <select className="w-full border border-[#dfe4dc] rounded-md px-3 py-3 bg-white focus:ring-2 focus:ring-[#52b788] focus:outline-none">
                <option>One-time</option>
                <option>Monthly</option>
                <option>Project sponsorship</option>
                <option>In-kind</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1a2e1a]">
                Preferred amount (optional)
              </label>
              <input
                type="text"
                className="w-full border border-[#dfe4dc] rounded-md px-3 py-3 focus:ring-2 focus:ring-[#52b788] focus:outline-none"
                placeholder="e.g. MWK, USD"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-[#1a2e1a]">
                Notes or restrictions
              </label>
              <textarea
                rows={4}
                className="w-full border border-[#dfe4dc] rounded-md px-3 py-3 focus:ring-2 focus:ring-[#52b788] focus:outline-none"
                placeholder="Share focus areas, timelines, or reporting needs."
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <input id="consent" type="checkbox" className="h-4 w-4" />
              <label htmlFor="consent" className="text-sm text-[#2e3d35]">
                I agree to be contacted by the YASCON team about this pledge.
              </label>
            </div>
            <button
              type="submit"
              className="md:col-span-2 bg-[#1a2e1a] text-white font-semibold py-3 rounded-sm hover:bg-[#0f1a0f] transition-colors"
            >
              Submit pledge
            </button>
          </form>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-gradient-to-r from-[#1a2e1a] to-[#2d4a2d] text-white py-14">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4a017]">
              Partner in impact
            </p>
            <h3 className="text-2xl md:text-3xl font-bold mt-2">
              Want to co-design a campaign or multi-year grant?
            </h3>
            <p className="text-white/80 mt-2">
              We will tailor a stewardship plan with updates, site visits, and
              stories from youth leaders.
            </p>
          </div>
          <Link
            href="/partner-us"
            className="bg-[#d4a017] text-[#0f1a0f] font-semibold px-6 py-3 rounded-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Explore partnerships
          </Link>
        </div>
      </section>
    </main>
  );
}
