"use client";

import { useState, useEffect, useRef } from "react";

const ACCENT = "#b8860b";
const heroImages = [
  "/Images/Eastern1.png",
  "/Images/Eastern2.png",
  "/Images/Eastern3.jpg",
];

const stats = [
  {
    value: 11,
    suffix: "",
    label: "Districts",
    desc: "Under Southern Coverage",
  },
  {
    value: 8,
    suffix: "",
    label: "Consultation Meetings",
    desc: "Community Consultations Held",
  },
  {
    value: 95,
    suffix: "",
    label: "Youth Meetings",
    desc: "Youth Engagement Sessions",
  },
  {
    value: 191,
    suffix: "",
    label: "Conservation Clubs",
    desc: "Active Clubs in Southern Region",
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
    value: 58,
    suffix: "",
    label: "Tree Nurseries",
    desc: "Nurseries Established",
  },
  {
    value: 598,
    suffix: "",
    label: "Tree Seedlings Raised",
    desc: "Seedlings Grown for Planting",
  },
  {
    value: 1695,
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
    value: 21,
    suffix: "",
    label: "Forest Regeneration Areas",
    desc: "Areas Under Active Management",
  },
];

const districts = [
  {
    name: "Blantyre",
    coordinator: "Grace Chirwa",
    activities: 22,
    trees: 3800,
    members: 420,
  },
  {
    name: "Zomba",
    coordinator: "Patrick Msosa",
    activities: 16,
    trees: 2700,
    members: 310,
  },
  {
    name: "Mulanje",
    coordinator: "Esther Nkosi",
    activities: 13,
    trees: 2400,
    members: 280,
  },
  {
    name: "Thyolo",
    coordinator: "Grace Chirwa",
    activities: 10,
    trees: 1900,
    members: 240,
  },
  {
    name: "Chiradzulu",
    coordinator: "Patrick Msosa",
    activities: 8,
    trees: 1600,
    members: 200,
  },
  {
    name: "Phalombe",
    coordinator: "Esther Nkosi",
    activities: 7,
    trees: 1100,
    members: 160,
  },
  {
    name: "Nsanje",
    coordinator: "Grace Chirwa",
    activities: 6,
    trees: 700,
    members: 120,
  },
];

/*const partners = [
  { name: "Blantyre City Council",           type: "Government",          image: "/Images/Eastern1.png", desc: "Urban tree planting and green space restoration across Blantyre's high-density townships and industrial corridors." },
  { name: "Chancellor College – UNIMA",      type: "Academic",            image: "/Images/Eastern2.png", desc: "Research collaboration on forest biodiversity assessment and indigenous tree species propagation in Zomba Plateau." },
  { name: "WWF Malawi",                      type: "International NGO",   image: "/Images/Eastern3.png", desc: "Joint biodiversity conservation programming in Mulanje cedar forest and Thyolo tea estate buffer zones." },
  { name: "UNDP Malawi – Southern Office",   type: "Development Partner", image: "/Images/Eastern1.png", desc: "Climate resilience funding supporting community-based adaptation in flood-prone Nsanje and Phalombe lowlands." },
  { name: "Department of Forestry – South", type: "Government",          image: "/Images/Eastern2.png", desc: "Seedling nursery support and technical guidance for cedar and indigenous species reforestation on Mulanje Mountain." },
  { name: "ActionAid Malawi",                type: "NGO",                 image: "/Images/Eastern333.jpg", desc: "Gender and youth inclusion framework ensuring equitable participation of girls in Southern Region conservation clubs." },
  { name: "USAID SCOPE",                     type: "Development Partner", image: "/Images/Eastern1.png", desc: "Sustainable conservation and productivity enhancement — funding riparian zone restoration along the Shire River valley." },
  { name: "Tearfund Malawi",                 type: "NGO",                 image: "/Images/Eastern2.png", desc: "Community disaster risk reduction and environmental stewardship programmes in Nsanje's flood-vulnerable communities." },
  { name: "Malawi Tourism Authority",        type: "Government",          image: "/Images/Eastern33.jpg", desc: "Eco-tourism and conservation awareness initiatives promoting Mulanje Mountain and Zomba Plateau as green heritage sites." },
];*/

const team = [
  {
    name: "Bridget Namakhwa",
    initials: "BN",
    role: "Regional Coordinator (Southern)",
    district: "Southern Region",
    image: "/teampics/southern-coordinator.png",
    bio: "Bridget holds a Bachelor of Science Degree in Education, majoring in Geography from the Catholic University of Malawi and a certificate in Introduction to Child Protection.She initially served as a Conservation Coordinator when she successfully led and implemented YASCON's conservation activities in the Southern region of Malawi.Bridget, a passionate and enthusiastic youth brings to the organisation proven communication, community mobilization, organisation, project management, leadership and coordination skills.",
  },
];

