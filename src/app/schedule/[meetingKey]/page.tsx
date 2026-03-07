import Link from "next/link";
import { notFound } from "next/navigation";
import { getMeetingSessions, getMeetingWithFallback } from "@/lib/api";
import DateTimeText from "@/components/timezone/DateTimeText";
import TimezoneModeHint from "@/components/timezone/TimezoneModeHint";
import TimezoneToggle from "@/components/timezone/TimezoneToggle";
import SessionStateBadge from "@/components/schedule/SessionStateBadge";
import WeekendStateBadge from "@/components/schedule/WeekendStateBadge";

function getSessionChipClass(sessionType: string) {
  const type = sessionType.toLowerCase();
  if (type.includes("race")) return "bg-red-100 text-red-700";
  if (type.includes("qualifying")) return "bg-purple-100 text-purple-700";
  if (type.includes("sprint")) return "bg-amber-100 text-amber-700";
  if (type.includes("practice")) return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
}

export default async function ScheduleDetailPage({ params }: { params: { meetingKey: string } }) {
  const meetingKey = Number.parseInt(params.meetingKey, 10);
  if (Number.isNaN(meetingKey)) notFound();

  const currentYear = new Date().getFullYear();
  const yearCandidates = [2026, currentYear, currentYear - 1, 2025];
  const { sessions, year: seasonYear } = await getMeetingSessions(meetingKey, yearCandidates);
  if (!sessions.length) notFound();

  const sortedSessions = [...sessions].sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
  const firstSession = sortedSessions[0];
  const lastSession = sortedSessions[sortedSessions.length - 1];
  const { meeting } = await getMeetingWithFallback(meetingKey, yearCandidates);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <Link href="/schedule" className="text-sm font-semibold text-red-400 hover:text-red-300 transition">
          {"<- Back to schedule"}
        </Link>
        <span className="text-xs px-2 py-1 rounded bg-white/10 border border-white/10 text-gray-300">{seasonYear ?? "Current"} Season</span>
      </div>
      <div className="md:hidden">
        <TimezoneToggle />
      </div>

      <section className="rounded-xl border border-gray-100 bg-white p-6 text-gray-900">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{firstSession.country_name} Grand Prix</h1>
            <p className="text-gray-500 font-medium mt-1">
              {meeting?.circuit_short_name ?? firstSession.circuit_short_name}, {meeting?.location ?? firstSession.location}
            </p>
          </div>
          <WeekendStateBadge startDate={firstSession.date_start} endDate={lastSession.date_end} />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Weekend Starts</p>
            <p className="text-sm font-semibold mt-1">
              <DateTimeText date={firstSession.date_start} gmtOffset={firstSession.gmt_offset} variant="datetime" />
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Weekend Ends</p>
            <p className="text-sm font-semibold mt-1">
              <DateTimeText date={lastSession.date_end} gmtOffset={lastSession.gmt_offset} variant="datetime" />
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Timezone Mode</p>
            <p className="text-sm text-gray-600 mt-1">Controlled from header toggle.</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6 text-gray-900">
        <h2 className="text-lg font-bold mb-4">Circuit Information</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Circuit Key</p>
            <p className="text-sm font-semibold mt-1">{meeting?.circuit_key ?? firstSession.circuit_key}</p>
          </div>
          <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Circuit Type</p>
            <p className="text-sm font-semibold mt-1">{meeting?.circuit_type ?? "N/A"}</p>
          </div>
          <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Country</p>
            <div className="flex items-center gap-2 mt-1">
              {meeting?.country_flag ? (
                <img
                  src={meeting.country_flag}
                  alt={`${meeting.country_name} flag`}
                  className="h-4 w-6 object-cover rounded-sm border border-gray-200"
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <p className="text-sm font-semibold">{meeting?.country_name ?? firstSession.country_name}</p>
              <span className="text-xs text-gray-500 uppercase">{meeting?.country_code ?? firstSession.country_code}</span>
            </div>
          </div>
        </div>

        {(meeting?.circuit_image || meeting?.circuit_info_url) && (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {meeting?.circuit_image ? (
              <div className="lg:col-span-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-2">Circuit Image</p>
                <img
                  src={meeting.circuit_image}
                  alt={`${meeting.circuit_short_name} layout`}
                  className="w-full h-44 object-contain bg-white rounded border border-gray-100"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : null}
            {meeting?.circuit_info_url ? (
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 flex flex-col">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-2">Detailed Circuit Data</p>
                <p className="text-sm text-gray-600 mb-3">Provided by MultiViewer / FastF1-compatible JSON.</p>
                <a
                  href={meeting.circuit_info_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black transition"
                >
                  Open circuit_info_url
                </a>
              </div>
            ) : null}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6 text-gray-900">
        <h2 className="text-lg font-bold mb-4">Weekend Timeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedSessions.map((session) => (
            <div key={session.session_key} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getSessionChipClass(session.session_type)}`}>
                  {session.session_type}
                </span>
                <SessionStateBadge startDate={session.date_start} endDate={session.date_end} />
              </div>
              <p className="text-sm font-semibold">
                <DateTimeText date={session.date_start} gmtOffset={session.gmt_offset} variant="weekday" />
                {" · "}
                <DateTimeText date={session.date_start} gmtOffset={session.gmt_offset} variant="time" />
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Ends at <DateTimeText date={session.date_end} gmtOffset={session.gmt_offset} variant="time" />
              </p>
              <TimezoneModeHint />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

