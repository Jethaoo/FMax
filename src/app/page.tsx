import { getNextSession, getDrivers, getWeatherData } from "@/lib/api";
import Link from "next/link";
import { Driver, Session, Weather } from "@/lib/types";
import CountdownTimer from "@/components/CountdownTimer";
import WeatherWidget from "@/components/WeatherWidget";
import SessionTimeDisplay from "@/components/SessionTimeDisplay";
import { getDriverImage } from "@/lib/image-mapping";

export default async function Home() {
  let session: Session | null = null;
  let drivers: Driver[] = [];
  let weather: Weather | null = null;

  try {
    session = await getNextSession();
    if (session) {
      // Run parallel fetches for drivers and weather
      const [driversData, weatherData] = await Promise.all([
        getDrivers(session.session_key).catch(() => []),
        getWeatherData(session.session_key).catch(() => null)
      ]);
      drivers = driversData;
      weather = weatherData;
    }
  } catch (error) {
    console.error("Failed to fetch data for home page:", error);
  }

  return (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-gray-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
          <div className="flex items-center justify-between w-full md:w-auto">
            <h2 className="text-xl font-bold">Next Race</h2>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider md:hidden">
              {session ? session.session_type : "N/A"}
            </span>
          </div>
          {session && (
            <div className="hidden md:block">
               <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                {session.session_type}
              </span>
            </div>
          )}
        </div>

        {session ? (
          <div>
            <div className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-2xl font-bold leading-tight mb-1">{session.session_name}</p>
                   <p className="text-gray-600 font-medium">{session.circuit_short_name}, {session.country_name}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <CountdownTimer targetDate={session.date_start} sessionType={session.session_type} />
              </div>
            </div>
            
            <SessionTimeDisplay dateStart={session.date_start} gmtOffset={session.gmt_offset} />

            <WeatherWidget weather={weather} />
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
                  <img 
                    src={getDriverImage(driver)} 
                    alt={driver.full_name} 
                    className="w-full h-full object-cover object-top"
                  />
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
