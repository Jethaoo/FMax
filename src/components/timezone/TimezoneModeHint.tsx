"use client";

import { useTimezone } from "./TimezoneContext";

export default function TimezoneModeHint() {
  const { mode } = useTimezone();
  return <span className="text-[11px] text-gray-400 mt-1">{mode === "track" ? "Track time" : "Local time"}</span>;
}

