import { Driver, Meeting, Session, Weather, StreamObj, StreamsResponse } from "./types";

const BASE_URL = "https://api.openf1.org/v1";
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);
const loggedFailures = new Set<string>();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function logFailureOnce(url: string, status: number, statusText: string, context: string) {
  const key = `${context}|${url}|${status}`;
  if (loggedFailures.has(key)) return;
  loggedFailures.add(key);
  console.warn(`${context} (${status} ${statusText}) for ${url}`);
}

async function readErrorDetail(res: Response): Promise<string | null> {
  try {
    const data = (await res.json()) as { detail?: string };
    return typeof data?.detail === "string" ? data.detail : null;
  } catch {
    return null;
  }
}

async function fetchWithRetry(url: string, init: RequestInit, retries: number = 2): Promise<Response> {
  let lastError: unknown = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, init);
      if (res.ok) return res;
      if (!RETRYABLE_STATUS.has(res.status) || attempt === retries) return res;
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
    }
    const backoff = 250 * Math.pow(2, attempt);
    await sleep(backoff);
  }
  throw lastError instanceof Error ? lastError : new Error(`Failed to fetch ${url}`);
}

export async function getDrivers(sessionKey?: number): Promise<Driver[]> {
  const url = sessionKey
    ? `${BASE_URL}/drivers?session_key=${sessionKey}`
    : `${BASE_URL}/drivers`;

  const res = await fetchWithRetry(url, { next: { revalidate: 300 } } as RequestInit & { next: { revalidate: number } });
  if (!res.ok) {
    if (res.status === 401) {
      const detail = await readErrorDetail(res);
      if (detail?.toLowerCase().includes("session in progress")) {
        logFailureOnce(url, res.status, "Restricted in-progress session", "Drivers unavailable");
        return [];
      }
    }
    // Drivers endpoint is non-critical on several pages; return [] instead of hard-failing.
    logFailureOnce(url, res.status, res.statusText, "Drivers unavailable");
    return [];
  }
  return res.json();
}

export async function getSessions(year: number = 2025): Promise<Session[]> {
  const url = `${BASE_URL}/sessions?year=${year}`;
  const res = await fetchWithRetry(url, { next: { revalidate: 900 } } as RequestInit & { next: { revalidate: number } });
  if (!res.ok) {
    logFailureOnce(url, res.status, res.statusText, "Sessions request failed");
    throw new Error(`Failed to fetch sessions: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getMeetings(year: number): Promise<Meeting[]> {
  const url = `${BASE_URL}/meetings?year=${year}`;
  const res = await fetchWithRetry(url, { next: { revalidate: 1800 } } as RequestInit & { next: { revalidate: number } });
  if (!res.ok) {
    logFailureOnce(url, res.status, res.statusText, "Meetings request failed");
    throw new Error(`Failed to fetch meetings: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getSessionsWithFallback(years: number[]): Promise<{ sessions: Session[]; year: number | null }> {
  for (const year of years) {
    try {
      const sessions = await getSessions(year);
      if (sessions.length > 0) {
        return { sessions, year };
      }
    } catch (error) {
      console.error(`Failed to fetch sessions for year ${year}:`, error);
    }
  }
  return { sessions: [], year: null };
}

export async function getMeetingSessions(meetingKey: number, yearCandidates: number[]): Promise<{ sessions: Session[]; year: number | null }> {
  const { sessions, year } = await getSessionsWithFallback(yearCandidates);
  if (!sessions.length) return { sessions: [], year };
  const meetingSessions = sessions.filter((session) => session.meeting_key === meetingKey);
  return { sessions: meetingSessions, year };
}

export async function getMeetingWithFallback(
  meetingKey: number,
  yearCandidates: number[]
): Promise<{ meeting: Meeting | null; year: number | null }> {
  for (const year of yearCandidates) {
    try {
      const meetings = await getMeetings(year);
      const meeting = meetings.find((item) => item.meeting_key === meetingKey);
      if (meeting) {
        return { meeting, year };
      }
    } catch (error) {
      console.error(`Failed to fetch meeting metadata for year ${year}:`, error);
    }
  }
  return { meeting: null, year: null };
}

export async function getDriversByYear(year: number): Promise<Driver[]> {
  const sessions = await getSessions(year);
  if (sessions.length === 0) return [];

  const now = new Date().getTime();

  // Find the latest session that has already started (or is about to start)
  const pastSessions = sessions.filter(s => new Date(s.date_start).getTime() <= now);
  const sortedPastSessions = pastSessions.sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());

  // If we have past sessions, use the latest one.
  // If not (start of season), use the earliest future session.
  let targetSession = sortedPastSessions[0];

  if (!targetSession) {
    const futureSessions = sessions.filter(s => new Date(s.date_start).getTime() > now);
    const sortedFutureSessions = futureSessions.sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
    targetSession = sortedFutureSessions[0];
  }

  if (!targetSession) return [];

  return getDrivers(targetSession.session_key);
}


export async function getNextSession(): Promise<Session | null> {
  const currentYear = new Date().getFullYear();
  let sessions: Session[] = [];
  try {
    sessions = await getSessions(currentYear);
  } catch {
    // Fallback for off-season or temporary API issues.
    sessions = await getSessions(currentYear - 1).catch(() => []);
  }
  const now = new Date().getTime();

  // Filter for future sessions
  const futureSessions = sessions.filter(s => new Date(s.date_start).getTime() > now);

  // Sort by date ascending (soonest first)
  const sortedFutureSessions = futureSessions.sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());

  return sortedFutureSessions[0] || null;
}

export async function getWeatherData(sessionKey: number): Promise<Weather | null> {
  const url = `${BASE_URL}/weather?session_key=${sessionKey}`;
  // We want latest weather, so revalidate frequently or disable cache
  const res = await fetchWithRetry(url, { next: { revalidate: 60 } } as RequestInit & { next: { revalidate: number } });

  if (!res.ok) {
    if (res.status === 401) {
      const detail = await readErrorDetail(res);
      if (detail?.toLowerCase().includes("session in progress")) {
        logFailureOnce(url, res.status, "Restricted in-progress session", "Weather unavailable");
        return null;
      }
    }
    // Weather is optional UI data; do not spam errors.
    logFailureOnce(url, res.status, res.statusText, "Weather unavailable");
    return null;
  }

  const data: Weather[] = await res.json();

  if (!data || data.length === 0) return null;

  // Weather data comes as a time series, we want the latest reading
  return data[data.length - 1];
}

export async function getStreams(): Promise<StreamObj[]> {
  const url = "https://api.ppv.to/api/streams";
  try {
    const res = await fetchWithRetry(url, {
      next: { revalidate: 60 } // Recommend polling interval in cache
    } as RequestInit & { next: { revalidate: number } }, 2);

    if (!res.ok) {
      logFailureOnce(url, res.status, res.statusText, "Streams API unavailable");
      return [];
    }

    const data: StreamsResponse = await res.json();
    if (!data.success || !data.streams) {
      return [];
    }

    // Attempt to extract Formula 1 or Motorsports streams
    const allStreams: StreamObj[] = [];
    for (const category of data.streams) {
      // You can filter by category name here if desired, e.g. "Motorsports"
      // Or just return everything or specific ones
      if (category.category === "Motorsports" || category.category.toLowerCase().includes("motorsport")) {
        allStreams.push(...category.streams);
      }
    }

    // If no Motorsports found, maybe return all to show something, or keep it strict
    // We'll keep it strict to Motorsports.
    return allStreams;
  } catch (error) {
    console.error("Failed to fetch streams:", error);
    return [];
  }
}
