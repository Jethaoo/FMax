"use client";

import { useState, useEffect, useMemo } from "react";
import DateTimeText from "@/components/timezone/DateTimeText";

export interface SessionRow {
  session_key: number;
  session_type: string;
  session_name: string;
  date_start: string;
  date_end: string;
  gmt_offset: string;
  country_name: string;
}

export interface MeetingRow {
  meeting_key: number;
  country_name: string;
  location: string;
  circuit_short_name: string;
  country_flag?: string;
  circuit_image?: string;
  circuit_info_url?: string;
  sessions: SessionRow[];
}

interface CircuitInfo {
  circuitLength?: number;
  circuit_length?: number;
  Length?: number;
  numberOfLaps?: number;
  number_of_laps?: number;
  NumberOfLaps?: number;
  firstGrandPrix?: number;
  first_grand_prix?: number;
  FirstGrandPrix?: number;
  lapRecord?: string | { time?: string; driver?: string; year?: number };
  lap_record?: string | { time?: string; driver?: string; year?: number };
  LapRecord?: string | { time?: string; driver?: string; year?: number };
  lapRecordDriver?: string;
  lapRecordYear?: number;
  raceDistance?: number;
  race_distance?: number;
  RaceDistance?: number;
}

function parseLapRecord(info: CircuitInfo): { time: string; driver?: string; year?: number } | null {
  const raw = info.lapRecord ?? info.lap_record ?? info.LapRecord;
  if (!raw) return null;
  if (typeof raw === "string") {
    return { time: raw, driver: info.lapRecordDriver, year: info.lapRecordYear };
  }
  if (typeof raw === "object") {
    return { time: raw.time ?? "", driver: raw.driver, year: raw.year };
  }
  return null;
}

function getCircuitLength(info: CircuitInfo): number | null {
  return info.circuitLength ?? info.circuit_length ?? info.Length ?? null;
}
function getLaps(info: CircuitInfo): number | null {
  return info.numberOfLaps ?? info.number_of_laps ?? info.NumberOfLaps ?? null;
}
function getFirstGP(info: CircuitInfo): number | null {
  return info.firstGrandPrix ?? info.first_grand_prix ?? info.FirstGrandPrix ?? null;
}
function getRaceDistance(info: CircuitInfo): number | null {
  return info.raceDistance ?? info.race_distance ?? info.RaceDistance ?? null;
}

function getSessionColor(sessionType: string): string {
  const t = sessionType.toLowerCase();
  if (t.includes("race")) return "bg-red-600 text-white";
  if (t.includes("qualifying")) return "bg-purple-600 text-white";
  if (t.includes("sprint")) return "bg-amber-500 text-white";
  if (t.includes("practice")) return "bg-blue-600 text-white";
  return "bg-gray-600 text-white";
}

function getStatusInfo(startDate: string, endDate: string) {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (now < start) return { label: "Upcoming", cls: "bg-amber-500/20 text-amber-400 border border-amber-500/30" };
  if (now <= end) return { label: "Live", cls: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" };
  return { label: "Completed", cls: "bg-white/10 text-gray-400 border border-white/10" };
}

interface CountdownParts { d: number; h: number; m: number; s: number; started: boolean }

function calcParts(targetDate: string): CountdownParts {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, started: true };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    started: false,
  };
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/10 rounded-md px-3 py-1.5 min-w-[44px] text-center border border-white/10">
        <span className="text-lg font-extrabold text-white tabular-nums leading-none font-mono">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-1">{label}</span>
    </div>
  );
}

