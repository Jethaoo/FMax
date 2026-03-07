"use client";

import { Globe, MapPin } from "lucide-react";
import { useTimezone } from "./TimezoneContext";

export default function TimezoneToggle() {
  const { mode, setMode, mounted } = useTimezone();

  if (!mounted) {
    return <div className="h-8 w-28 rounded-md bg-white/20 animate-pulse" />;
  }

  return (
    <div className="flex items-center rounded-md border border-white/20 bg-white/10 p-0.5">
      <button
        type="button"
        onClick={() => setMode("local")}
        className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold transition ${
          mode === "local" ? "bg-white text-gray-900" : "text-white hover:bg-white/10"
        }`}
        title="Show times in your local timezone"
      >
        <Globe size={12} />
        Local
      </button>
      <button
        type="button"
        onClick={() => setMode("track")}
        className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold transition ${
          mode === "track" ? "bg-white text-gray-900" : "text-white hover:bg-white/10"
        }`}
        title="Show times in track timezone"
      >
        <MapPin size={12} />
        Track
      </button>
    </div>
  );
}

