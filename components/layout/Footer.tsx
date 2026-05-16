import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  About: [
    { label: "Mission & Vision", href: "/about/mission" },
    { label: "Objectives", href: "/about/objectives" },
    { label: "Where we work", href: "/about/location" },
    { label: "Our Work", href: "/about/work" },
    { label: "Our Team", href: "/about/management" },
    { label: "Our Story", href: "/about/our-story" },
    ,
    { label: "Contact Us", href: "/contact" },
  ],
  "Our Work": [
    { label: "Biodiversity Conservation", href: "/about/work" },
    { label: "Tree Planting", href: "/about/work" },
    { label: "Environmental Education", href: "/about/work" },
    { label: "Community Development", href: "/about/work" },
    { label: "Climate Action", href: "/about/work" },
    { label: "Research & Monitoring", href: "/about/work" },
  ],
  Programs: [
    { label: "Research and Development", href: "/impact/national/programs" },
    { label: "Stakeholder Engagement", href: "/impact/national/programs" },
    { label: "Conservation Campaigns", href: "/impact/national/programs" },
    { label: "Conservation Education", href: "/impact/national/programs" },
    {
      label: "Reforestation & Afforestation",
      href: "/impact/national/programs",
    },
    { label: "Skills Development", href: "/impact/national/programs" },
    { label: "Enterprise Development", href: "/impact/national/programs" },
  ],
  Newsroom: [
    { label: "All News", href: "/news" },
    { label: "Press Releases", href: "/news/press-releases" },
    { label: "Articles & Blogs", href: "/news/articles" },
    { label: "Impact Stories", href: "/news/stories" },
    { label: "Videos", href: "/news/videos" },
  ],
};

const socials = [
  {
    name: "Facebook",
    href: "ttps://www.facebook.com/YASCONORG",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/YASCONORG",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/yasconofficial/?hl=en",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3h-8.5zm10.71-.21a1.08 1.08 0 11-2.16 0 1.08 1.08 0 012.16 0zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/265986818697",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    name: "Email",
    href: "mailto:info@yascon.org",
    icon: (
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
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white">
      {/* Gold accent line */}
      <div
        style={{
          height: "3px",
          background:
            "linear-gradient(to right, #d4a017, rgba(212,160,23,.2), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/Log.png"
                alt="YASCON Logo"
                width={54}
                height={54}
                className="rounded-full"
                style={{ border: "2px solid rgba(212,160,23,.3)" }}
              />
              <div>
                <div className="font-bold tracking-widest text-sm text-white">
                  YASCON
                </div>
                <div
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,.45)" }}
                >
                  Youth Association for Conservation of Nature and Environment
                </div>
              </div>
            </div>

            <p
              className="text-sm leading-relaxed mb-5 max-w-xs"
              style={{ color: "rgba(255,255,255,.45)" }}
            >
              Mobilizing youth to protect nature, restore ecosystems, and build
              a sustainable future for generations to come.
            </p>

            {/* Social links — hover handled by CSS class */}
            <div className="flex gap-2 flex-wrap mb-5">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={s.name}
                  className="footer-social-btn ]"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            <div className="space-y-1.5 text-xs text-gray-400">
              <div> +265 (0) 885284321</div>
              <div> +265 (0) 986818697</div>
              <div> info@yascon.org</div>
              <div> Blantyre, Malawi</div>
            </div>
            <div>
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-widest mb-2 pb-2 mt-5 "
                  style={{
                    // color: "rgba(255,255,255,.75)",
                    borderBottom: "1px solid rgba(255,255,255,.07)",
                  }}
                >
                  {" "}
                  INCORPORATION NUMBER
                </h4>
              </div>
              <div className="space-y-1.5 text-xs text-gray-400">
                COYG-J7RCGW5
              </div>
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-widest mb-2 pb-2 mt-3 "
                  style={{
                    // color: "rgba(255,255,255,.75)",
                    borderBottom: "1px solid rgba(255,255,255,.07)",
                  }}
                >
                  {" "}
                  CONGOMA REGISTRATION NUMBER
                </h4>
              </div>
              <div className="space-y-1.5 text-xs text-gray-400">
                YASCON-538282-719
              </div>
            </div>
          </div>

          {/* Link columns — hover handled entirely by CSS .footer-col-link */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-4 pb-2"
                style={{
                  // color: "rgba(255,255,255,.75)",
                  borderBottom: "1px solid rgba(255,255,255,.07)",
                }}
              >
                {section}
              </h4>
              <ul>
                {links.map((link) => (
                  <li key={link?.label}>
                    <Link href={link?.href || "#"} className="footer-col-link">
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs" style={{ color: "rgba(255,255,255,.28)" }}>
            © 2026 YASCON — Youth Association for Conservation of Nature and
            Environment. All rights reserved.
          </p>
          <div>
            {/* Pure CSS hover — no JS event handlers */}
            <Link href="/privacy" className="footer-legal-link">
              Privacy Policy
            </Link>
            <Link href="/terms" className="footer-legal-link">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
