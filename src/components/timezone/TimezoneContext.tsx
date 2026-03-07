"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type TimezoneMode = "local" | "track";

interface TimezoneContextValue {
  mode: TimezoneMode;
  setMode: (mode: TimezoneMode) => void;
  mounted: boolean;
}

const TimezoneContext = createContext<TimezoneContextValue | undefined>(undefined);

const STORAGE_KEY = "f1-viewer-timezone-mode";

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<TimezoneMode>("local");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "local" || stored === "track") {
      setMode(stored);
    }
    setMounted(true);
  }, []);

  const handleSetMode = (nextMode: TimezoneMode) => {
    setMode(nextMode);
    localStorage.setItem(STORAGE_KEY, nextMode);
  };

  const value = useMemo(
    () => ({
      mode,
      setMode: handleSetMode,
      mounted,
    }),
    [mode, mounted]
  );

  return <TimezoneContext.Provider value={value}>{children}</TimezoneContext.Provider>;
}

export function useTimezone() {
  const ctx = useContext(TimezoneContext);
  if (!ctx) {
    throw new Error("useTimezone must be used within TimezoneProvider");
  }
  return ctx;
}

