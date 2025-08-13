import React from "react";
import weatherIcons from "../utils/weatherIcons";

const WeatherMain = ({ weather }) => {
  if (!weather) return null;

  const { name, main, weather: w } = weather;
  const temp = Math.round(main.temp);
  const desc = w[0].description;
  const condition = w[0].main;

  const icon = weatherIcons[condition] || weatherIcons["Clouds"];

  return (
    <div
      className="
        w-full flex items-center
        p-5 sm:p-6 lg:p-10
        gap-4 sm:gap-6 lg:gap-10
      "
    >
      {/* Left: City Info */}
      <div className="flex-1 min-w-0">
        <h1 className="text-4xl sm:text-5xl lg:text-8xl font-bold mb-2 lg:mb-3 text-white truncate">
          {name}
        </h1>
        <p className="text-gray-300 capitalize text-base sm:text-lg lg:text-xl truncate">
          {desc}
        </p>
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mt-4 text-white">
          {temp}°C
        </h2>
      </div>

      {/* Right: Icon + High/Low */}
      <div className="flex flex-col items-center flex-shrink-0 ">
        <img
          src={icon}
          alt={condition}
          className="w-24 h-24 sm:w-28 sm:h-28 lg:w-56 lg:h-56"
        />
        <p className="text-gray-300 font-semibold mt-3 text-sm sm:text-base lg:text-lg">
          H: {Math.round(main.temp_max)}° / L: {Math.round(main.temp_min)}°
        </p>
      </div>
    </div>
  );
};

export default WeatherMain;
