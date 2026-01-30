"use client";

import { useState, useEffect } from "react";
import { Globe, MapPin } from "lucide-react";

interface SessionTimeDisplayProps {
  dateStart: string;
  gmtOffset: string;
}

export default function SessionTimeDisplay({ dateStart, gmtOffset }: SessionTimeDisplayProps) {
  const [showTrackTime, setShowTrackTime] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatTime = (date: Date, timeZone?: string) => {
    return date.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timeZone,
    });
  };

  const getTrackTime = () => {
    // Check if gmtOffset is valid
    if (!gmtOffset) return formatTime(new Date(dateStart));

    const date = new Date(dateStart);
    
    // Parse offset string like "-05:00" or "+03:00"
    const sign = gmtOffset.startsWith("-") ? -1 : 1;
    const parts = gmtOffset.replace(/[+-]/, "").split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    
    if (isNaN(hours) || isNaN(minutes)) return formatTime(date);

    const offsetMs = sign * ((hours * 60) + minutes) * 60 * 1000;
    
    // We add the offset to the UTC timestamp to shift the time "value" to match the track's wall-clock time
    // Then we display it as UTC to "freeze" that wall-clock time
    const utcMs = date.getTime(); 
    const targetMs = utcMs + offsetMs;
    const targetDate = new Date(targetMs);
    
    return formatTime(targetDate, 'UTC');
  };

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
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>
          {showTrackTime ? getTrackTime() : formatTime(new Date(dateStart))}
        </span>
      </div>
      
      <button
        onClick={() => setShowTrackTime(!showTrackTime)}
        className="flex items-center space-x-1.5 bg-white border border-gray-200 shadow-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-100 transition-all active:scale-95"
        title={showTrackTime ? "Switch to Local Time" : "Switch to Track Time"}
      >
        {showTrackTime ? (
          <>
            <MapPin size={14} className="text-red-600" />
            <span>Track</span>
          </>
        ) : (
          <>
            <Globe size={14} className="text-blue-600" />
            <span>Local</span>
          </>
        )}
      </button>
    </div>
  );
}
