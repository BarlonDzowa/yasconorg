"use client";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="py-16 md:py-24 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-md shadow-lg overflow-hidden">
          <Image
            src="/about-us/about-us.avif"
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="YASCON youth conservation"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(15,26,15,0.45)] to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 bg-[rgba(10,18,10,0.8)] backdrop-blur-sm p-4 rounded-sm">
            <p className="text-white text-sm italic">
              &ldquo;Together, let&apos;s grow a greener future&rdquo;
            </p>
            <p className="text-xs text-[#d4a017] mt-1">
              — Mwai Mtayamanja, National Coordinator
            </p>
          </div>
        </div>

        {/* Content */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4a017]">
            Who We Are
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1a2e1a] mt-3 mb-5 leading-tight">
            Youth Leading the Charge for a Greener Malawi
          </h2>
          <div className="w-11 h-[3px] bg-[#d4a017] mb-6 rounded-sm" />
          <p className="text-base text-[#4a5a4a] mb-4 leading-relaxed">
            The Youth Association for Conservation of Nature and Environment
            (YASCON) is Malawi&apos;s premier youth-led conservation organization,
            uniting thousands of young people across all 28 districts in the
            fight to protect our natural heritage.
          </p>
          <p className="text-base text-[#4a5a4a] mb-8 leading-relaxed">
            Founded on the belief that young people are not just the leaders of
            tomorrow but the most energetic and creative force of today, YASCON
            empowers youth clubs to take direct conservation action.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/about/OurStory"
              className="bg-green-600 text-white font-semibold px-7 py-3 rounded-sm text-center hover:bg-green-700 transition-shadow shadow-md hover:shadow-lg"
            >
              Our Story
            </Link>
            <Link
              href="/contact"
              className="border-2 border-green-600 text-green-600 font-semibold px-7 py-3 rounded-sm text-center hover:bg-green-700 hover:text-white transition-shadow shadow-md hover:shadow-lg"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
