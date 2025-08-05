// src/components/Forecast.jsx
import React from "react";
import weatherIcons from "../utils/weatherIcons";

const Forecast = ({ daily }) => {
  if (!daily || daily.length === 0) return null;

  return (
    <div className="grid grid-rows-7 gap-3 h-full">
      {daily.map((day, i) => {
        const icon = weatherIcons[day.condition] || weatherIcons["Clouds"];
        return (
          <div
            key={i}
            className="flex justify-between items-center bg-[#111827] rounded-xl p-4"
          >
            <span className="text-gray-300">{day.date}</span>
            <img src={icon} alt={day.desc} className="w-8 h-8" />
            <span className="font-semibold">{day.temp}°C</span>
          </div>
        );
      })}
    </div>
  );
};

export default Forecast;
