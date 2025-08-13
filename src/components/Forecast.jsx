// src/components/Forecast.jsx
import React from "react";
import ForecastCard from "./ui/ForecastCard";
import weatherIcons from "../utils/weatherIcons";

const Forecast = ({ daily }) => {
  if (!daily || daily.length === 0) return null;

  // parent in App gives this container flex-1; we fill it with 7 rows
  return (
    <div className="grid grid-rows-7  gap-3 h-full">
      {daily.slice(0, 7).map((day, i) => {
        // use your custom icon map if available, else fall back to OWM code if you stored it
        const mapped = weatherIcons?.[day.condition];
        const icon =
          mapped ||
          (day.icon
            ? `https://openweathermap.org/img/wn/${day.icon}@2x.png`
            : null);

        return (
          <ForecastCard
            key={i}
            variant="row" // full-width row layout
            top={day.date} // "Today", "Wed", etc.
            icon={icon}
            mid={`${day.temp}°C`}
            className=" bg-white/5"
          />
        );
      })}
    </div>
  );
};

export default Forecast;
