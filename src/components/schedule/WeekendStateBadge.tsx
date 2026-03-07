"use client";

import { useEffect, useState } from "react";

interface WeekendStateBadgeProps {
  startDate: string;
  endDate: string;
}

function getWeekendState(startDate: string, endDate: string) {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (now < start) return { label: "Weekend Upcoming", className: "bg-amber-100 text-amber-800" };
  if (now >= start && now <= end) return { label: "Weekend Live", className: "bg-emerald-100 text-emerald-700" };
  return { label: "Weekend Finished", className: "bg-gray-100 text-gray-600" };
}

export default function WeekendStateBadge({ startDate, endDate }: WeekendStateBadgeProps) {
  const [state, setState] = useState(() => getWeekendState(startDate, endDate));

  useEffect(() => {
    setState(getWeekendState(startDate, endDate));
    const id = setInterval(() => setState(getWeekendState(startDate, endDate)), 60_000);
    return () => clearInterval(id);
  }, [startDate, endDate]);

  return <span className={`inline-flex px-2 py-1 rounded-full text-[11px] font-semibold ${state.className}`}>{state.label}</span>;
}

