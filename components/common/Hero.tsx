import HeroSliderClient from "./HeroSliderClient";

type Slide = {
  bg: string;
  fallback?: string;
  heading: string;
  sub: string;
  cta1: { label: string; href: string };
  cta2: { label: string; href: string };
};

const slides: Slide[] = [
  {
    bg: "/hero/objeBG.jpeg",
    fallback: "/hero/objeBG.jpeg",
    heading: "YASCON, a not-for-profit conservation organisation,",
    sub: "Is a network of youths with strong interest and passion in nature and environment conservation. YASCON unites youths in grassroots conservation, planting trees, restoring ecosystems, and championing environmental stewardship for future generations.",
    cta1: { label: "Join the Movement", href: "/get-involved" },
    cta2: { label: "Learn More →", href: "/about" },
  },
  {
    bg: "/hero/hero1.avif",
    fallback: "/hero/hero1.avif",
    heading: "Protecting Nature,Empowering Youth",
    sub: "YASCON unites youths in grassroots conservation — planting trees, restoring ecosystems, and championing environmental stewardship for future generations.",
    cta1: { label: "Join the Movement", href: "/get-involved" },
    cta2: { label: "Learn More →", href: "/about" },
  },
  {
    bg: "/hero/hero2.avif",
    fallback: "/hero/hero3.avif",
    heading: "Together, Let's Grow a Greener Future",
    sub: "Every youth club across all 28 districts is called to lead tree-planting activities. The real impact happens when we act locally — starting this week.",
    cta1: { label: "Get Involved", href: "/get-involved" },
    cta2: { label: "Our Work →", href: "/about/work" },
  },
  {
    bg: "/hero/hero3.avif",
    fallback: "/hero/hero3.avif",
    heading: "The Most Energetic Force of Conservation",
    sub: "From biodiversity conservation to climate action, YASCON's nationwide network of youth clubs drives measurable environmental impact.",
    cta1: { label: "Our Programs", href: "/impact/national/programs" },
    cta2: { label: "Read Stories →", href: "/news" },
  },
];

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <HeroSliderClient slides={slides} />
    </section>
  );
}
