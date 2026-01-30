import { Weather } from "@/lib/types";

interface WeatherWidgetProps {
  weather: Weather | null;
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  if (!weather) return null;

  const isRaining = weather.rainfall > 0;

  return (
    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
        <span className="text-xs text-gray-500 font-medium uppercase">Track Temp</span>
        <div className="flex items-center space-x-1 mt-1">
          <span className="text-lg">🌡️</span>
          <span className="font-bold text-gray-900">{Math.round(weather.track_temperature)}°C</span>
        </div>
      </div>
      
      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
        <span className="text-xs text-gray-500 font-medium uppercase">Air Temp</span>
        <div className="flex items-center space-x-1 mt-1">
          <span className="text-lg">🌤️</span>
          <span className="font-bold text-gray-900">{Math.round(weather.air_temperature)}°C</span>
        </div>
      </div>
      
      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
        <span className="text-xs text-gray-500 font-medium uppercase">Rain</span>
        <div className="flex items-center space-x-1 mt-1">
          <span className="text-lg">{isRaining ? "🌧️" : "☁️"}</span>
          <span className={`font-bold ${isRaining ? "text-blue-600" : "text-gray-900"}`}>
            {isRaining ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
}
