import { getNextSession, getMeetingSessions, getMeetingWithFallback } from "@/lib/api";
import Link from "next/link";
import { Session, Meeting } from "@/lib/types";
import CountdownTimer from "@/components/CountdownTimer";
import SessionTimeDisplay from "@/components/SessionTimeDisplay";
import DateTimeText from "@/components/timezone/DateTimeText";
import TimezoneModeHint from "@/components/timezone/TimezoneModeHint";
import RotatingBackground from "@/components/RotatingBackground";

export const dynamic = "force-dynamic";

export default async function Home() {
  let session: Session | null = null;
  let meeting: Meeting | null = null;
  let meetingSessions: Session[] = [];

  try {
    session = await getNextSession();
    if (session) {
      const currentYear = new Date().getFullYear();
      const yearCandidates = [currentYear, currentYear - 1, 2025];
      const [sessionsRes, meetingRes] = await Promise.all([
        getMeetingSessions(session.meeting_key, yearCandidates),
        getMeetingWithFallback(session.meeting_key, yearCandidates),
      ]);
      meetingSessions = sessionsRes.sessions.sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
      meeting = meetingRes.meeting;
    }
  } catch (error) {
    console.error("Failed to fetch data for home page:", error);
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.35]">
        <RotatingBackground />
      </div>

      <div className="relative z-10 space-y-6 md:space-y-8 pb-10">
        <section className="rounded-xl border border-white/10 bg-gradient-to-r from-white/10 to-white/5 p-5 md:p-6 backdrop-blur-md shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-white">F1 Race Hub</h1>
          <p className="text-sm md:text-base text-gray-300 mt-1">
            Live race weekend overview, drivers, and full season schedule.
          </p>
        </section>

        <section className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/20 text-gray-900">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <h2 className="text-xl font-bold">Next Race</h2>
            {session && (
              <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Up Next: {session.session_type}
              </span>
            )}
          </div>
          {session && (
            <Link href={`/schedule/${session.meeting_key}`} className="text-sm font-semibold text-red-600 hover:text-red-700 transition flex items-center gap-1 group">
              Full Schedule <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </Link>
          )}
        </div>

        {session ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="flex flex-col">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{session.country_name} Grand Prix</p>
                <p className="text-3xl lg:text-4xl font-extrabold leading-snug tracking-tight text-gray-900 mb-2">{session.session_name}</p>
                <p className="text-gray-600 font-medium flex items-center gap-2 mb-8">
                  {meeting?.country_flag && (
                    <img src={meeting.country_flag} alt="" className="h-4 w-6 object-cover rounded-sm border border-gray-200" />
                  )}
                  {session.circuit_short_name}, {session.location}
                </p>

                <div className="mt-8 flex flex-col justify-center">
                  <CountdownTimer targetDate={session.date_start} sessionType={session.session_type} />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 lg:mb-5">Weekend Schedule</h3>
              <div className="relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-gray-100">
                {meetingSessions.length > 0 ? meetingSessions.map((s) => {
                  const isNext = s.session_key === session!.session_key;
                  const isPast = new Date(s.date_end).getTime() < Date.now();
                  return (
                    <div key={s.session_key} className="relative pl-8 py-2.5 group">
                      <div className={`absolute left-[7px] top-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full ring-4 ring-white shadow-sm transition-colors ${
                        isNext ? 'bg-red-500' : isPast ? 'bg-gray-300' : 'bg-gray-200 group-hover:bg-gray-300'
                      }`} />
                      {isNext && (
                        <div className="absolute left-[7px] top-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full bg-red-500 animate-ping opacity-75" />
                      )}

                      <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl transition-all ${
                        isNext ? 'bg-red-50/50 border border-red-100 shadow-sm' : 'bg-white hover:bg-gray-50 border border-transparent hover:border-gray-100'
                      }`}>
                        <div className="flex items-center gap-3 mb-1 sm:mb-0">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide text-center min-w-[76px] justify-center ${
                            s.session_type.toLowerCase().includes('race') ? 'bg-red-100 text-red-700' : 
                            s.session_type.toLowerCase().includes('qualifying') ? 'bg-purple-100 text-purple-700' : 
                            s.session_type.toLowerCase().includes('sprint') ? 'bg-amber-100 text-amber-700' : 
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {s.session_type}
                          </span>
                        </div>
                        
                        <div className={`flex items-center gap-2 text-sm ${isPast ? 'text-gray-400' : isNext ? 'text-gray-900 font-bold' : 'text-gray-600 font-medium'}`}>
                          <div className="w-12 sm:w-auto text-left">
                            <DateTimeText date={s.date_start} gmtOffset={s.gmt_offset} variant="weekday" />
                          </div>
                          <div className="w-1 h-1 rounded-full bg-current opacity-30" />
                          <div className="tabular-nums">
                            <DateTimeText date={s.date_start} gmtOffset={s.gmt_offset} variant="time" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-6 text-center border border-gray-100 ml-8">Schedule unavailable.</div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <TimezoneModeHint />
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
            <p>No upcoming session found for this season.</p>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/drivers" className="flex items-center justify-between p-6 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 active:scale-[0.98] transition hover:-translate-y-0.5 hover:shadow-xl hover:bg-white/95">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Drivers</h3>
            <p className="text-sm text-gray-500">View 2025 Grid</p>
          </div>
          <div className="bg-red-50 p-2 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </Link>
        <Link href="/constructors" className="flex items-center justify-between p-6 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 active:scale-[0.98] transition hover:-translate-y-0.5 hover:shadow-xl hover:bg-white/95">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Constructors</h3>
            <p className="text-sm text-gray-500">Team Standings</p>
          </div>
          <div className="bg-red-50 p-2 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </Link>
        <Link href="/schedule" className="flex items-center justify-between p-6 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 active:scale-[0.98] transition hover:-translate-y-0.5 hover:shadow-xl hover:bg-white/95">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Schedule</h3>
            <p className="text-sm text-gray-500">Upcoming race weekends</p>
          </div>
          <div className="bg-red-50 p-2 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        </Link>
        <Link href="/stream" className="flex items-center justify-between p-6 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 active:scale-[0.98] transition hover:-translate-y-0.5 hover:shadow-xl hover:bg-white/95">
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
    </div>
  );
}
