
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const videoData = [
  {
    id: 1,
    title: "YASCON IN LILONGWE",
    src: "/sloganvids/slogan1.mp4",
    description: "Empowering Youth. Protecting Nature. Shaping Tomorrow.",
    href: "https://web.facebook.com/reel/882274547883397/",
  },
  {
    id: 2,
    title: "YASCON IN MZUZU",
    src: "/sloganvids/slogan2.mp4",
    description: "Act Today. Sustain Tomorrow",
    href: "",
  },
  {
    id: 3,
    title: "YASCON IN BLANTYRE",
    src: "/sloganvids/slogan3.mp4",
    description: "The Change Begins With Us",
    href: "",
  },
];

export default function SloganVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="container mx-auto p-4" ref={containerRef}>
      <div className="mb-12 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4a017]">- Activities -</span>
        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">VIDEOS OF OUR TEAM</h2>
        <p className="text-base text-[#4a5a4a] max-w-2xl mx-auto text-center">
          We believe real change begins when young people take action for the planet. Driven by passion and purpose,
          we are restoring nature and building climate resilient communities. Together with the youth, we have planted
          trees in Mangochi,Blantyre, Lilongwe, and Mzuzu to protect our environment for future generations.
        </p>
        <div className="w-11 h-[3px] bg-[#d4a017] mt-5 mx-auto rounded-sm" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videoData.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 hover:scale-105">
            {shouldLoad ? (
              <video className="w-full h-48 object-cover" controls preload="metadata">
                <source src={video.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-48 bg-gray-200 animate-pulse" />
            )}
            <div className="p-4">
              <h2>
                <Link href={video.href} className="text-xl font-semibold text-gray-900 mb-3 block hover:text-green-700 transition-colors">
                  {video.title}
                </Link>
              </h2>
              <p className="text-gray-600 text-sm">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
