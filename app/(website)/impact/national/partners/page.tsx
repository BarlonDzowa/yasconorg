"use client";

import Link from "next/link";

export default function NationalPartners() {
  return (
    <section id="partners" className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-4xl font-bold text-[#1a2e1a]">Our Partners</h2>
      <div className="w-11 h-[3px] bg-[#d4a017] mt-5 rounded-sm" />
      <p className="text-[#2e3d35] mt-3 mb-6">
        National partners supporting Nature and Environmental conservation.
      </p>

      <div className="flex">
        <Link
          href="https://janemphambafoundation.org"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block w-72"
        >
          <div className="h-48 bg-black flex items-center justify-center overflow-hidden">
            <img
              src="/Images/JaneFundation.png"
              alt="Jane Mphamba Foundation"
              className="w-full h-full object-contain p-4"
            />
          </div>

          <div className="p-4">
            <h3 className="font-bold text-[#0f1a0f] text-base mb-1">
              Jane Mphamba Foundation
            </h3>
            <p className="text-xs font-semibold tracking-widest text-[#d4a017] uppercase mb-2">
              Featured Partner
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Empowering communities through sustainable environmental programs
              and conservation initiatives across Malawi.
            </p>
            <span className="text-xs text-blue-600">Visit website →</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
