"use client";

const stories = [
  {
    description:
      "Youth Association for Conservation of Nature and Environment (YASCON) was established in 2025 in response to the growing impacts of climate change, environmental degradation, and biodiversity loss affecting vulnerable communities. The organization mobilizes young people as key agents of change in advancing sustainable development and climate resilience. Its work is aligned with the 2030 Agenda for Sustainable Development, with a focus on SDG 13 (Climate Action), SDG 15 (Life on Land), and SDG 6 (Clean Water and Sanitation).",
  },
  {
    description:
      "YASCON’s theory of change is grounded in the premise that strengthening youth capacity and leadership leads to improved environmental outcomes and increased community resilience. Through environmental education, community-based conservation, and nature-based solutions, the organization delivers measurable outputs that contribute to ecosystem restoration, climate change mitigation, and climate adaptation. Since its establishment, YASCON has implemented tree planting and ecosystem restoration initiatives in communities across Northern, Central, Eastern and Southern region translating global goals into tangible local impact.",
  },
  {
    description:
      "By working closely with communities, local authorities, and strategic partners, YASCON promotes local ownership, sustainability, and accountability of its interventions. The organization integrates monitoring, evaluation, and learning systems to inform adaptive management and align programs with national and international climate priorities, contributing to long-term environmental sustainability and a climate-resilient future.",
  },
];

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-white ">
      <section className="bg-transparent text-green-950 py-8 px-4 ">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4a017] bg-green-950 px-2 py-1 rounded-full">
          — Who We Are —
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Our Story</h1>
        <div className="w-11 h-[3px] bg-[#d4a017] mt-4  rounded-sm" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        <div>
               
          {stories.map((story, idx) => (
            <p key={idx} className="text-gray-600 leading-relaxed mb-6 text-base">
              {story.description}
            </p>
          ))}
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg h-full">
          <img src="/hero/hero2.avif" alt="Our team" className="w-full h-full object-cover rounded-xl" />
        </div>
      </section>
    </main>
  );
}