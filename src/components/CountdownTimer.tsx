"use client";

import { useEffect, useState } from "react";
import { intervalToDuration, formatDuration } from "date-fns";

interface CountdownTimerProps {
  targetDate: string;
  sessionType: string;
}

export default function CountdownTimer({ targetDate, sessionType }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const calculateTimeLeft = () => {
      const start = new Date();
      const end = new Date(targetDate);
      
      if (start >= end) {
        return "Session Started";
      }

      const duration = intervalToDuration({
        start,
        end,
      });

      const formatted = formatDuration(duration, {
        format: ["days", "hours", "minutes"],
        zero: true,
        delimiter: " ",
        locale: {
          formatDistance: (token: string, count: number) => {
            if (token === "xDays") return `${count}d`;
            if (token === "xHours") return `${count}h`;
            if (token === "xMinutes") return `${count}m`;
            return "";
          }
        } as any
      });

      return `${sessionType} starts in: ${formatted}`;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [targetDate, sessionType]);

  if (!isClient) return null;

  return (
    <div className="font-mono text-sm md:text-base font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg inline-block">
      {timeLeft}
    </div>
  );
}
