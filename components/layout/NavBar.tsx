"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TopHeader from "./TopHeader";

type FlatLink = { href: string; label: string };

type FlatDropdown = {
  type: "flat";
  title: string;
  subtitle?: string;
  columns: { heading?: string; links: FlatLink[] }[];
};

type SectionedDropdown = {
  type: "sectioned";
  title: string;
  sections: {
    subtitle: string;
    links: { href: string; label: string }[];
  }[];
};

type NavItem = {
  label: string;
  dropdown: FlatDropdown | SectionedDropdown;
};

const navItems: NavItem[] = [
  {
    label: "ABOUT",
    dropdown: {
      type: "flat",
      title: "About YASCON",
      subtitle: "Empowering communities through conservation since 2005",
      columns: [
        {
          heading: "Who We Are",
          links: [
            { href: "/", label: "Home" },
            { href: "/about/mission", label: "Vision & Mission" },
            { href: "/about/objectives", label: "Objectives" },
            { href: "/about/location", label: "Where We Work" },
            { href: "/about/work", label: "Our Work" },
          ],
        },
        {
          heading: "Get Involved",
          links: [
            { href: "/about/management", label: "Our Team" },
            { href: "/about/our-story", label: "Our Story" },
            { href: "/impact/national/partners", label: "Partners" },
            { href: "/contact", label: "Contact Us" },
          ],
        },
      ],
    },
  },
  {
    label: "NATIONAL",
    dropdown: {
      type: "flat",
      title: "National Office",
      subtitle: "Coordinating conservation at the highest level",
      columns: [
        {
          heading: "Governance",
          links: [
            { href: "/impact/national/board", label: "Board" },
            { href: "/about/management", label: "Management" },
            { href: "/impact/national/programs", label: "Programs" },
          ],
        },
        {
          heading: "Impact",
          links: [
            { href: "/impact/national/statistics", label: "Statistics" },
            { href: "/impact/national/reports", label: "Annual Reports" },
          ],
        },
      ],
    },
  },
  {
    label: "REGIONS",
    dropdown: {
      type: "flat",
      title: "Regional Hubs",
      subtitle: "Local impact across all four corners of Malawi",
      columns: [
        {
          heading: "Northern & Central",
          links: [
            { href: "/impact/northern", label: "Northern Region" },
            { href: "/impact/central", label: "Central Region" },
          ],
        },
        {
          heading: "Southern & Eastern",
          links: [
            { href: "/impact/southern", label: "Southern Region" },
            { href: "/impact/eastern", label: "Eastern Region" },
          ],
        },
      ],
    },
  },
  {
    label: "ENTERPRISE",
    dropdown: {
      type: "sectioned",
      title: "Enterprises",
      sections: [
        {
          subtitle: "YASCON LTD",
          links: [
            { href: "/enterprises/yascon/ecotourism", label: "Eco-tourism" },
            {
              href: "/enterprises/yascon/livestock-production",
              label: "Livestock Production",
            },
            {
              href: "/enterprises/yascon/crop-production",
              label: "Crop Production",
            },
            {
              href: "/enterprises/yascon/fertilizer",
              label: "Fertilizer Production",
            },
            { href: "/enterprises/yascon/retailing", label: "Retailing" },
            { href: "/enterprises/yascon/research", label: "Research" },
            {
              href: "/enterprises/yascon/project-implmentation",
              label: "Project Implementation",
            },
            { href: "/enterprises/yascon/engineering", label: "Engineering" },
          ],
        },
        {
          subtitle: "Other Enterprises",
          links: [
            {
              href: "/enterprises/other/other-enterprises",
              label: "Other Enterprises",
            },
          ],
        },
      ],
    },
  },
  {
    label: "NEWSROOM",
    dropdown: {
      type: "flat",
      title: "Stay Informed",
      subtitle: "News, stories and media from across our network",
      columns: [
        {
          heading: "News & Media",
          links: [
            { href: "/news", label: "National News" },
            { href: "/news/regions", label: "Regional Stories" },
            { href: "/news/press-releases", label: "Press Releases" },
          ],
        },
        {
          heading: "Publications",
          links: [
            { href: "/news/statements", label: "Statements" },
            { href: "/news/gallery", label: "Gallery" },
            { href: "/careers", label: "Careers" },
          ],
        },
      ],
    },
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHome = pathname === "/";
  const useTransparentStyle = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleMouseEnter = (idx: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(idx);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  return (
    <section>
      <TopHeader />
      <nav
        className={`w-full left-0 right-0 transition-all duration-300 bg-green-900 ${
          scrolled ? "fixed top-0 z-[9999] shadow-xl" : ""
        } h-20`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-14 h-14">
              <Image
                src="/Log.png"
                alt="YASCON Logo"
                fill
                sizes="56px"
                className="object-contain rounded-full"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold tracking-[0.2em] text-sm text-white leading-none">
                YASCON
              </div>
              <div className="text-[10px] text-white/60 leading-tight max-w-[170px] mt-0.5 font-light tracking-wide">
                Youth Association for Conservation of Nature and Environment
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex items-center">
            {navItems.map((item, idx) => (
              <div key={idx} className="relative">
                <button
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px]   font-bold tracking-[0.12em] uppercase transition-all relative
                    ${activeDropdown === idx ? "text-[#f4a32a]" : "text-white/90 hover:text-white"}`}
                  onMouseEnter={() => handleMouseEnter(idx)}
                  onClick={() => handleMouseEnter(idx)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.label}
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === idx ? "rotate-180" : "text-white/50"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <span
                    className={`absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#f4a32a] transition-all duration-200 origin-left
                    ${activeDropdown === idx ? "scale-x-100" : "scale-x-0"}`}
                  />
                </button>

                {/* Dropdown panel */}
                {activeDropdown === idx && (
                  <div
                    className="absolute top-full z-50 mega-in  "
                    style={{
                      left: "50%",
                      transform: "translateX(-50%)",
                      minWidth: "520px",
                    }}
                    onMouseEnter={() => {
                      if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="h-2" />
                    {item.dropdown.type === "flat" ? (
                      <FlatMegaMenu dropdown={item.dropdown} />
                    ) : (
                      <SectionedMegaMenu dropdown={item.dropdown} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── CTA Buttons ── */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/donate"
              className="bg-[#f5a524] text-white text-[11px] font-bold px-4 py-2.5 tracking-wider uppercase rounded-sm hover:bg-[#e3910c] transition-colors"
            >
              Donate
            </Link>
            <Link
              href="/partner-us"
              className="border border-white/30 text-white/90 text-[11px] font-bold px-4 py-2.5 tracking-wider uppercase rounded-sm hover:border-white hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Partner Us
            </Link>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span
                className={`block h-0.5 bg-white rounded transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 bg-white rounded transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 bg-white rounded transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[9998] bg-[#0f1f0f] overflow-y-auto lg:hidden">
          {/* Mobile header */}
          <div className="sticky top-0 bg-[#0f1f0f] border-b border-white/10 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/Log.png"
                  alt="YASCON"
                  fill
                  sizes="40px"
                  className="object-contain rounded-full"
                />
              </div>
              <div>
                <div className="font-bold tracking-widest text-white text-xs">
                  YASCON
                </div>
                <div className="text-[10px] text-white/40">
                  Conservation & Environment
                </div>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile nav items */}
          <div className="px-5 py-4 space-y-1">
            {navItems.map((item, idx) => (
              <div key={idx} className="border-b border-white/5 last:border-0">
                <button
                  className="w-full flex items-center justify-between py-4"
                  onClick={() =>
                    setMobileExpanded(mobileExpanded === idx ? null : idx)
                  }
                >
                  <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/90">
                    {item.label}
                  </span>
                  <svg
                    className={`w-4 h-4 text-white/40 transition-transform duration-200 ${mobileExpanded === idx ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {mobileExpanded === idx && (
                  <div className="pb-4">
                    {item.dropdown.type === "flat" ? (
                      <div className="grid grid-cols-2 gap-x-4">
                        {item.dropdown.columns.map((col, ci) => (
                          <div key={ci}>
                            {col.heading && (
                              <p className="text-[10px] font-bold uppercase tracking-widest text-green-400/70 mb-2">
                                {col.heading}
                              </p>
                            )}
                            {col.links.map((link, li) => (
                              <Link
                                key={li}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block py-2 text-sm text-white/70 hover:text-white transition-colors"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-x-4">
                        {item.dropdown.sections.map((section, si) => (
                          <div key={si}>
                            <p
                              className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
                                si === 0 ? "text-green-400" : "text-amber-400"
                              }`}
                            >
                              {section.subtitle}
                            </p>
                            {section.links.map((link, li) => (
                              <Link
                                key={li}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block py-2 text-sm text-white/70 hover:text-white transition-colors"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile CTAs */}
          <div className="px-5 pb-10 pt-4 flex flex-col gap-3">
            <Link
              href="/donate"
              onClick={() => setMobileOpen(false)}
              className="text-center bg-[#f5a524] text-white py-3.5 rounded-sm font-bold text-sm tracking-widest uppercase hover:bg-[#e3910c] transition-colors"
            >
              Donate Now
            </Link>
            <Link
              href="/partner-us"
              onClick={() => setMobileOpen(false)}
              className="text-center border border-white/20 text-white/80 py-3.5 rounded-sm font-bold text-sm tracking-widest uppercase hover:bg-white/5 hover:text-white transition-colors"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes megaIn {
          from {
            opacity: 0;
            transform: translateY(-6px) translateX(-50%);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }
        .mega-in {
          animation: megaIn 0.15s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

function FlatMegaMenu({ dropdown }: { dropdown: FlatDropdown }) {
  return (
    <div className="bg-white shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className=" px-6 py-3.5 ">
        <p className="text-gray-900 font-bold text-xs tracking-widest uppercase">
          {dropdown.title}
        </p>
      </div>

      {/* 2-column grid */}
      <div
        className={`grid ${dropdown.columns.length === 2 ? "grid-cols-2 divide-x divide-gray-100" : "grid-cols-1"}`}
      >
        {dropdown.columns.map((col, ci) => (
          <div key={ci} className="p-5 border-t border-gray-100 ">
            <div className="space-y-0.5">
              {col.links.map((link, li) => (
                <Link
                  key={li}
                  href={link.href}
                  className="block px-2 py-2.5 rounded border-b border-gray-100 hover:bg-green-50 transition-colors group hover:border-l-4  hover:border-green-500"
                >
                  <div className="text-sm font-normal  text-shadow-gray-500">
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-100 px-6 py-2.5 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">
          YASCON — Conservation & Environment
        </span>
        <Link
          href="/contact"
          className="text-[11px] text-green-700 font-semibold hover:text-green-900 flex items-center gap-1"
        >
          Contact us
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function SectionedMegaMenu({ dropdown }: { dropdown: SectionedDropdown }) {
  return (
    <div className="bg-white shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className=" px-6 py-3.5 flex items-center justify-between border-b border-gray-100">
        <p className="text-gray-900 font-bold text-xs tracking-widest uppercase mt-0.5">
          Social enterprises
        </p>
      </div>

      {/* 2-column sections */}
      <div className="grid grid-cols-2 divide-x divide-gray-100">
        {dropdown.sections.map((section, si) => (
          <div key={si} className="p-5">
            {/* Section label */}
            <p
              className={`text-[10px] font-bold uppercase tracking-widest mb-3 pb-2 border-b ${
                si === 0
                  ? "text-green-700 border-green-100"
                  : "text-amber-600 border-amber-100"
              }`}
            >
              {section.subtitle}
            </p>
            <div className="space-y-0.5 ">
              {section.links.map((link, li) => (
                <Link
                  key={li}
                  href={link.href}
                  className="block px-2 py-2.5 rounded hover:bg-green-50 transition-colors group border-b border-gray-100 hover:border-l-4  hover:border-green-500"
                >
                  <div className="text-sm font-normal text-gray-800 group-hover:text-green-800">
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-100 px-6 py-2.5 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">
          Building a sustainable economy for Malawi
        </span>
      </div>
    </div>
  );
}


