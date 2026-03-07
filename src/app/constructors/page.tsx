import { getDrivers, getDriversByYear } from "@/lib/api";
import { Driver } from "@/lib/types";
import { getTeamLogo, getCarImage } from "@/lib/image-mapping";

export default async function ConstructorsPage() {
  let allDrivers: Driver[] = [];
  const currentYear = new Date().getFullYear();
  const yearCandidates = Array.from(new Set([currentYear, currentYear - 1, 2025]));
  let displayYear = currentYear;
  
  // Try likely active seasons first so deployed pages stay populated.
  for (const year of yearCandidates) {
    try {
      const driversForYear = await getDriversByYear(year);
      if (driversForYear.length > 0) {
        allDrivers = driversForYear;
        displayYear = year;
        break;
      }
    } catch (error) {
      console.error(`Failed to fetch drivers for constructors page (${year}):`, error);
    }
  }

  // Last-resort fallback to generic drivers endpoint.
  if (allDrivers.length === 0) {
    try {
      allDrivers = await getDrivers();
    } catch (error) {
      console.error("Failed to fetch generic drivers for constructors page:", error);
    }
  }
  
  // Extract unique teams
  const teamsMap = new Map<string, { name: string; color: string; drivers: string[] }>();
  
  allDrivers.forEach((d) => {
    const teamName = d.team_name || "Unknown Team";
    if (!teamsMap.has(teamName)) {
      teamsMap.set(teamName, { 
        name: teamName, 
        color: d.team_colour || "000000", 
        drivers: [] 
      });
    }
    const team = teamsMap.get(teamName)!;
    if (!team.drivers.includes(d.full_name)) {
      team.drivers.push(d.full_name);
    }
  });

  const teams = Array.from(teamsMap.values()).sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  if (teams.length === 0) {
    return (
      <div className="pb-4">
        <h1 className="text-3xl font-bold mb-6 text-white">{displayYear} Constructors</h1>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-gray-300">
          Constructors data is temporarily unavailable. Please refresh in a few minutes.
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <h1 className="text-3xl font-bold mb-6 text-white">{displayYear} Constructors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <div 
            key={team.name} 
            className="rounded-xl shadow-sm border border-gray-100 overflow-hidden transition hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: `#${team.color}` }}
          >
             <div 
                className="px-4 py-3 flex justify-between items-center bg-black/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center opacity-70">
                    <img 
                      src={getTeamLogo(team.name)} 
                      alt={team.name} 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h2 className="text-lg font-bold text-white">{team.name}</h2>
                </div>
              </div>
            <div className="relative">
              <div className="absolute left-0 top-0 h-full w-2/3 pointer-events-none opacity-90 mix-blend-overlay">
                <div className="w-full h-full bg-gradient-to-r from-black/20 to-transparent" />
              </div>
              <div className="w-full h-32 relative mt-2 mb-2">
                 <img 
                    src={getCarImage(team.name)} 
                    alt={`${team.name} car`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain object-left pl-4"
                  />
              </div>
            </div>
            <div className="p-4 pt-0 relative z-10">
              <h3 className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-3">Drivers</h3>
              <div className="flex flex-wrap gap-2">
                {team.drivers.map((driver) => (
                  <span key={driver} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                    {driver}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
