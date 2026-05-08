"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const ACCENT = "#b8860b";
const heroImages = [
  "/Images/Eastern1.png",
  "/Images/Eastern2.png",
  "/Images/Eastern3.jpg",
];

const stats = [
  { value: 6, suffix: "", label: "Districts", desc: "Under Northern Coverage" },
  {
    value: 7,
    suffix: "",
    label: "Consultation Meetings",
    desc: "Community Consultations Held",
  },
  {
    value: 96,
    suffix: "",
    label: "Youth Meetings",
    desc: "Youth Engagement Sessions",
  },
  {
    value: 191,
    suffix: "",
    label: "Conservation Clubs",
    desc: "Active Clubs in Northern Region",
  },
  {
    value: 4641,
    suffix: "",
    label: "Youths Registered",
    desc: "Registered Under YASCON",
  },
  {
    value: 2,
    suffix: "",
    label: "Capacity Building Trainings",
    desc: "Training Sessions Facilitated",
  },
  {
    value: 6,
    suffix: "",
    label: "Clean-Up Campaigns",
    desc: "Campaigns Facilitated",
  },
  {
    value: 22,
    suffix: "",
    label: "Conservation Talks",
    desc: "Awareness Talks Delivered",
  },
  {
    value: 1,
    suffix: "",
    label: "Stakeholder Meetings",
    desc: "Key Stakeholder Engagements",
  },
  {
    value: 59,
    suffix: "",
    label: "Tree Nurseries",
    desc: "Nurseries Established",
  },
  {
    value: 599,
    suffix: "",
    label: "Tree Seedlings Raised",
    desc: "Seedlings Grown for Planting",
  },
  {
    value: 1697,
    suffix: "",
    label: "Trees Planted",
    desc: "Trees Successfully Planted",
  },
  {
    value: 66,
    suffix: "",
    label: "Village Forest Areas",
    desc: "Community Forest Areas Created",
  },
  {
    value: 22,
    suffix: "",
    label: "Forest Regeneration Areas",
    desc: "Areas Under Active Management",
  },
];

const districts = [
  {
    name: "Mzimba",
    coordinator: "James Zgambo",
    activities: 20,
    trees: 3500,
    members: 360,
  },
  {
    name: "Rumphi",
    coordinator: "Lucia Mwale",
    activities: 14,
    trees: 2600,
    members: 290,
  },
  {
    name: "Nkhata Bay",
    coordinator: "Thomas Gondwe",
    activities: 11,
    trees: 2100,
    members: 240,
  },
  {
    name: "Karonga",
    coordinator: "James Zgambo",
    activities: 9,
    trees: 1700,
    members: 210,
  },
  {
    name: "Chitipa",
    coordinator: "Lucia Mwale",
    activities: 7,
    trees: 1200,
    members: 160,
  },
  {
    name: "Likoma",
    coordinator: "Thomas Gondwe",
    activities: 5,
    trees: 700,
    members: 80,
  },
];

const team = [
  {
    name: "Martha Megan Phiri",
    initials: "MP",
    role: "Regional Coordinator (Northern)",
    district: "Northern Region",
    image: "/teampics/northern-coordinator.png",
    bio: "Martha holds a Bachelor of Science Degree in Development Studies from University of Livingstonia.Prior to joining YASCON, she worked as a Facilitator and Documenter for an Agroecology project under Chitipa District Council.  Martha successfully led and implemented YASCON's conservation activities in the Northern region of Malawi as an Area Conservation ",
  },
];

const activities = [
  {
    title: "Nyika Plateau Buffer Zone Planting",
    date: "Jan 2025",
    district: "Rumphi",
    type: "Tree Planting",
    participants: 240,
    desc: "5,400 indigenous Miombo seedlings planted along Nyika National Park buffer zones to reduce encroachment and restore wildlife corridors.",
  },
  {
    title: "Mzuzu Urban Forest Walk",
    date: "Mar 2025",
    district: "Mzimba",
    type: "Awareness",
    participants: 160,
    desc: "City-wide conservation awareness walk with 16 secondary schools, covering urban heat, air quality, and green space benefits.",
  },
  {
    title: "Nkhata Bay Shoreline Restoration",
    date: "May 2025",
    district: "Nkhata Bay",
    type: "Tree Planting",
    participants: 175,
    desc: "4 km of Lake Malawi shoreline replanted with native riparian species to protect fish breeding habitat and reduce bank erosion.",
  },
  {
    title: "Karonga Border Agroforestry Workshop",
    date: "Jul 2025",
    district: "Karonga",
    type: "Workshop",
    participants: 195,
    desc: "Smallholder farmers trained on agroforestry integration — combining food crops with nitrogen-fixing tree species to improve soil fertility.",
  },
  {
    title: "Chitipa Highland Clean-Up Drive",
    date: "Sep 2025",
    district: "Chitipa",
    type: "Clean-Up",
    participants: 140,
    desc: "Cross-border clean-up along the Malawi-Tanzania-Zambia tri-border area, removing plastic waste from highland water catchments.",
  },
  {
    title: "Northern Region Annual Summit",
    date: "Nov 2025",
    district: "Mzimba",
    type: "Workshop",
    participants: 280,
    desc: "Annual gathering of all 29 Northern Region club coordinators to review year statistics and plan the upcoming conservation season.",
  },
];

