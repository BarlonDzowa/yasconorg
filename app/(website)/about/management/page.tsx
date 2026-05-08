import Image from "next/image";
import { getTeamMembers } from "@/lib/cms/service";
import Team from "@/components/common/Team";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Management Team",
};

type Member = {
  id: number;
  name: string;
  role: string;
  joined?: string | null;
  avatar: string | null;
  focus: string;
  region: string | null;
};

async function getManagementTeam() {
  try {
    const members = await getTeamMembers({ type: "management", status: "published" });
    const national = members.find((m) => m.role.toLowerCase() === "national coordinator") ?? null;
    const team = members.filter((m) => m.role.toLowerCase() !== "national coordinator");
    return { nationalCoordinator: national, team };
  } catch (err) {
    console.error("Failed to load management team:", err);
    return { nationalCoordinator: null, team: [] };
  }
}

function NationalCoordinatorCard({ member }: { member: Member }) {
  return (
    <article className="overflow-hidden shadow-2xl border-2 border-[#d4a017]/50 bg-white">
      <div className="h-1 w-full bg-gradient-to-r from-[#d4a017] via-yellow-300 to-[#d4a017]" />
      <div className="relative h-80 flex-shrink-0 bg-green-900">
        {member.avatar ? (
          <Image
            src={member.avatar}
            alt={member.name}
            fill
            className="object-cover object-top"
            sizes="400px"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-900">
            <span className="text-white/40 text-6xl font-bold">{member.name[0]}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/85 via-green-950/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4a017] bg-green-950/80 px-2 py-1 mb-2">
            {member.role}
          </span>
          <h2 className="text-2xl font-extrabold text-white leading-tight">{member.name}</h2>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-4 flex-1 bg-white">
        <p className="text-sm text-gray-600 leading-relaxed">{member.focus}</p>
      </div>
    </article>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <article className="overflow-hidden shadow-lg border border-gray-200 bg-white hover:-translate-y-1 hover:shadow-2xl transition duration-200 flex flex-col">
      <div className="relative h-80 flex-shrink-0 bg-green-900">
        {member.avatar ? (
          <Image
            src={member.avatar}
            alt={member.name}
            fill
            className="object-cover object-top"
            sizes="300px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-900">
            <span className="text-white/40 text-6xl font-bold">{member.name[0]}</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1 bg-white">
        <h3 className="text-base font-extrabold text-green-950 leading-tight">{member.name}</h3>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d4a017] mt-1 mb-3">
          {member.role} - {member.region}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">{member.focus}</p>
      </div>
    </article>
  );
}

export default async function TeamPage() {
  const { nationalCoordinator, team } = await getManagementTeam();

  return (
    <main className="relative min-h-screen text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/team/river-forest.avif"
          alt="team background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[#0d1a0e]/80" />
      </div>

      {/* Hero header */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#d4a017] bg-black/40 px-3 py-2 rounded-full">
            <span className="h-px w-5 bg-[#d4a017]" />
            Leadership
            <span className="h-px w-5 bg-[#d4a017]/60" />
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-4 drop-shadow-lg">
            Management Team
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-white/80">
            The people steering YASCON&apos;s mission — unified across national leadership and regional
            coordination.
          </p>
          <div className="w-12 h-[3px] bg-[#d4a017] mt-8 mx-auto rounded-sm" />
        </div>
      </section>

      {/* Empty state */}
      {!nationalCoordinator && team.length === 0 && (
        <div>
          <Team />
        </div>
      )}

      {/* Management Team */}
      {(nationalCoordinator || team.length > 0) && (
        <section className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-6 px-4 sm:px-6 py-10 pb-20">
          {nationalCoordinator && (
            <div className="sm:max-w-sm flex-shrink-0">
              <NationalCoordinatorCard member={nationalCoordinator} />
            </div>
          )}
          {team.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 flex-1">
              {team.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}