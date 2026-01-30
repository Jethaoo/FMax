import { getDriversByYear } from "@/lib/api";
import { Driver } from "@/lib/types";
import { getTeamLogo } from "@/lib/image-mapping";

export default async function ConstructorsPage() {
  let allDrivers: Driver[] = [];
  
  try {
    allDrivers = await getDriversByYear(2025);
  } catch (error) {
    console.error("Failed to fetch drivers for constructors page:", error);
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

  return (
    <div className="pb-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">2025 Constructors</h1>
      <div className="grid grid-cols-1 gap-4">
        {teams.map((team) => (
          <div key={team.name} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div 
                className="px-4 py-3 border-l-4 flex justify-between items-center bg-gray-50"
                style={{ borderLeftColor: `#${team.color}` }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 flex-shrink-0 bg-white rounded-md p-0.5 border border-gray-100 flex items-center justify-center">
                    <img 
                      src={getTeamLogo(team.name)} 
                      alt={team.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{team.name}</h2>
                </div>
              </div>
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Drivers</h3>
              <div className="flex flex-wrap gap-2">
                {team.drivers.map((driver) => (
                  <span key={driver} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
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