const activities = [
  {
    title: "Mulanje Cedar Restoration Drive",
    date: "Feb 2025",
    district: "Mulanje",
    type: "Tree Planting",
    participants: 260,
    desc: "6,200 cedar seedlings planted across degraded sections of Mulanje Mountain Forest Reserve in partnership with the Department of Forestry.",
  },
  {
    title: "Shire River Riparian Clean-Up",
    date: "Apr 2025",
    district: "Nsanje",
    type: "Clean-Up",
    participants: 190,
    desc: "12 km of Shire River bank cleared of invasive species and plastic waste, restoring riparian vegetation critical for river health.",
  },
  {
    title: "Blantyre Urban Greening Campaign",
    date: "Jun 2025",
    district: "Blantyre",
    type: "Tree Planting",
    participants: 300,
    desc: "2,800 indigenous trees planted in 15 Blantyre townships, partnering with city council to restore urban green corridors.",
  },
  {
    title: "Thyolo Tea Belt Awareness Tour",
    date: "Aug 2025",
    district: "Thyolo",
    type: "Awareness",
    participants: 175,
    desc: "Conservation awareness roadshow across 8 tea estate communities, addressing pesticide runoff and shade tree management.",
  },
  {
    title: "Zomba Plateau Youth Summit",
    date: "Sep 2025",
    district: "Zomba",
    type: "Workshop",
    participants: 210,
    desc: "Annual Southern Region youth leadership summit focusing on forest governance, climate advocacy, and eco-tourism potential.",
  },
  {
    title: "Southern Region Conservation Congress",
    date: "Dec 2025",
    district: "Blantyre",
    type: "Workshop",
    participants: 340,
    desc: "Annual gathering of all 38 Southern Region club coordinators to review statistics and plan for the upcoming conservation season.",
  },
];

const whereWeWork = [
  {
    district: "Blantyre",
    description:
      "Malawi's commercial capital — urban greening, school eco-clubs, and industrial pollution awareness are the primary focus areas.",
    highlight: "3,800 trees planted",
  },
  {
    district: "Zomba",
    description:
      "Seat of Malawi's first capital — Zomba Plateau forest conservation and university partnership research are central activities.",
    highlight: "University hub",
  },
  {
    district: "Mulanje",
    description:
      "Home to Mulanje Mountain — cedar forest restoration and biodiversity protection are the flagship conservation priorities.",
    highlight: "Cedar restoration",
  },
  {
    district: "Thyolo",
    description:
      "Tea belt district — buffer zone conservation, shade tree planting, and pesticide runoff reduction programmes run year-round.",
    highlight: "Tea belt buffer",
  },
  {
    district: "Chiradzulu",
    description:
      "Densely populated highland district — community soil conservation and hillside reforestation address land degradation challenges.",
    highlight: "Hillside reforestation",
  },
  {
    district: "Phalombe",
    description:
      "Flood-prone lowland district — disaster risk reduction through reforestation and wetland restoration protects vulnerable communities.",
    highlight: "Flood risk reduction",
  },
  {
    district: "Nsanje",
    description:
      "Malawi's southernmost district at the Shire-Zambezi confluence — riparian restoration and wetland conservation are the key focus.",
    highlight: "12 km riverbank",
  },
];

const ourWork = [
  {
    title: "Mountain Forest Restoration",
    icon: "⛰️",
    desc: "Leading cedar and indigenous species replanting on Mulanje Mountain and Zomba Plateau — protecting Malawi's most iconic highland ecosystems.",
  },
  {
    title: "Urban Tree Planting",
    icon: "🏙️",
    desc: "Partnering with Blantyre City Council to restore urban canopy cover in townships, along roads, and on school grounds.",
  },
  {
    title: "Riparian Zone Restoration",
    icon: "🌊",
    desc: "Clearing invasive species and replanting native vegetation along the Shire River and its tributaries to protect water quality and river biodiversity.",
  },
  {
    title: "Eco-Club School Networks",
    icon: "📚",
    desc: "Running active eco-clubs in schools across all 7 Southern Region districts, embedding conservation education in secondary school culture.",
  },
  {
    title: "Disaster Risk Reforestation",
    icon: "🌱",
    desc: "Emergency reforestation on flood-damaged hillsides in Phalombe and Chiradzulu to stabilise soils and reduce community vulnerability.",
  },
  {
    title: "Climate Advocacy Training",
    icon: "📣",
    desc: "Building youth capacity to engage district councils, NGOs, and national policymakers on Southern Region environmental governance priorities.",
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

function PartnersPanel() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 mt-20">
      Partners page coming soon!
    </div>
  );
  /*return (
    <div>
      <SectionHeader title="Our Regional Partners" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((p, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).parentElement!.innerHTML = `<div style="width:64px;height:64px;border-radius:50%;background:${ACCENT}22;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;color:${ACCENT}">${p.name.charAt(0)}</div>`; }} />
            </div>
            <div className="p-6">
              <Badge text={p.type} color={ACCENT} />
              <h3 className="font-bold text-[#0f1a0f] text-lg mt-3 mb-2">{p.name}</h3>
              <p className="text-sm text-[#2e3d35] leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );*/
}

function TeamPanel() {
  return (
    <div>
      <SectionHeader title="Meet The Southern Region Team" />
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
      <SectionHeader title="Southern Region — By the Numbers" />
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

export default function SouthernRegionPage() {
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
                      Southern Region
                    </h1>
                    <p
                      className="slide-sub mb-9 leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,.75)",
                        fontSize: "clamp(15px, 1.6vw, 17px)",
                        maxWidth: "520px",
                      }}
                    >
                      YASCON&apos;s Southern Region covers Blantyre, Zomba,
                      Mulanje, Thyolo, Chiradzulu, Phalombe and Nsanje —
                      protecting mountain forests, river valleys, and highland
                      ecosystems across Malawi&apos;s most populous region.
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
