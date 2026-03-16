import { getNextSession } from "@/lib/api";
import Link from "next/link";
import { Session } from "@/lib/types";
import CountdownTimer from "@/components/CountdownTimer";
import SessionTimeDisplay from "@/components/SessionTimeDisplay";

export const dynamic = "force-dynamic";

export default async function Home() {
  let session: Session | null = null;

  try {
    session = await getNextSession();
  } catch (error) {
    console.error("Failed to fetch data for home page:", error);
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="rounded-xl border border-white/10 bg-gradient-to-r from-white/10 to-white/5 p-5 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">F1 Race Hub</h1>
        <p className="text-sm md:text-base text-gray-300 mt-1">
          Live race weekend overview, drivers, and full season schedule.
        </p>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-gray-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
          <div className="flex items-center justify-between w-full md:w-auto">
            <h2 className="text-xl font-bold">Next Race</h2>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider md:hidden">
              {session ? session.session_type : "N/A"}
            </span>
          </div>
          {session && (
            <div className="hidden md:block">
              <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                {session.session_type}
              </span>
            </div>
          )}
        </div>

        {session ? (
          <div>
            <div className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-2xl font-bold leading-tight mb-1">{session.session_name}</p>
                  <p className="text-gray-600 font-medium">{session.circuit_short_name}, {session.country_name}</p>
                </div>
              </div>

              <div className="mt-4">
                <CountdownTimer targetDate={session.date_start} sessionType={session.session_type} />
              </div>
            </div>

            <SessionTimeDisplay dateStart={session.date_start} gmtOffset={session.gmt_offset} />
          </div>
        ) : (
          <p className="text-gray-500 italic">No upcoming session found for this season.</p>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/drivers" className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition hover:-translate-y-0.5 hover:shadow-md">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Drivers</h3>
            <p className="text-sm text-gray-500">View 2025 Grid</p>
          </div>
          <div className="bg-red-50 p-2 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </Link>
        <Link href="/constructors" className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition hover:-translate-y-0.5 hover:shadow-md">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Constructors</h3>
            <p className="text-sm text-gray-500">Team Standings</p>
          </div>
          <div className="bg-red-50 p-2 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </Link>
        <Link href="/schedule" className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition hover:-translate-y-0.5 hover:shadow-md">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Schedule</h3>
            <p className="text-sm text-gray-500">Upcoming race weekends</p>
          </div>
          <div className="bg-red-50 p-2 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        </Link>
        <Link href="/stream" className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition hover:-translate-y-0.5 hover:shadow-md">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Stream</h3>
            <p className="text-sm text-gray-500">Live coverage</p>
          </div>
          <div className="bg-red-50 p-2 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </Link>
      </section>
    </div>
  );
}
