// src/App.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import WeatherMain from "./components/WeatherMain";
import TodayForecast from "./components/TodayForecast";
import Forecast from "./components/Forecast";
import Conditions from "./components/Conditions";
import weatherIcons from "./utils/weatherIcons";
import { AnimatePresence, motion } from "framer-motion";

const API_KEY = import.meta.env.VITE_API_KEY;

const App = () => {
  const [city, setCity] = useState("Miami");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState({ hourly: [], daily: [] });

  const fetchWeather = async (cityName) => {
    try {
      const res1 = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${API_KEY}&units=metric`
      );
      const data1 = await res1.json();

      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          cityName
        )}&appid=${API_KEY}&units=metric`
      );
      const data2 = await res2.json();

      const hourly = data2.list.slice(0, 8).map((r) => ({
        time: new Date(r.dt * 1000).toLocaleTimeString("en-US", {
          hour: "numeric",
        }),
        temp: Math.round(r.main.temp),
        icon: r.weather[0].icon,
        condition: r.weather[0].main,
      }));

      const today = {
        date: "Today",
        temp: Math.round(data1.main.temp),
        desc: data1.weather[0].description,
        condition: data1.weather[0].main,
      };

      let nextDays = data2.list
        .filter((r) => r.dt_txt.includes("12:00:00"))
        .slice(0, 6)
        .map((r) => ({
          date: new Date(r.dt * 1000).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          temp: Math.round(r.main.temp),
          desc: r.weather[0].description,
          condition: r.weather[0].main,
        }));

      while (nextDays.length < 6) {
        const last = nextDays[nextDays.length - 1] || today;
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() + (nextDays.length + 1));
        nextDays.push({
          date: baseDate.toLocaleDateString("en-US", { weekday: "short" }),
          temp: last.temp,
          desc: last.desc,
          condition: last.condition,
        });
      }

      const daily = [today, ...nextDays];
      setWeather(data1);
      setForecast({ hourly, daily });
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
  });

  useEffect(() => {
    if (weather) document.title = `${city} Weather 🌤️`;
  }, [weather, city]);

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      <Sidebar />

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#111827] z-40">
        <div className="h-14 flex items-center justify-center px-4">
          <h1 className="text-white font-semibold text-base">
            Modern Weather App
          </h1>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {weather && (
          <motion.div
            key={`${city}-${weather?.dt ?? ""}`}
            {...fadeUp(0)}
            className="flex-1 p-6 pt-16 lg:pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* LEFT */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <motion.div {...fadeUp(0.1)}>
                <SearchBar
                  onSearch={(val) => {
                    setCity(val);
                    fetchWeather(val);
                  }}
                />
              </motion.div>

              <motion.div {...fadeUp(0.2)} className="flex-1">
                <WeatherMain weather={weather} />
              </motion.div>

              <motion.div {...fadeUp(0.3)}>
                <TodayForecast hourly={forecast.hourly} />
              </motion.div>

              <motion.div
                {...fadeUp(0.4)}
                className="bg-[#1F2937] rounded-2xl p-6 shadow-lg"
              >
                <Conditions weather={weather} />
              </motion.div>
            </div>

            {/* RIGHT */}
            <motion.div
              {...fadeUp(0.5)}
              className="bg-[#1F2937] rounded-2xl p-6 shadow-lg flex flex-col"
            >
              <h2 className="text-lg font-semibold mb-6">7-Day Forecast</h2>
              <div className="grid grid-rows-7 gap-4 flex-1">
                {forecast.daily.map((day, i) => {
                  const icon =
                    weatherIcons[day.condition] || weatherIcons["Clouds"];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.55 + i * 0.05 }}
                      className="flex justify-between items-center bg-[#111827] rounded-xl p-4"
                    >
                      <span className="text-gray-300">{day.date}</span>
                      <img src={icon} alt={day.desc} className="w-8 h-8" />
                      <span className="font-semibold">{day.temp}°C</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
