"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Slide = {
  bg: string;
  fallback?: string;
  heading: string;
  sub: string;
  cta1: { label: string; href: string };
  cta2: { label: string; href: string };
};

type Props = {
  slides: Slide[];
};

export default function HeroSliderClient({ slides }: Props) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent(idx);
      setTimeout(() => setIsAnimating(false), 900);
    },
    [isAnimating],
  );

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);

  useEffect(() => {
    const t = setTimeout(next, 6000);
    return () => clearTimeout(t);
  }, [current, next]);

  return (
    <>
      {slides.map((slide, i) => (
        <div key={i} className={`slide ${i === current ? "active" : ""}`}>
          {i === current && (
            <>
              <div className="absolute inset-0">
                <Image
                  src={slide.bg}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                  onErrorCapture={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (slide.fallback && img.src !== slide.fallback) {
                      img.src = slide.fallback;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/50 " />
              </div>

              <div className="relative inset-0 flex items-center justify-center z-10 pt-8 pb-24">
                <div className="w-full max-w-6xl px-6 sm:px-10 text-center">
                  <h1
                    className="slide-h1 text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-2xl mb-6"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {slide.heading}
                  </h1>

                  <p className="slide-sub max-w-3xl mx-auto text-lg sm:text-xl text-white/90 leading-relaxed mb-10">
                    {slide.sub}
                  </p>

                  <div className="slide-btns flex flex-wrap justify-center gap-4 sm:gap-5">
                    <Link href={slide.cta1.href}>
                      <span className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold uppercase tracking-wide bg-[#f5a524] text-white rounded-sm shadow-lg shadow-[rgba(0,0,0,0.28)] hover:bg-[#e3910c] transition-colors duration-200">
                        {slide.cta1.label}
                      </span>
                    </Link>
                    <Link href={slide.cta2.href}>
                      <span className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold uppercase tracking-wide border border-white/70 text-white rounded-sm hover:bg-white/10 transition-all duration-200">
                        {slide.cta2.label}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      <div className="absolute z-20 flex gap-2 bottom-14 left-1/2 -translate-x-1/2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`slider-dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}
