import { Driver, Session } from "./types";

const BASE_URL = "https://api.openf1.org/v1";

export async function getDrivers(sessionKey?: number): Promise<Driver[]> {
  const url = sessionKey 
    ? `${BASE_URL}/drivers?session_key=${sessionKey}`
    : `${BASE_URL}/drivers`;
  
  const res = await fetch(url, { next: { revalidate: 3600 } } as RequestInit & { next: { revalidate: number } });
  if (!res.ok) {
    console.error(`Failed to fetch drivers from ${url}: ${res.status} ${res.statusText}`);
    throw new Error(`Failed to fetch drivers: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getSessions(year: number = 2025): Promise<Session[]> {
  const url = `${BASE_URL}/sessions?year=${year}`;
  const res = await fetch(url, { next: { revalidate: 3600 } } as RequestInit & { next: { revalidate: number } });
  if (!res.ok) {
    console.error(`Failed to fetch sessions from ${url}: ${res.status} ${res.statusText}`);
    throw new Error(`Failed to fetch sessions: ${res.status} ${res.statusText}`);
  }
  return res.json();
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
  const sessions = await getSessions(new Date().getFullYear());
  const now = new Date().getTime();
  
  // Filter for future sessions
  const futureSessions = sessions.filter(s => new Date(s.date_start).getTime() > now);
  
  // Sort by date ascending (soonest first)
  const sortedFutureSessions = futureSessions.sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
  
  return sortedFutureSessions[0] || null;
}
