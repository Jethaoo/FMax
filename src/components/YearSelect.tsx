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
    <div className="mb-6 flex items-center space-x-2">
      <label htmlFor="year-select" className="font-semibold text-gray-700">Select Season:</label>
      <select
        id="year-select"
        value={currentYear}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
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
