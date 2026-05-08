import Image from "next/image";
import { getTeamMembers } from "@/lib/cms/service";

export const dynamic = "force-dynamic";

type BoardMember = {
  id: number;
  name: string;
  role: string;
  joined?: string | null;
  avatar: string | null;
  focus: string;
  region: string | null;
};

async function getBoardMembers() {
  try {
    return await getTeamMembers({ type: "board", status: "published" });
  } catch (err) {
    console.error("Failed to load board members:", err);
    return [];
  }
}

function BoardMemberCard({ member }: { member: BoardMember }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 text-center">
      <div className="relative w-28 h-28 mx-auto mb-4">
        {member.avatar ? (
          <Image
            src={member.avatar}
            alt={member.name}
            fill
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <span className="text-green-800 text-3xl font-bold">{member.name[0]}</span>
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
      <p className="text-blue-600 text-sm font-medium">{member.role}</p>
      {member.joined && (
        <p className="text-xs text-gray-400 mt-1">Since {member.joined}</p>
      )}
      <p className="text-gray-500 text-sm mt-3 text-left leading-relaxed">{member.focus}</p>
    </div>
  );
}

export default async function BoardPage() {
  const boardMembers = await getBoardMembers();

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 mt-20">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-800">Board of Trustees</h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Meet the leadership team guiding our organization&apos;s vision, strategy, and governance.
        </p>
      </div>

      {boardMembers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Board member information coming soon.</p>
        </div>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto">
          {boardMembers.map((member) => (
            <BoardMemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
