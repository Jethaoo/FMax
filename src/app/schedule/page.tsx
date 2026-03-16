import { getSessionsWithFallback, getMeetings } from "@/lib/api";
import { Meeting } from "@/lib/types";
import ScheduleClient, { MeetingRow } from "@/components/schedule/ScheduleClient";

export default async function SchedulePage() {
  const currentYear = new Date().getFullYear();
  const { sessions, year } = await getSessionsWithFallback([2026, currentYear, currentYear - 1, 2025]);

  if (!sessions.length) {
    return (
      <div className="pb-8">
        <h1 className="text-3xl font-bold text-white mb-6">Season Schedule</h1>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-gray-300">
          No schedule is available yet. Please check again later.
        </div>
      </div>
    );
  }

  // Fetch meeting metadata (flags, circuit images, circuit info URLs)
  let meetingsMeta: Meeting[] = [];
  if (year) {
    meetingsMeta = await getMeetings(year).catch(() => []);
  }
  const metaByKey = new Map<number, Meeting>(meetingsMeta.map(m => [m.meeting_key, m]));

  // Group sessions by meeting
  const meetingsMap = new Map<number, MeetingRow>();
  sessions.forEach(session => {
    if (!meetingsMap.has(session.meeting_key)) {
      const meta = metaByKey.get(session.meeting_key);
      meetingsMap.set(session.meeting_key, {
        meeting_key: session.meeting_key,
        country_name: session.country_name,
        location: session.location,
        circuit_short_name: session.circuit_short_name,
        country_flag: meta?.country_flag,
        circuit_image: meta?.circuit_image,
        circuit_info_url: meta?.circuit_info_url,
        sessions: [],
      });
    }
    const row = meetingsMap.get(session.meeting_key)!;
    row.sessions.push({
      session_key: session.session_key,
      session_type: session.session_type,
      session_name: session.session_name,
      date_start: session.date_start,
      date_end: session.date_end,
      gmt_offset: session.gmt_offset,
      country_name: session.country_name,
    });
  });

  // Sort meetings chronologically by their first session
  const meetings = Array.from(meetingsMap.values()).sort((a, b) => {
    const aFirst = [...a.sessions].sort((x, y) => new Date(x.date_start).getTime() - new Date(y.date_start).getTime())[0];
    const bFirst = [...b.sessions].sort((x, y) => new Date(x.date_start).getTime() - new Date(y.date_start).getTime())[0];
    return new Date(aFirst.date_start).getTime() - new Date(bFirst.date_start).getTime();
  });

  return <ScheduleClient meetings={meetings} year={year} />;
}
