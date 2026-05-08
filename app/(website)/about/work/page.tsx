"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const works = [
  {
    title: "Biodiversity Conservation",
    description:
      "Safeguarding forest reserves, conserving native species, and restoring degraded ecosystems through youth-led field programs.",
    image: "/our-work/work1.avif",
    href: "/work/conservation",
    num: "01",
  },
  {
    title: "Tree Planting Campaigns",
    description:
      "Mobilizing youth clubs across all 28 districts to plant indigenous trees and restore watersheds vital to Malawi's water and food security.",
    image: "/our-work/work2.avif",
    href: "/work/tree-planting",
    num: "02",
  },
  {
    title: "Environmental Education",
    description:
      "Equipping young people with conservation knowledge through school programs, community workshops, and hands-on environmental learning.",
    image: "/our-work/work3.avif",
    href: "/work/education",
    num: "03",
  },
  {
    title: "Community Development",
    description:
      "Linking environmental stewardship with livelihoods so conservation benefits reach local families.",
    image: "/our-work/work4.jpg",
    href: "/work/community",
    num: "04",
  },
  {
    title: "Climate Action",
    description:
      "Advocating for climate justice, spotlighting climate impacts on Malawi, and empowering youth to champion change.",
    image: "/our-work/work5.jpg",
    href: "/work/climate",
    num: "05",
  },
  {
    title: "Research & Monitoring",
    description:
      "Grassroots research and ecosystem monitoring that feeds evidence into national conservation policy.",
    image: "/our-work/work6.jpg",
    href: "/work/research",
    num: "06",
  },
];

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[url(/team/river-forest.avif)] bg-cover bg-center text-white bg-[#1a2e1a]  py-20 px-4 ">
        <div className="relative max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#d4a017] bg-[#1a2e1a]/80 px-3 py-2 rounded-full">
            <span className="h-px w-5 bg-[#d4a017]" />
            What We Do
            <span className="h-px w-5 bg-[#d4a017]/60" />
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-5 drop-shadow-lg">
            Our Work
          </h1>
          <p className=" md:text-lg ">
         From tree planting campaigns to biodiversity conservation, YASCON leads youth-driven environmental initiatives across all districts of Malawi.
          </p>
          <div className="w-11 h-[3px] bg-[#d4a017] mt-4  rounded-sm shadow-lg shadow-[#d4a017]/40" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative -mt-10 md:-mt-14 z-10">
        {/* opening section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 p-6 rounded-xl shadow-xl border-2 border-green-900 bg-white/95 backdrop-blur-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4a017]">
              Programs
            </p>
            <h2 className="text-2xl font-extrabold text-[#0f2610]">
              Every initiative advances our mission.
            </h2>
          </div>
          <p className="text-sm text-gray-600 max-w-xl">
            Discover how youth-led projects translate our mission into tangible
            impact across Malawi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((work) => (
            <article
              key={work.title}
              className="group overflow-hidden  hover:shadow-2xl hover:-translate-y-1 transition-all bg-white/90 backdrop-blur-sm"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 90vw"
                  priority={parseInt(work.num, 10) <= 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f2610]/85 via-[#0f2610]/45 to-transparent" />
               
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div>
                   
                    <span className="text-white font-bold text-lg tracking-wide drop-shadow">
                      {work.title}
                    </span>
                  </div>
                 
                </div>
              </div>
              <div className="p-6 border-t-4 border-[#2f9e44]">
                <p className="text-gray-700 leading-relaxed">{work.description}</p>
                <Link
                  href={work.href}
                  className="inline-block mt-4 text-[#2f9e44] font-semibold hover:underline"
                >
                  Learn More &rarr;
                </Link>
              </div>
               
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
