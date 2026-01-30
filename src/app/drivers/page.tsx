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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{year} Drivers</h1>
        <YearSelect />
      </div>
      
      {uniqueDrivers.length === 0 ? (
        <p className="text-gray-600">No drivers found for this season yet.</p>
      ) : (
        <div className="space-y-8 pb-4">
          {sortedTeams.map(([teamName, teamData]) => (
            <section key={teamName} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div 
                className="px-4 py-3 border-l-4 flex justify-between items-center bg-gray-50"
                style={{ borderLeftColor: `#${teamData.color}` }}
              >
                <h2 className="text-lg font-bold text-gray-900">{teamName}</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {teamData.drivers.map((driver) => (
                  <div key={driver.driver_number} className="p-4 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 relative">
                      <img 
                        src={getDriverImage(driver)} 
                        alt={driver.full_name} 
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900">{driver.full_name}</h3>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">{driver.country_code}</p>
                        </div>
                        <span className="font-mono text-lg font-bold text-gray-300">#{driver.driver_number}</span>
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
