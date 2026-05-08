"use client";
import Image from "next/image";
import Link from "next/link";


const works = [
  { title: "Biodiversity Conservation", description: "Protecting Malawi's rich biodiversity by safeguarding forest reserves, conserving native species, and restoring degraded ecosystems through youth-led field programs.", image: "/our-work/work1.avif", href: "/work/conservation", icon: "🌿", num: "01" },
  { title: "Tree Planting Campaigns",   description: "Mobilizing youth clubs across all 28 districts to plant indigenous trees, combat deforestation, and restore watersheds critical to Malawi's water and food security.", image: "/our-work/work2.avif", href: "/work/tree-planting", icon: "🌱", num: "02" },
  { title: "Environmental Education",   description: "Equipping young people with conservation knowledge through school programs, community workshops, and hands-on environmental learning experiences.", image: "/our-work/work3.avif", href: "/work/education", icon: "📚", num: "03" },
  { title: "Community Development",     description: "Building sustainable livelihoods by integrating environmental stewardship with community development, ensuring conservation benefits reach local families.", image: "/our-work/work1.avif", href: "/work/community", icon: "🤝", num: "04" },
  { title: "Climate Action",            description: "Advocating for climate justice, raising awareness about climate change impacts on Malawi, and empowering youth to become climate champions.", image: "/our-work/work2.avif", href: "/work/climate", icon: "🌍", num: "05" },
  { title: "Research & Monitoring",     description: "Conducting grassroots environmental research, monitoring ecosystem health, and generating data that informs conservation policy at national level.", image: "/our-work/work3.avif", href: "/work/research", icon: "🔬", num: "06" },
];

export default function OurWork() {
  return (
    <section id="work" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4a017]">What We Do</span>
    
            <h2 className="text-3xl md:text-5xl font-bold text-[#1a2e1a] mt-3 mb-4 ">Our Work
            </h2>
          
         
          <p className="text-base text-[#4a5a4a] max-w-2xl mx-auto">From tree planting campaigns to biodiversity conservation, YASCON leads youth-driven environmental initiatives across all districts of Malawi.</p>
          <div className="w-11 h-[3px] bg-[#d4a017] mt-5 mx-auto rounded-sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work, idx) => (
            <div key={idx} className="group block">
              <div className="relative h-48 overflow-hidden">
                <Image src={work.image} alt={work.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-[rgba(10,18,10,0.7)] to-transparent" />
               </div>
              <div className="p-5">
                <Link href={work.href} className="text-xl font-bold text-gray-900 mb-3 block hover:text-green-700 transition-colors">{work.title}</Link>
                <p className="text-sm text-[#6a7a6a] mb-4 leading-relaxed">{work.description}</p>
                <Link href={work.href} className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">Learn more →</Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/work" className="bg-green-600 text-white font-semibold px-8 py-3 rounded-sm hover:bg-green-700 transition-shadow shadow-md hover:shadow-lg">
            View All Programs
          </Link>
        </div>
      </div>
    </section>
  );
}
