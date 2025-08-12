// src/components/ui/ForecastCard.jsx
import React from "react";
import clsx from "clsx";

const ForecastCard = ({
  top, // time or weekday
  icon, // img src
  mid, // temperature
  bottom, // small caption (optional)
  variant = "tile", // "tile" | "row"
  className = "",
}) => {
  const base = "bg-[#1E293B] rounded-xl text-white shadow-md overflow-hidden";

  const tile =
    "w-24 h-28 sm:w-28 sm:h-32 p-4 flex flex-col items-center justify-center";

  const row = "w-full h-16 sm:h-20 px-4 flex items-center justify-between";

  return (
    <div className={clsx(base, variant === "tile" ? tile : row, className)}>
      {variant === "tile" ? (
        <>
          {top && (
            <span className="text-xs sm:text-sm text-gray-300">{top}</span>
          )}
          {icon && (
            <img src={icon} alt="" className="w-7 h-7 my-1 sm:w-8 sm:h-8" />
          )}
          {mid && (
            <span className="text-lg sm:text-xl font-semibold">{mid}</span>
          )}
          {bottom && (
            <span className="text-[11px] sm:text-xs text-gray-400 mt-0.5 text-center">
              {bottom}
            </span>
          )}
        </>
      ) : (
        // row layout
        <>
          <span className="text-sm sm:text-base text-gray-300">{top}</span>
          <div className="flex items-center gap-3">
            {icon && (
              <img src={icon} alt="" className="w-7 h-7 sm:w-8 sm:h-8" />
            )}
            <span className="text-base sm:text-lg font-semibold">{mid}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ForecastCard;
