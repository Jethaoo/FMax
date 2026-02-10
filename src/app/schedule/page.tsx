import { getSessions } from "@/lib/api";
import { Session } from "@/lib/types";

function getSessionBadgeClass(sessionType: string): string {
  const type = sessionType.toLowerCase();
  if (type.includes("race")) return "bg-red-100 text-red-700";
  if (type.includes("qualifying")) return "bg-purple-100 text-purple-700";
  if (type.includes("sprint")) return "bg-amber-100 text-amber-700";
  if (type.includes("practice")) return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
}

export default async function SchedulePage() {
  const sessions = await getSessions(2026);
  if (!sessions.length) {
    return (
      <div className="pb-8">
        <h1 className="text-3xl font-bold text-white mb-6">2026 Season Schedule</h1>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-gray-300">
          No schedule is available yet. Please check again later.
        </div>
      </div>
    );
  }
  const meetingsMap = new Map<number, {
    name: string;
    location: string;
    country_name: string;
    circuit_short_name: string;
    date_start: string;
    sessions: Session[];
  }>();

  sessions.forEach(session => {
    if (!meetingsMap.has(session.meeting_key)) {
      meetingsMap.set(session.meeting_key, {
        name: session.session_name.replace(" - Practice 1", "").replace(" - Practice 2", "").replace(" - Practice 3", "").replace(" - Qualifying", "").replace(" - Sprint", "").replace(" - Race", ""),
        location: session.location,
        country_name: session.country_name,
        circuit_short_name: session.circuit_short_name,
        date_start: session.date_start, // This will be roughly the start of the weekend
        sessions: []
      });
    }
    meetingsMap.get(session.meeting_key)!.sessions.push(session);
  });

  const meetings = Array.from(meetingsMap.values()).sort((a, b) => 
    new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
  );

  return (
    <div className="pb-8">
      <h1 className="text-3xl font-bold text-white mb-6">2026 Season Schedule</h1>
      <p className="text-gray-300 mb-6">Testing and Grand Prix weekends in chronological order.</p>
      <div className="space-y-6">
        {meetings.map((meeting, index) => {
          const sortedSessions = meeting.sessions.sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
          const firstSession = sortedSessions[0];
          const lastSession = sortedSessions[sortedSessions.length - 1];
          
          const startDate = new Date(firstSession.date_start);
          const endDate = new Date(lastSession.date_start);
          
          let dateRange = "";
          const startDay = startDate.getDate();
          const endDay = endDate.getDate();
          const startMonth = startDate.toLocaleDateString(undefined, { month: 'short' });
          const endMonth = endDate.toLocaleDateString(undefined, { month: 'short' });
          
          if (startMonth === endMonth) {
            dateRange = `${startDay}-${endDay} ${startMonth}`;
          } else {
            dateRange = `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
          }

          let roundLabel = `ROUND ${index - 1}`;
          let roundClass = "bg-red-600 text-white";
          
          if (index < 2) {
            roundLabel = "TESTING";
            roundClass = "bg-gray-600 text-white";
          }

          return (
            <div key={meeting.date_start} className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden bg-white transition hover:shadow-md">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center space-x-3 md:space-x-4">
                   <div className={`${roundClass} text-xs font-bold px-2 py-1 rounded`}>
                      {roundLabel}
                   </div>
                   <div>
                      <h2 className="text-xl font-bold text-gray-900">{meeting.country_name} Grand Prix</h2>
                      <p className="text-sm text-gray-500 font-medium">{meeting.circuit_short_name}, {meeting.location}</p>
                   </div>
                </div>
                <div className="mt-1 md:mt-0 flex items-center bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                  <span className="text-sm font-bold text-gray-700">
                    {dateRange}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                  {sortedSessions.map((session) => (
                     <div key={session.session_key} className="flex flex-col p-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-200 transition">
                        <span className={`inline-flex w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mb-2 tracking-wide ${getSessionBadgeClass(session.session_type)}`}>
                          {session.session_type}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {new Date(session.date_start).toLocaleDateString(undefined, { weekday: 'short' })}
                        </span>
                        <span className="text-sm text-gray-600">
                           {new Date(session.date_start).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[11px] text-gray-400 mt-1">Local time</span>
                     </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
