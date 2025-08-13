import React from "react";
import { motion } from "framer-motion";

const CARD_BG = "bg-[#1E293B]"; // same shade everywhere

const TodayForecast = ({ hourly = [] }) => {
  if (!hourly.length) return null;

  const items = hourly.slice(0, 8);

  const Card = ({ h }) => (
    <motion.div
      whileHover={{ y: -2 }}
      className={`${CARD_BG} rounded-xl  bg-white/5 px-3 py-3 flex flex-col items-center justify-center
                  shrink-0 w-24 h-28 sm:w-auto sm:h-28 shadow-sm`}
    >
      <span className="text-[11px] text-gray-300">{h.time}</span>
      <img
        src={`https://openweathermap.org/img/wn/${h.icon}@2x.png`}
        alt={h.condition || "weather"}
        className="w-7 h-7 my-1"
      />
      <span className="text-white text-lg font-semibold">{h.temp}°</span>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#1F2937] rounded-2xl p-4 sm:p-6 text-white shadow-lg"
    >
      <h3 className="text-base sm:text-lg font-semibold mb-4">
        Today’s Forecast
      </h3>

      {/* Mobile: horizontal scroll row */}
      <div className="sm:hidden -mx-2 px-2 overflow-x-auto">
        <div className="flex gap-3 snap-x snap-mandatory">
          {items.map((h, i) => (
            <div key={i} className="snap-start">
              <Card h={h} />
            </div>
          ))}
        </div>
      </div>

      {/* ≥ sm: 8-column grid */}
      <div className="hidden sm:grid grid-cols-4 md:grid-cols-8 gap-3">
        {items.map((h, i) => (
          <Card key={i} h={h} />
        ))}
      </div>
    </motion.div>
  );
};

export default TodayForecast;
