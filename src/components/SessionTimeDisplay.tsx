"use client";

import { useEffect, useState } from "react";
import { Clock, Globe, MapPin } from "lucide-react";
import { useTimezone } from "./timezone/TimezoneContext";
import DateTimeText from "./timezone/DateTimeText";

interface SessionTimeDisplayProps {
  dateStart: string;
  gmtOffset: string;
}

export default function SessionTimeDisplay({ dateStart, gmtOffset }: SessionTimeDisplayProps) {
  const [mounted, setMounted] = useState(false);
  const { mode } = useTimezone();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering nothing or a stable fallback until mounted
  if (!mounted) {
    return (
      <div className="flex items-center justify-between text-gray-500 text-sm bg-gray-50 p-3 rounded-lg mb-2">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="w-40 h-5 bg-gray-200 rounded animate-pulse inline-block"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between text-gray-500 text-sm bg-gray-50 p-3 rounded-lg mb-2">
      <div className="flex items-center">
        <Clock className="w-5 h-5 mr-2" />
        <span>
          <DateTimeText date={dateStart} gmtOffset={gmtOffset} variant="datetime" />
        </span>
      </div>

      <div className="flex items-center space-x-1.5 bg-white border border-gray-200 shadow-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700">
        {mode === "track" ? <MapPin size={14} className="text-red-600" /> : <Globe size={14} className="text-blue-600" />}
        <span>{mode === "track" ? "Track Time" : "Local Time"}</span>
      </div>
    </div>
  );
}
