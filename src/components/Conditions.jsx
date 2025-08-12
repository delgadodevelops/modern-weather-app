import React from "react";
import { FiThermometer, FiCloudRain, FiWind, FiSun } from "react-icons/fi";

const Conditions = ({ weather }) => {
  if (!weather) return null;

  const feelsLike = Math.round(weather.main?.feels_like ?? 0);
  // OpenWeather (units=metric) returns wind.speed in m/s → convert to km/h
  const windKmh =
    weather.wind?.speed != null ? Math.round(weather.wind.speed * 3.6) : 0;
  const cloudCover = weather.clouds?.all ?? 0;

  const Item = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 sm:p-4">
      <div className="shrink-0 text-2xl sm:text-3xl">{icon}</div>
      <div>
        <p className="text-xs sm:text-sm text-gray-400">{label}</p>
        <p className="text-lg sm:text-xl font-semibold text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#1F2937] rounded-2xl p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
      <Item
        icon={<FiThermometer className="text-blue-400" />}
        label="Real Feel"
        value={`${feelsLike}°C`}
      />
      <Item
        icon={<FiCloudRain className="text-blue-300" />}
        label="Cloud Cover"
        value={`${cloudCover}%`}
      />
      <Item
        icon={<FiWind className="text-cyan-300" />}
        label="Wind"
        value={`${windKmh} km/h`}
      />
      {/* UV Index placeholder (One Call needed for real UV) */}
      <Item
        icon={<FiSun className="text-yellow-400" />}
        label="UV Index"
        value="3"
      />
    </div>
  );
};

export default Conditions;