function Countdown({ targetDate }: { targetDate: string }) {
  const [parts, setParts] = useState<CountdownParts | null>(null);

  useEffect(() => {
    setParts(calcParts(targetDate));
    const id = setInterval(() => setParts(calcParts(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  // Render nothing until client has mounted — prevents server/client HTML mismatch
  if (!parts) {
    return (
      <div className="flex items-end gap-1.5 mt-2 animate-pulse">
        {["Hrs", "Min", "Sec"].map((label) => (
          <div key={label} className="flex flex-col items-center">
            <div className="bg-white/10 rounded-md px-3 py-1.5 min-w-[44px] h-[34px] border border-white/10" />
            <span className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (parts.started) {
    return (
      <div className="flex items-center gap-1.5 mt-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Session Live</span>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-1.5 mt-2">
      {parts.d > 0 && <CountdownBlock value={parts.d} label="Days" />}
      <CountdownBlock value={parts.h} label="Hrs" />
      <div className="text-white/40 font-bold text-base pb-4 leading-none">:</div>
      <CountdownBlock value={parts.m} label="Min" />
      <div className="text-white/40 font-bold text-base pb-4 leading-none">:</div>
      <CountdownBlock value={parts.s} label="Sec" />
    </div>
  );
}

export default function ScheduleClient({ meetings, year }: { meetings: MeetingRow[]; year: number | null }) {
  const nextMeetingIndex = useMemo(() => {
    const now = Date.now();
    const idx = meetings.findIndex(m => {
      const sessions = [...m.sessions].sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
      const last = sessions[sessions.length - 1];
      return new Date(last.date_end).getTime() > now;
    });
    return idx >= 0 ? idx : meetings.length - 1;
  }, [meetings]);

  const [selectedIndex, setSelectedIndex] = useState(nextMeetingIndex);
  const [circuitInfo, setCircuitInfo] = useState<CircuitInfo | null>(null);
  const [circuitLoading, setCircuitLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");

  const selected = meetings[selectedIndex];

  useEffect(() => {
    const url = selected?.circuit_info_url;
    if (!url) { setCircuitInfo(null); return; }
    setCircuitLoading(true);
    setCircuitInfo(null);
    fetch(url)
      .then(r => r.json())
      .then((data: CircuitInfo) => setCircuitInfo(data))
      .catch(() => setCircuitInfo(null))
      .finally(() => setCircuitLoading(false));
  }, [selectedIndex, selected?.circuit_info_url]);

  const nextSession = useMemo(() => {
    const now = Date.now();
    return meetings
      .flatMap(m => m.sessions)
      .filter(s => new Date(s.date_start).getTime() > now)
      .sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime())[0] ?? null;
  }, [meetings]);

  const sortedSessions = useMemo(() =>
    [...(selected?.sessions ?? [])].sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime()),
    [selected]
  );

  const circuitLen = circuitInfo ? getCircuitLength(circuitInfo) : null;
  const laps = circuitInfo ? getLaps(circuitInfo) : null;
  const firstGP = circuitInfo ? getFirstGP(circuitInfo) : null;
  const raceDist = circuitInfo ? getRaceDistance(circuitInfo) : null;
  const lapRec = circuitInfo ? parseLapRecord(circuitInfo) : null;

  function handleSelectMeeting(index: number) {
    setSelectedIndex(index);
    setMobileView("detail");
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-5rem)] rounded-xl overflow-hidden border border-white/10">

      {/* ── Left panel ─────────────────────────────────────────────── */}
      <div className={`flex-1 md:flex-none md:w-[42%] lg:w-[38%] xl:w-[36%] flex flex-col overflow-hidden bg-[#1a1a27] border-r border-white/10 ${mobileView === "detail" ? "hidden md:flex" : "flex"}`}>

        {/* Countdown header */}
        <div className="px-6 pt-4 pb-5 bg-[#12121e] border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">GP Calendar</span>
            {nextSession && (
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Next Session</span>
            )}
          </div>
          {nextSession ? (
            <>
              <p className="text-base font-bold text-white truncate leading-snug">
                {nextSession.country_name}
                <span className="text-gray-400 font-normal"> &middot; {nextSession.session_type}</span>
              </p>
              <Countdown targetDate={nextSession.date_start} />
            </>
          ) : (
            <p className="text-sm text-gray-500">No upcoming sessions</p>
          )}
        </div>

        {/* Meeting list */}
        <div className="overflow-y-auto flex-1 scroll-smooth">
          {meetings.map((meeting, index) => {
            const sorted = [...meeting.sessions].sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
            const first = sorted[0];
            const last = sorted[sorted.length - 1];
            const status = getStatusInfo(first.date_start, last.date_end);
            const isTesting = index < 2;
            const roundNum = isTesting ? null : index - 1;
            const isSelected = selectedIndex === index;

            return (
              <button
                key={meeting.meeting_key}
                onClick={() => handleSelectMeeting(index)}
                className={`w-full text-left px-6 py-5 border-b border-white/5 transition-colors ${isSelected ? "bg-blue-600 text-white" : "hover:bg-white/5 text-gray-300"}`}
              >
                <div className="flex items-start gap-4">
                  {/* Round label */}
                  <div className={`flex-shrink-0 w-10 text-center pt-0.5 ${isSelected ? "text-blue-200" : "text-gray-600"}`}>
                    <div className="text-[11px] font-semibold uppercase leading-none mb-1 tracking-wide">Round</div>
                    <div className="text-xl font-extrabold leading-none">{isTesting ? "T" : roundNum}</div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {meeting.country_flag && (
                        <img src={meeting.country_flag} alt="" className="h-4 w-6 object-cover rounded-sm flex-shrink-0" />
                      )}
                      <span className={`text-sm truncate ${isSelected ? "text-blue-200" : "text-gray-400"}`}>
                        {first.country_name} / {meeting.location}
                      </span>
                    </div>

                    <p className={`text-base font-bold leading-snug truncate ${isSelected ? "text-white" : "text-gray-100"}`}>
                      {year}{" "}
                      {isTesting
                        ? index === 0 ? "Bahrain Pre-Season Testing 1" : "Bahrain Pre-Season Testing 2"
                        : `${meeting.country_name} Grand Prix`}
                    </p>

                    <p className={`text-sm truncate mt-1 ${isSelected ? "text-blue-200" : "text-gray-500"}`}>
                      {meeting.circuit_short_name}
                    </p>

                    <div className="flex items-center justify-between mt-2.5 gap-2">
                      <span className={`text-sm ${isSelected ? "text-blue-200" : "text-gray-500"}`}>
                        <DateTimeText date={first.date_start} gmtOffset={first.gmt_offset} variant="date" />
                        {" ~"}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.cls}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────── */}
      {selected && (
        <div className={`flex-1 bg-[#12121e] overflow-y-auto ${mobileView === "list" ? "hidden md:block" : "block"}`}>
          {/* Back button (mobile) */}
          <div className="md:hidden px-4 pt-4">
            <button
              onClick={() => setMobileView("list")}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mb-2"
            >
              ← Back to Calendar
            </button>
          </div>

          <div className="p-5 md:p-7">
            {/* GP Title */}
            <div className="mb-5">
              <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-widest mb-1">Formula 1</p>
              <h1 className="text-xl md:text-2xl font-extrabold text-white uppercase leading-tight tracking-wide">
                {sortedSessions[0]?.country_name}{" "}
                {selectedIndex < 2 ? (selectedIndex === 0 ? "Pre-Season Testing 1" : "Pre-Season Testing 2") : "Grand Prix"}{" "}
                {year}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-2">
                <span className="text-sm text-gray-400">
                  <DateTimeText date={sortedSessions[0].date_start} gmtOffset={sortedSessions[0].gmt_offset} variant="datetime" />
                  {" ~ "}
                  <DateTimeText date={sortedSessions[sortedSessions.length - 1].date_start} gmtOffset={sortedSessions[sortedSessions.length - 1].gmt_offset} variant="date" />
                </span>
                <span className="text-sm text-gray-500">
                  {sortedSessions[0].country_name} / {selected.location} / {selected.circuit_short_name}
                </span>
              </div>
            </div>

            <div className="border-t border-white/10 mb-6" />

            {/* Session Schedules */}
            <div className="mb-8">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Session Schedules</h2>
              <div className="space-y-2.5">
                {sortedSessions.map(session => {
                  const state = getStatusInfo(session.date_start, session.date_end);
                  return (
                    <div key={session.session_key} className="flex items-center gap-3 flex-wrap">
                      <span className={`flex-shrink-0 inline-flex items-center px-3 py-1 rounded text-xs font-bold min-w-[96px] justify-center ${getSessionColor(session.session_type)}`}>
                        {session.session_type}
                      </span>
                      <span className="text-sm text-gray-300 flex-1">
                        <DateTimeText date={session.date_start} gmtOffset={session.gmt_offset} variant="date" />
                        {", "}
                        <DateTimeText date={session.date_start} gmtOffset={session.gmt_offset} variant="time" />
                        {" ~ "}
                        <DateTimeText date={session.date_end} gmtOffset={session.gmt_offset} variant="time" />
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${state.cls}`}>
                        {state.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Track Information */}
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Track Information</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                {/* Stats column */}
                <div>
                  {circuitLoading && (
                    <div className="space-y-4 animate-pulse">
                      {[1, 2, 3].map(i => (
                        <div key={i}>
                          <div className="h-3 w-24 bg-white/10 rounded mb-1" />
                          <div className="h-7 w-32 bg-white/10 rounded" />
                        </div>
                      ))}
                    </div>
                  )}

                  {!circuitLoading && circuitInfo && (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                      {circuitLen && (
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Circuit Length</p>
                          <p className="text-2xl font-bold text-white">{(circuitLen / 1000).toFixed(3)}<span className="text-sm font-medium text-gray-400 ml-1">km</span></p>
                        </div>
                      )}
                      {firstGP && (
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">First Grand Prix</p>
                          <p className="text-2xl font-bold text-white">{firstGP}</p>
                        </div>
                      )}
                      {laps && (
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Number of Laps</p>
                          <p className="text-2xl font-bold text-white">{laps}</p>
                        </div>
                      )}
                      {raceDist && (
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Race Distance</p>
                          <p className="text-2xl font-bold text-white">{typeof raceDist === "number" ? raceDist.toFixed(3) : raceDist}<span className="text-sm font-medium text-gray-400 ml-1">km</span></p>
                        </div>
                      )}
                      {lapRec?.time && (
                        <div className="col-span-2">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Lap Record</p>
                          <p className="text-2xl font-bold text-white">{lapRec.time}</p>
                          {(lapRec.driver || lapRec.year) && (
                            <p className="text-sm text-gray-400 mt-0.5">
                              {lapRec.driver}{lapRec.year ? ` (${lapRec.year})` : ""}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {!circuitLoading && !circuitInfo && (
                    <p className="text-sm text-gray-600 italic">Circuit data unavailable.</p>
                  )}
                </div>

                {/* Circuit image column */}
                {selected.circuit_image && (
                  <div>
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setShowMap(false)}
                        className={`text-xs px-3 py-1 rounded font-semibold transition ${!showMap ? "bg-white text-gray-900" : "bg-white/10 text-gray-400 hover:bg-white/15"}`}
                      >
                        Circuit
                      </button>
                      <button
                        onClick={() => setShowMap(true)}
                        className={`text-xs px-3 py-1 rounded font-semibold transition ${showMap ? "bg-white text-gray-900" : "bg-white/10 text-gray-400 hover:bg-white/15"}`}
                      >
                        Map
                      </button>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 p-3 flex items-center justify-center min-h-[160px]">
                      <img
                        src={selected.circuit_image}
                        alt={`${selected.circuit_short_name} circuit layout`}
                        className="max-h-48 w-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
