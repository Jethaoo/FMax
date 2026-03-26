"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
  sessionType: string;
}

function FlipDigit({ digit }: { digit: string }) {
  return (
    <div className="relative flex items-center justify-center w-10 h-16 sm:w-16 sm:h-[104px] bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md border border-gray-200">
      <span className="text-black font-black text-4xl sm:text-7xl tracking-tighter select-none z-0 mt-1 sm:mt-2">{digit}</span>
      {/* Center line to create the split-flap effect */}
      <div className="absolute inset-x-0 top-1/2 h-[1px] sm:h-[2px] bg-black opacity-[0.15] -translate-y-1/2 w-full z-10"></div>
    </div>
  );
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4">
      <div className="flex gap-1 sm:gap-[6px]">
        <FlipDigit digit={padded[0]} />
        <FlipDigit digit={padded[1]} />
      </div>
      <span className="text-gray-500 text-[9px] sm:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase">{label}</span>
    </div>
  );
}

export default function CountdownTimer({ targetDate, sessionType }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const start = new Date();
      const end = new Date(targetDate);

      if (start >= end) {
        return { d: 0, h: 0, m: 0, s: 0 };
      }

      const diff = end.getTime() - start.getTime();
      return {
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  if (timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0) {
    return (
      <div className="w-full py-6 flex items-center justify-center">
         <h2 className="text-gray-900 text-xl font-black uppercase tracking-[0.2em]">{sessionType} Session Live</h2>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center gap-1.5 sm:gap-4 lg:gap-5 py-2">
      {timeLeft.d > 0 && (
        <>
          <FlipUnit value={timeLeft.d} label="Days" />
          <div className="text-gray-300 text-2xl sm:text-5xl font-bold pb-5 sm:pb-8 px-0.5 sm:px-1">:</div>
        </>
      )}
      <FlipUnit value={timeLeft.h} label="Hours" />
      <div className="text-gray-300 text-2xl sm:text-5xl font-bold pb-5 sm:pb-8 px-0.5 sm:px-1">:</div>
      <FlipUnit value={timeLeft.m} label="Minutes" />
      {timeLeft.d === 0 && (
        <>
          <div className="text-gray-300 text-2xl sm:text-5xl font-bold pb-5 sm:pb-8 px-0.5 sm:px-1">:</div>
          <FlipUnit value={timeLeft.s} label="Seconds" />
        </>
      )}
    </div>
  );
}
