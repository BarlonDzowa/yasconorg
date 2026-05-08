import Link from "next/link";

const links = [
  { name: "Board Members", path: "/careers/board" },
 // { name: "Volunteers", path: "/careers/volunteers" },
];

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* PAGE HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Vacancies & Opportunities</h1>
        <p className="text-gray-600">
          Explore opportunities to work with the Youth Association for
          Conservation of Nature and Environment (YASCON). Join us in promoting
          environmental conservation and sustainable development across Malawi.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#d4a017] uppercase mb-2">
          Vacancies
        </h3>

        <ul className="space-y-2">
          {links.map((link) => (
            <li
              key={link.name}
              className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <span className="text-gray-700">
                <Link href={link.path}>{link.name}</Link>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
