import Link from "next/link";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
     <header className=" bg-[#1a2e1a] text-white border-b  border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#d4a017]">
              YASCON
            </p>
            <p className="text-sm font-semibold">Content Management</p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-white/85 hover:text-white"
          >
            Back to Website
          </Link>
        </div>
      </header>
      
{children}
    </>
  );
}

