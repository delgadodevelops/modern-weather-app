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
    <div className="flex justify-between items-center p-8 backdrop-blur-lg w-full">
      {/* Left Side */}
      <div>
        <h1 className="text-6xl font-bold mb-3 text-white">{name}</h1>
        <p className="text-gray-300 capitalize">{desc}</p>
        <h2 className="text-5xl font-bold mt-6 text-white">{temp}°C</h2>
      </div>

      {/* Right Side */}
      <div className="flex flex-col items-center mr-32">
        <img src={icon} alt={condition} className="w-36 h-36" />
        <p className="text-gray-300 mt-4">
          H: {Math.round(main.temp_max)}° / L: {Math.round(main.temp_min)}°
        </p>
      </div>
    </div>
  );
};

export default WeatherMain;