const whereWeWork = [
  {
    district: "Mzimba",
    description:
      "Malawi's largest district by area — Miombo woodland restoration, urban greening in Mzuzu city, and school eco-club networks are the primary focus.",
    highlight: "3,500 trees planted",
  },
  {
    district: "Rumphi",
    description:
      "Gateway to Nyika Plateau — buffer zone reforestation and wildlife corridor conservation protect Malawi's highest and most biodiverse landscapes.",
    highlight: "Nyika buffer zone",
  },
  {
    district: "Nkhata Bay",
    description:
      "Northern lakeshore district — Lake Malawi shoreline restoration and aquatic habitat conservation support both biodiversity and fishing livelihoods.",
    highlight: "4 km shoreline",
  },
  {
    district: "Karonga",
    description:
      "Northern border district on the lakeshore — agroforestry integration and soil conservation address land degradation among smallholder farming communities.",
    highlight: "Agroforestry hub",
  },
  {
    district: "Chitipa",
    description:
      "Remote highland border district — cross-border conservation and catchment protection in the Malawi-Tanzania-Zambia tri-border highlands.",
    highlight: "Tri-border catchment",
  },
  {
    district: "Likoma",
    description:
      "Lake island district — unique island ecosystem conservation protecting endemic species and supporting sustainable fishing community livelihoods.",
    highlight: "Island conservation",
  },
];

const ourWork = [
  {
    title: "Miombo Woodland Restoration",
    icon: "🌳",
    desc: "Leading large-scale replanting of indigenous Miombo woodland species across degraded areas of Mzimba and Rumphi districts.",
  },
  {
    title: "Wildlife Corridor Protection",
    icon: "🐘",
    desc: "Maintaining buffer zones and green corridors linking Nyika National Park and Vwaza Marsh to protect wildlife migration routes.",
  },
  {
    title: "Lakeshore Habitat Conservation",
    icon: "🌊",
    desc: "Restoring native riparian vegetation along Lake Malawi's northern shoreline to protect fish breeding habitat and reduce erosion.",
  },
  {
    title: "Agroforestry Integration",
    icon: "🌱",
    desc: "Training smallholder farmers in Karonga and Chitipa on combining food crops with tree planting to restore soil health and increase income.",
  },
  {
    title: "School Eco-Club Networks",
    icon: "📚",
    desc: "Running active eco-clubs in schools across all 6 Northern Region districts, delivering conservation education to thousands of students.",
  },
  {
    title: "Cross-Border Conservation",
    icon: "🗺️",
    desc: "Coordinating with Tanzanian and Zambian youth conservation groups on shared highland catchment and border ecosystem protection.",
  },
];

