// src/components/TodayForecast.jsx
import React from "react";
import { motion } from "framer-motion";

const TodayForecast = ({ hourly }) => {
  if (!hourly || hourly.length === 0) return null;

  // Limit to the next 8 hours (adjust as needed)
  const todayHours = hourly.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-[#1e293b] rounded-2xl p-6 text-white shadow-lg"
    >
      <h3 className="text-lg font-semibold mb-4">Today's Forecast</h3>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
        {todayHours.map((h, i) => (
          <div
            key={i}
            className="flex flex-col items-center bg-white/5 rounded-lg p-2"
          >
            {/* Time */}
            <p className="text-sm">{h.time}</p>

            {/* Weather icon */}
            <img
              src={`https://openweathermap.org/img/wn/${h.icon}@2x.png`}
              alt={h.condition || "weather"}
              className="w-10 h-10"
            />

            {/* Temp */}
            <p className="font-bold">{h.temp}°</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TodayForecast;


