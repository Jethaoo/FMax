import { getNextSession, getDrivers } from "@/lib/api";
import Link from "next/link";
import { Driver, Session } from "@/lib/types";

export default async function Home() {
  let session: Session | null = null;
  let drivers: Driver[] = [];

  try {
    session = await getNextSession();
    drivers = session ? await getDrivers(session.session_key) : [];
  } catch (error) {
    console.error("Failed to fetch data for home page:", error);
  }

  return (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-gray-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Next Race</h2>
          <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
            {session ? session.session_type : "N/A"}
          </span>
        </div>
        {session ? (
          <div>
            <div className="mb-4">
              <p className="text-2xl font-bold leading-tight mb-1">{session.session_name}</p>
              <p className="text-gray-600 font-medium">{session.circuit_short_name}, {session.country_name}</p>
            </div>
            
            <div className="flex items-center text-gray-500 text-sm bg-gray-50 p-3 rounded-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {new Date(session.date_start).toLocaleString(undefined, { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">No upcoming session found for this season.</p>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4">
        <Link href="/drivers" className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Drivers</h3>
            <p className="text-sm text-gray-500">View 2025 Grid</p>
          </div>
          <div className="bg-red-50 p-2 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </Link>
        <Link href="/constructors" className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Constructors</h3>
            <p className="text-sm text-gray-500">Team Standings</p>
          </div>
          <div className="bg-red-50 p-2 rounded-full">
             <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </Link>
      </section>

      {session && drivers.length > 0 && (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-gray-900">
          <h2 className="text-xl font-bold mb-4">Drivers in Session</h2>
          <div className="flex overflow-x-auto space-x-4 pb-2 -mx-4 px-4 scrollbar-hide">
            {drivers.map((driver) => (
              <div key={driver.driver_number} className="flex-shrink-0 w-24 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mb-2 border-2 border-white shadow-sm">
                   {driver.headshot_url ? (
                        <img 
                          src={driver.headshot_url} 
                          alt={driver.full_name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-gray-400">{driver.driver_number}</span>
                      )}
                </div>
                <p className="font-bold text-sm truncate w-full">{driver.name_acronym}</p>
                <p className="text-xs text-gray-500 truncate w-full">{driver.team_name}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
