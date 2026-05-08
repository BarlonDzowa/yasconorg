import Image from "next/image";
import Link from "next/link";

export default function team() {
  return (
    <section className="bg-[#f2f6f3] mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-[#1a2e1a]">Management</h2>
        <div className="w-11 h-[3px] bg-[#d4a017] mt-5  rounded-sm" />
        <p className="text-[#2e3d35] mt-3 mb-8">National Level</p>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {[
            {
              name: "Mwai Mtayamanja",
              role: "National Coordinator",
              focus: "",
              avatar: "/teampics/national-coordinator.png",
            },
            {
              name: "Clement Chiwambo",
              role: "Funding & Compliance Manager",
              focus: "",
              avatar: "/teampics/funding-officer.png",
            },
            {
              name: "Rashid Mailos",
              role: "Extension Methodologies Manager",
              focus: "",
              avatar: "/teampics/extensions-officer.png",
            },
            {
              name: "Salomy Chivunga",
              role: "Public Relations & Events Manager",
              focus: "",
              avatar: "/teampics/public-relations.png",
            },
            {
              name: "Mussa John Witness",
              role: "Media Relations Manager",
              focus: "",
              avatar: "/teampics/mediarelations.png",
            },
          ].map((member) => (
            <div
              key={member.name}
              className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={72}
                    height={72}
                    className="rounded-full border border-gray-200"
                  />
                  <div>
                    <p className="text-lg font-semibold text-[#1a2e1a]">
                      {member.name}
                    </p>
                    <p className="text-sm font-semibold text-green-700 mt-1">
                      {member.role}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[#2e3d35] mt-4">{member.focus}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
