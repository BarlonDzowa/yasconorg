"use client";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 50,    suffix: "+", label: "Youth Clubs",       desc: "Nationwide Network" },
  { value: 10000, suffix: "+", label: "Trees Planted",     desc: "Reforestation Impact" },
  { value: 28,    suffix: "",  label: "Districts Reached", desc: "All Across Malawi" },
  { value: 5000,  suffix: "+", label: "Active Members",    desc: "Youth Conservation Force" },
  { value: 15,    suffix: "+", label: "Years Active",      desc: "Since Foundation" },
  { value: 100,   suffix: "+", label: "Events Held",       desc: "Annual Programs" },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const elRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const p = Math.min((Date.now() - start) / 2000, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(eased * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    if (elRef.current) obs.observe(elRef.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={elRef}>{count.toLocaleString()}{suffix}</span>;
}

export default function Impact() {
  return (
    <section className="py-20 md:py-24 relative overflow-hidden bg-[#0f1a0f] text-white">
      {/* Subtle decorative gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-1/3 aspect-square rounded-full bg-[#d4a017]/5 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-1/3 aspect-square rounded-full bg-[#52b788]/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#d4a017]">
            Our Impact
          </span>
          <h2
            className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
          >
            Conservation by the Numbers
          </h2>
          <div className="w-12 h-1 bg-[#d4a017] mx-auto mt-6 rounded-full" />
          <p className="mt-6 text-base md:text-lg max-w-3xl mx-auto opacity-80">
            Driven by the energy and dedication of Malawian youth across the country.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="stat-tile text-center p-6 md:p-8 rounded-md border border-white/10 bg-white/[0.03] transition-all duration-300 hover:bg-[#d4a017]/10 hover:border-[#d4a017]/20 hover:shadow-lg hover:-translate-y-1"
            >
              <div
                className="text-4xl md:text-5xl font-bold text-[#d4a017] mb-3"
              >
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm md:text-base font-semibold uppercase tracking-wide text-white/90 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-white/60">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-base md:text-lg opacity-80 mb-6">
            Join the next generation of conservation leaders
          </p>
          <a
            href="/get-involved"
            className="inline-block bg-yellow-600 text-[#0f1a0f] font-semibold px-8 py-4 rounded-md hover:bg-yellow-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Become a Member Today
          </a>
        </div>
      </div>
    </section>
  );
}