const TYPE_COLORS: Record<string, string> = {
  "Tree Planting": "#2d7a2d",
  "Clean-Up": "#1a6b8a",
  Workshop: "#7a5c2d",
  Awareness: "#8a1a6b",
  Survey: "#2d5a7a",
};

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span
      className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm"
      style={{
        background: color + "22",
        color,
        border: `1px solid ${color}55`,
      }}
    >
      {text}
    </span>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-3xl md:text-4xl font-bold text-[#0f1a0f] leading-tight">
        {title}
      </h2>
      <div
        className="w-12 h-[3px] mt-3 rounded-full"
        style={{ background: ACCENT }}
      />
    </div>
  );
}

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const t0 = Date.now();
          const tick = () => {
            const p = Math.min((Date.now() - t0) / 2000, 1);
            setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ✅ UPDATED PartnersPanel with real partner data
function PartnersPanel() {
  return (
    <div>
      <SectionHeader title="Our Regional Partners" />
      <p className="text-[#2e3d35] mb-8">
        Partners supporting Nature and Environmental conservation in the Northern Region.
      </p>
      <div className="flex flex-wrap gap-6">
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
    </div>
  );
}

function TeamPanel() {
  return (
    <div>
      <SectionHeader title="Meet The Northern Region Team" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((m, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-72 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={m.image}
                alt={m.name}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  if (el.parentElement)
                    el.parentElement.innerHTML = `<div style="width:80px;height:80px;border-radius:50%;background:${ACCENT}22;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;color:${ACCENT}">${m.initials}</div>`;
                }}
              />
            </div>
            <div className="p-6">
              <Badge text={m.role} color={ACCENT} />
              <h3 className="font-bold text-[#0f1a0f] text-lg mt-3 mb-1">
                {m.name}
              </h3>
              <div className="text-xs font-semibold text-gray-500 mb-3">
                {m.district}
              </div>
              <p className="text-sm text-[#2e3d35] leading-relaxed">{m.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DistrictsPanel() {
  const totalActivities = districts.reduce((s, d) => s + d.activities, 0);
  const totalTrees = districts.reduce((s, d) => s + d.trees, 0);
  const totalMembers = districts.reduce((s, d) => s + d.members, 0);
  return (
    <div>
      <SectionHeader title="Districts Overview" />
      <div
        className="grid grid-cols-3 gap-4 mb-10 p-6 rounded-2xl"
        style={{ background: ACCENT }}
      >
        {[
          { label: "Total Activities", value: totalActivities },
          {
            label: "Total Trees Planted",
            value: totalTrees.toLocaleString() + "+",
          },
          { label: "Total Members", value: totalMembers },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="text-3xl font-black text-white">{value}</div>
            <div
              className="text-xs font-semibold uppercase tracking-wide mt-1"
              style={{ color: "#fdf0b0" }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {districts.map((d, i) => {
          const actPct = Math.round((d.activities / totalActivities) * 100);
          return (
            <div
              key={d.name}
              className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ border: "1.5px solid #e8d9a0" }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-[#0f1a0f] text-xl">
                    {d.name}
                  </h3>
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: ACCENT }}
                  >
                    {i + 1}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">{d.coordinator}</p>
                <div className="space-y-2">
                  {[
                    ["Activities", d.activities],
                    ["Trees Planted", d.trees.toLocaleString()],
                    ["Members", d.members],
                  ].map(([lbl, val]) => (
                    <div
                      key={String(lbl)}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600">{lbl}</span>
                      <span className="font-bold text-[#0f1a0f]">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Activity share</span>
                    <span>{actPct}%</span>
                  </div>
                  <div
                    className="w-full h-2 rounded-full"
                    style={{ background: "#f0e8c8" }}
                  >
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${actPct}%`, background: ACCENT }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WhereWeWorkPanel() {
  return (
    <div>
      <SectionHeader title="Where We Work" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {whereWeWork.map((w, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{ border: "1.5px solid #e8d9a0" }}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-black text-[#0f1a0f] text-xl">
                {w.district}
              </h3>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: ACCENT + "22", color: ACCENT }}
              >
                {w.highlight}
              </span>
            </div>
            <p className="text-sm text-[#2e3d35] leading-relaxed">
              {w.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OurWorkPanel() {
  return (
    <div>
      <SectionHeader title="Our Work" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ourWork.map((w, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{ border: "1.5px solid #e8d9a0" }}
          >
            <div className="text-4xl mb-4">{w.icon}</div>
            <h3 className="font-bold text-[#0f1a0f] text-lg mb-2">{w.title}</h3>
            <p className="text-sm text-[#2e3d35] leading-relaxed">{w.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivitiesPanel() {
  const [filter, setFilter] = useState("All");
  const types = ["All", ...Array.from(new Set(activities.map((a) => a.type)))];
  const filtered =
    filter === "All" ? activities : activities.filter((a) => a.type === filter);
  return (
    <div>
      <SectionHeader title="Regional Activities" />
      <div className="flex flex-wrap gap-2 mb-8">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className="px-4 py-2 rounded-sm text-sm font-semibold transition-all duration-200"
            style={
              filter === t
                ? { background: ACCENT, color: "#fff" }
                : { background: "#f3f4f6", color: "#374151" }
            }
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((a, i) => (
          <div
            key={i}
            className="bg-white overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            style={{ borderRadius: "20px", border: "1.5px solid #f0e8c8" }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Badge text={a.type} color={TYPE_COLORS[a.type] ?? ACCENT} />
                <span className="text-xs font-semibold text-gray-400">
                  {a.district}
                </span>
              </div>
              <h3 className="font-black text-[#0f1a0f] text-base leading-snug mb-2">
                {a.title}
              </h3>
              <p className="text-sm text-[#2e3d35] leading-relaxed mb-4">
                {a.desc}
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-semibold pt-4 border-t border-gray-100">
                <span>{a.date}</span>
                <span>{a.participants} participants</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsPanel() {
  return (
    <div>
      <SectionHeader title="Northern Region — By the Numbers" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-6 shadow-sm text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            style={{ borderRadius: "20px", border: "1.5px solid #f0e8c8" }}
          >
            <div className="text-4xl font-bold mb-2" style={{ color: ACCENT }}>
              <CountUp target={s.value} suffix={s.suffix} />
            </div>
            <div className="font-semibold text-[#0f1a0f] text-sm uppercase tracking-wide mb-1">
              {s.label}
            </div>
            <div className="text-xs text-gray-500">{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

type Tab =
  | "districts"
  | "whereWeWork"
  | "ourWork"
  | "activities"
  | "stats"
  | "team"
  | "partners";
const TABS: { id: Tab; label: string }[] = [
  { id: "districts", label: "Districts" },
  { id: "whereWeWork", label: "Where We Work" },
  { id: "ourWork", label: "Our Work" },
  { id: "activities", label: "Regional Activities" },
  { id: "stats", label: "Regional Statistics" },
  { id: "team", label: "Our Team" },
  { id: "partners", label: "Our Partners" },
];

export default function NorthernRegionPage() {
  const [activeTab, setActiveTab] = useState<Tab>("activities");
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentImage((prev) => (prev + 1) % heroImages.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-0">
      <div className="relative w-full h-svh min-h-[600px] overflow-hidden">
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            className={`slide ${idx === currentImage ? "active" : ""}`}
          >
            <div
              className="slide-bg"
              style={{ backgroundImage: `url('${img}')` }}
            />
            <div className="slide-overlay" />
            {idx === currentImage && (
              <div className="relative inset-0 flex items-center z-10 pt-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
                  <div className="max-w-2xl">
                    <div className="slide-label mb-5">
                      <span
                        className="inline-flex items-center gap-2 font-bold uppercase px-5 py-2.5"
                        style={{
                          background: "#c8961e",
                          color: "#fff",
                          borderRadius: "3px",
                          boxShadow: "0 4px 16px rgba(200,150,30,0.4)",
                          letterSpacing: "0.18em",
                          fontSize: "13px",
                        }}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                        YASCON Regional Hub
                      </span>
                    </div>
                    <h1 className="slide-h1 text-white text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] mb-6">
                      Northern Region
                    </h1>
                    <p
                      className="slide-sub mb-9 leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,.75)",
                        fontSize: "clamp(15px, 1.6vw, 17px)",
                        maxWidth: "520px",
                      }}
                    >
                      YASCON&apos;s Northern Region covers Mzimba, Rumphi,
                      Nkhata Bay, Karonga, Chitipa and Likoma — conserving
                      Miombo woodlands, highland plateaus, and Lake
                      Malawi&apos;s northern lakeshore ecosystems.
                    </p>
                    <div className="slide-btns flex flex-wrap gap-8">
                      {stats.slice(0, 4).map((s, i) => (
                        <div key={i} className="text-white">
                          <div className="text-3xl sm:text-4xl font-bold leading-none">
                            {s.value.toLocaleString()}
                            {s.suffix}
                          </div>
                          <div
                            className="text-xs uppercase tracking-widest mt-1"
                            style={{ color: "rgba(255,255,255,.55)" }}
                          >
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div
          className="absolute z-20 flex gap-2"
          style={{
            bottom: "120px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              className={`slider-dot ${idx === currentImage ? "active" : ""}`}
              onClick={() => setCurrentImage(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex overflow-x-auto scrollbar-hide px-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 flex-shrink-0"
              style={
                activeTab === tab.id
                  ? { borderColor: ACCENT, color: ACCENT }
                  : { borderColor: "transparent", color: "#111" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "districts" && <DistrictsPanel />}
        {activeTab === "whereWeWork" && <WhereWeWorkPanel />}
        {activeTab === "ourWork" && <OurWorkPanel />}
        {activeTab === "activities" && <ActivitiesPanel />}
        {activeTab === "stats" && <StatsPanel />}
        {activeTab === "team" && <TeamPanel />}
        {activeTab === "partners" && <PartnersPanel />}
      </div>
    </div>
  );
}