import { getDrivers, getDriversByYear } from "@/lib/api";
import { Driver } from "@/lib/types";
import YearSelect from "@/components/YearSelect";
import { getDriverImage } from "@/lib/image-mapping";

export default async function DriversPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const year = typeof searchParams.year === "string" ? parseInt(searchParams.year) : 2025;
  
  // Fetch drivers for the specific year
  // If 2025 (current year), we might just want to fetch all or recent
  // But consistent behavior with getDriversByYear is better if sessions exist.
  // If no sessions for 2025 yet (early year), fallback to getDrivers() which returns generic list?
  // Let's try getDriversByYear first, if empty and year is current, fallback.
  
  let allDrivers: Driver[] = [];
  try {
    allDrivers = await getDriversByYear(year);
    if (allDrivers.length === 0 && year === 2025) {
      allDrivers = await getDrivers();
    }
  } catch (e) {
    // Fallback if API fails or year invalid
    console.error(e);
    allDrivers = [];
  }
  
  // Deduplicate and Group by Team
  const uniqueDrivers = Array.from(
    new Map(allDrivers.map((d) => [d.driver_number, d])).values()
  );

  const driversByTeam = uniqueDrivers.reduce((acc, driver) => {
    const team = driver.team_name || "Unknown Team";
    if (!acc[team]) {
      acc[team] = {
        drivers: [],
        color: driver.team_colour || "000000"
      };
    }
    acc[team].drivers.push(driver);
    return acc;
  }, {} as Record<string, { drivers: Driver[], color: string }>);

  // Sort teams alphabetically
  const sortedTeams = Object.entries(driversByTeam).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="pb-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-white">{year} Drivers</h1>
        <YearSelect />
      </div>
      
      {uniqueDrivers.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-gray-300">
          No drivers found for this season yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
          {sortedTeams.map(([teamName, teamData]) => (
            <section 
              key={teamName} 
              className="rounded-xl shadow-sm overflow-hidden border border-gray-100 transition hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: `#${teamData.color}` }}
            >
              <div 
                className="px-4 py-3 flex justify-between items-center bg-black/20"
              >
                <h2 className="text-lg font-bold text-white">{teamName}</h2>
              </div>
              <div className="divide-y divide-white/10">
                {teamData.drivers.map((driver) => (
                  <div key={driver.driver_number} className="p-4 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 relative border-2 border-white/50">
                      <img 
                        src={getDriverImage(driver)} 
                        alt={driver.full_name} 
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-white">{driver.full_name}</h3>
                          <p className="text-xs text-white/80 uppercase tracking-wide">{driver.country_code}</p>
                        </div>
                        <span className="font-mono text-lg font-bold text-white/60">#{driver.driver_number}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
