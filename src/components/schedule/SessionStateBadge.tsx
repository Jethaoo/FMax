"use client";

import { useEffect, useState } from "react";

interface SessionStateBadgeProps {
  startDate: string;
  endDate: string;
}

function getState(startDate: string, endDate: string) {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (now < start) {
    return { label: "UPCOMING", className: "bg-amber-100 text-amber-800" };
  }
  if (now >= start && now <= end) {
    return { label: "LIVE", className: "bg-emerald-100 text-emerald-700" };
  }
  return { label: "FINISHED", className: "bg-gray-100 text-gray-600" };
}

export default function SessionStateBadge({ startDate, endDate }: SessionStateBadgeProps) {
  const [state, setState] = useState(() => getState(startDate, endDate));

  useEffect(() => {
    setState(getState(startDate, endDate));
    const id = setInterval(() => setState(getState(startDate, endDate)), 60_000);
    return () => clearInterval(id);
  }, [startDate, endDate]);

  return (
    <span className={`inline-flex w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${state.className}`}>
      {state.label}
    </span>
  );
}

