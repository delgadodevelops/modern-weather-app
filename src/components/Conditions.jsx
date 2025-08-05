import React from "react";
import { FiThermometer, FiCloudRain, FiWind, FiSun } from "react-icons/fi";

const Conditions = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="bg-[#1F2937] rounded-2xl p-2  grid grid-cols-2 gap-6">
      {/* Real Feel */}
      <div className="flex items-center space-x-3">
        <FiThermometer className="text-blue-400 text-2xl" />
        <div>
          <p className="text-sm text-gray-400">Real Feel</p>
          <p className="text-lg font-semibold">{Math.round(weather.main.feels_like)}°C</p>
        </div>
      </div>

      {/* Rain Chance */}
      <div className="flex items-center space-x-3">
        <FiCloudRain className="text-blue-300 text-2xl" />
        <div>
          <p className="text-sm text-gray-400">Chance of Rain</p>
          <p className="text-lg font-semibold">{weather.clouds?.all || 0}%</p>
        </div>
      </div>

      {/* Wind */}
      <div className="flex items-center space-x-3">
        <FiWind className="text-cyan-300 text-2xl" />
        <div>
          <p className="text-sm text-gray-400">Wind</p>
          <p className="text-lg font-semibold">{weather.wind?.speed} km/h</p>
        </div>
      </div>

      {/* UV Index (placeholder since free API doesn’t return UV) */}
      <div className="flex items-center space-x-3">
        <FiSun className="text-yellow-400 text-2xl" />
        <div>
          <p className="text-sm text-gray-400">UV Index</p>
          <p className="text-lg font-semibold">3</p>
        </div>
      </div>
    </div>
  );
};

export default Conditions;
