"use client";

import { useMemo } from "react";
import { useTimezone } from "./TimezoneContext";

interface DateTimeTextProps {
  date: string;
  gmtOffset?: string;
  variant?: "datetime" | "date" | "time" | "weekday";
  className?: string;
}

function parseTrackDate(date: Date, gmtOffset?: string): Date {
  if (!gmtOffset) return date;
  const sign = gmtOffset.startsWith("-") ? -1 : 1;
  const [hoursStr = "0", minutesStr = "0"] = gmtOffset.replace(/[+-]/, "").split(":");
  const hours = Number.parseInt(hoursStr, 10);
  const minutes = Number.parseInt(minutesStr, 10);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return date;
  const offsetMs = sign * (hours * 60 + minutes) * 60 * 1000;
  return new Date(date.getTime() + offsetMs);
}

export default function DateTimeText({
  date,
  gmtOffset,
  variant = "datetime",
  className,
}: DateTimeTextProps) {
  const { mode, mounted } = useTimezone();
  const fallbackDate = new Date(date);
  const fallbackText =
    variant === "date"
      ? fallbackDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })
      : variant === "time"
      ? fallbackDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
      : variant === "weekday"
      ? fallbackDate.toLocaleDateString(undefined, { weekday: "short" })
      : fallbackDate.toLocaleString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

  const formatted = useMemo(() => {
    const dateObj = new Date(date);
    const formatByVariant = () => {
      if (mode === "track") {
        const trackDate = parseTrackDate(dateObj, gmtOffset);
        if (variant === "date") return trackDate.toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
        if (variant === "time") return trackDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
        if (variant === "weekday") return trackDate.toLocaleDateString(undefined, { weekday: "short", timeZone: "UTC" });
        return trackDate.toLocaleString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        });
      }

      if (variant === "date") return dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      if (variant === "time") return dateObj.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
      if (variant === "weekday") return dateObj.toLocaleDateString(undefined, { weekday: "short" });
      return dateObj.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };
    return formatByVariant();
  }, [date, gmtOffset, mode, variant]);

  if (!mounted) return <span suppressHydrationWarning className={className}>{fallbackText}</span>;

  return <span className={className}>{formatted}</span>;
}

