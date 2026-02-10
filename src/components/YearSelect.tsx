"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

export default function YearSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentYear = searchParams.get("year") || "2025";

  const years = [2025, 2024, 2023];

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    router.push(`/drivers?year=${year}`);
  };

  return (
    <div className="mb-6 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 border border-white/10">
      <label htmlFor="year-select" className="font-semibold text-white text-sm">Season:</label>
      <select
        id="year-select"
        value={currentYear}
        onChange={handleChange}
        className="border border-white/20 rounded-md px-3 py-1.5 text-sm text-white bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/70"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
