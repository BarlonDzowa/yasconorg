"use client";
import Image from "next/image";

const profiles = [
  {
    title: "OUR VISION",
    description:
      "A world where young people lead in protecting, restoring, and sustaining nature and the environment for present and future generations.",
    image: "/hero/mission1.jpg",
  },
  {
    title: "OUR MISSION",
    description:
      "To empower youth to engage in nature and environmental conservation through education, advocacy, community action, and sustainable practices.",
    image: "/hero/her03.avif",
  },
  {
    title: "CORE VALUES",
    description:
      "Passion, Interest, Innovation, Integrity, Stewardship, Collaboration and Fun.",
    image: "/hero/mission3.jpg",
  },
];

export default function MissionPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#f3f7f2] to-white">
      <section className="relative overflow-hidden bg-[url(/hero/mission3.jpg)] bg-cover bg-center text-white py-24 px-4 text-center ">
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/10 " />

        <div className="relative max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#d4a017]  bg-[#1a2e1a]/[.8] px-3 py-2 rounded-full">
            <span className="h-px w-5 bg-[#d4a017] " />
            Profile
            <span className="h-px w-5 bg-[#d4a017]/60" />
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-5 drop-shadow-lg">
            Mission Statement
          </h1>
          
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              Education
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              Advocacy
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              Community Action
            </span>
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              Sustainability
            </span>
          </div>
          <div className="w-12 h-[3px] bg-[#d4a017] mt-8 mx-auto rounded-sm shadow-lg shadow-[#d4a017]/40" />
        </div>
      </section>
  <div className="text-5xl  text-[#d4a017] text-center font-bold mt-2"><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#d4a017] ">
            <span className="h-px w-5 bg-[#d4a017] " />
            Our Profiles
            <span className="h-px w-5 bg-[#d4a017]/60" />
          </span></div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {profiles.map((profile, idx) => (
            <div
              key={idx}
              className="group overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all bg-white/90 backdrop-blur-sm"
            >
              <div className="relative h-52 w-full">
                <Image
                  src={profile.image}
                  alt={profile.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f2610]/85 via-[#0f2610]/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-white font-bold text-lg tracking-wide drop-shadow">
                    {profile.title}
                  </span>
                </div>
              </div>
              <div className="p-6 border-t-4 border-[#2f9e44]">
                <p className="text-gray-700 leading-relaxed">
                  {profile.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
