import Image from "next/image";

type Member = {
  name: string;
  role: string;
  joined?: string;
  avatar: string;
  focus: string;
  bio?: string;
};

const nationalCoordinator: Member = {
  name: "Mwai Mtayamanja",
  role: "",
  avatar: "/teampics/national-coordinator.webp",
  focus: "Guides strategy, partnerships, and nationwide program delivery.",
  bio: "A distinguished anthropologist and dedicated young conservation leader, and a prominent advocate for youth empowerment. His work focuses on harnessing youth leadership to drive conservation and promote sustainable development in Malawi. Through entrepreneurship, innovation, and research, Mwai aims to create opportunities for young people to thrive and realise their full potential.",
};

const team: Member[] = [
  {
    name: "Clement Chiwambo",
    role: "Funding & Compliance Manager",
    joined: "2025",
    avatar: "/teampics/funding-officer.webp",
    focus: "Clement, an economist from Lilongwe University of Agriculture and Natural Resources, holds a Bachelor of Science Degree in Agricultural Economics.He initially served as a Conservation Coordinator when he successfully led and implemented YASCON's conservation activities in Balaka District.Clement brings to the organisation strong skills in policy analysis, research, data analysis and rural development. He is a proven mobiliser, team worker and communicator.",
  },
  {
    name: "Rashid Mailos",
    role: "Extension Methodologies Manager",
    joined: "2025",
    avatar: "/teampics/extensions-officer.webp",
    focus: "Rashid holds a Bachelor of Science Degree in Agricultural Extension from Lilongwe University of Agriculture and Natural Resources and a certification in GIS.He initially served as an Area Conservation Coordinator when he successfully led and implemented YASCON's conservation activities in Chiradzulu District.Rashid brings to the organisation proven execution of extension methods, tools and techniques in rural and community development. He is also skilled in project planning, training and facilitation.",
  },
  {
    name: "Salomy Chivunga",
    role: "Public Relations & Events Manager",
    joined: "2025",
    avatar: "/teampics/public-relations.webp",
    focus: "Salomy is a journalist who studied Bachelor's of Arts in Journalism from Malawi University of Business and Applied Sciences.She initially served as an Area Conservation Coordinator when he successfully led and implemented YASCON's conservation activities in Blantyre district of Malawi.Salomy brings to the organisation proven community-based extension approaches,  leadership, communication and facilitation skills.",
  },
  {
    name: "Mussa John Witness",
    role: "Media Relations Manager",
    joined: "2025",
    avatar: "/teampics/mediarelations.webp",
    focus: "John Mussa Witness  holds a Bachelor of Arts in Communication Studies. from Mzuzu University.John initially served as an Area Conservation Coordinator when he successfully led and implemented YASCON's conservation activities in Balaka district of Malawi.He brings to the organisation proven community-based extension approaches, project management,  leadership, communication and coordination skills",
  },
  {
    name: "Martha Megan Phiri",
    role: "Regional Coordinator - North",
    joined: "2025",
    avatar: "/teampics/northern-coordinator.webp",
    focus: "Martha holds a Bachelor of Science Degree in Development Studies from University of Livingstonia. Prior to joining YASCON, she worked as a Facilitator and Documentor for an Agro-ecology project under Chitipa District Council.  Martha successfully led and implemented YASCON's conservation activities in the Northern region of Malawi as an Area Conservation Coordinator before being promoted to the current position.Martha brings to the organisation proven facilitation, community mobilization, organisation, project planning,  leadership and coordination skills.",
  },
  {
    name: "Chisomo Nyirenda",
    role: "Regional Coordinator - Central",
    joined: "2025",
    avatar: "/teampics/central-coordinator.webp",
    focus: "Chisomo holds a Bachelor of Science Degree in Value Chain Agriculture from Mzuzu University. He initially served as a Conservation Coordinator when he successfully led and implemented YASCON's conservation activities in the central region of Malawi. Chisomo brings to the organisation proven community mobilization, organisation, project management,  leadership and coordination skills",
  },
  {
    name: "Prince Magombo",
    role: "Regional Coordinator - East",
    joined: "2025",
    avatar: "/teampics/east-region-coordinator.webp",
    focus: "Prince holds a Bachelor of Science Degree in Agricultural Extension from Lilongwe University of Agriculture and Natural Resources. He initially served as an Area Conservation Coordinator when he successfully led and implemented YASCON's conservation activities in the Eastern region of Malawi. Prince brings to the organisation proven community-based extension approaches, project management,  leadership, communication and coordination skills.",
  },
  {
    name: "Bridget Namakhwa",
    role: "Regional Coordinator - South",
    joined: "2025",
    avatar: "/teampics/southern-coordinator.webp",
    focus: "Bridget holds a Bachelor of Science Degree in Education, majoring in Geography from the Catholic University of Malawi and a certificate in Introduction to Child Protection.She initially served as a Conservation Coordinator when she successfully led and implemented YASCON's conservation activities in the Southern region of Malawi.Bridget, a passionate and enthusiastic youth brings to the organisation proven communication, community mobilization, organisation, project management,  leadership and coordination skills",
  },
];

function NationalCoordinatorCard({ member }: { member: Member }) {
  return (
    <article className="overflow-hidden shadow-2xl border-2 border-[#d4a017]/50 bg-white">
      <div className="h-1 w-full bg-gradient-to-r from-[#d4a017] via-yellow-300 to-[#d4a017]" />
      <div className="relative h-80 flex-shrink-0 bg-green-900">
        <Image
          src={member.avatar}
          alt={member.name}
          fill
          className="object-cover object-top"
          sizes="400px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/85 via-green-950/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4a017] bg-green-950/80 px-2 py-1 mb-2">
            National Coordinator
          </span>
          <h2 className="text-2xl font-extrabold text-white leading-tight">
            {member.name}
          </h2>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-4 flex-1 bg-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-800 border-l-2 border-[#d4a017] pl-3">
          {member.focus}
        </p>
        {member.bio && (
          <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
        )}
        <div className="mt-auto pt-4 border-t border-[#d4a017]/20 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#d4a017]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4a017]">
            .
          </span>
        </div>
      </div>
    </article>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <article className="overflow-hidden shadow-lg border border-gray-200 bg-white hover:-translate-y-1 hover:shadow-2xl transition duration-200 flex flex-col">
      <div className="relative h-80 flex-shrink-0 bg-green-900">
        <Image
          src={member.avatar}
          alt={member.name}
          fill
          className="object-cover object-top"
          sizes="300px"
          priority
        />
      </div>
      <div className="p-5 flex flex-col flex-1 bg-white">
        <h3 className="text-base font-extrabold text-green-950 leading-tight">
          {member.name}
        </h3>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d4a017] mt-1 mb-3">
          {member.role}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed ">
          {member.focus}
        </p>
        {member.joined && (
          <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100">
           .
          </p>
        )}
      </div>
    </article>
  );
}

export default function Team() {
  return (
    <main className="relative min-h-screen text-white">

         
      {/* ── Management Team ── */}
      <section className="max-w-7xl mx-auto flex flex-col sm:flex-row px-4 sm:px-6 py-10 pb-20">
      <div className="max-w-sm pr-4">
            <NationalCoordinatorCard member={nationalCoordinator} />
      </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {team.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      </section>
    </main>
  );
}