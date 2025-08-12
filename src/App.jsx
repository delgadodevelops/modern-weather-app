import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import WeatherMain from "./components/WeatherMain";
import TodayForecast from "./components/TodayForecast";
import Forecast from "./components/Forecast";
import Conditions from "./components/Conditions";
import { AnimatePresence, motion } from "framer-motion";

const API_KEY =
  import.meta.env.VITE_API_KEY || "c7c9c87e1f5253db1d2bb054446987a9";

const App = () => {
  const [city, setCity] = useState("Miami");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState({ hourly: [], daily: [] });

  const fetchWeather = async (cityName) => {
    try {
      // Current Weather (for today)
      const res1 = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data1 = await res1.json();

      // 5-day / 3-hour Forecast
      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data2 = await res2.json();

      // Hourly Forecast (next 8 intervals, ~24 hours)
      const hourly = data2.list.slice(0, 8).map((r) => ({
        time: new Date(r.dt * 1000).toLocaleTimeString("en-US", {
          hour: "numeric",
        }),
        temp: Math.round(r.main.temp),
        icon: r.weather[0].icon,
        condition: r.weather[0].main,
      }));

      // "Today"
      const today = {
        date: "Today",
        temp: Math.round(data1.main.temp),
        desc: data1.weather[0].description,
        condition: data1.weather[0].main,
      };

      // Following days at noon
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

      // Pad if fewer than 6 entries; roll weekday forward to avoid duplicates
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

  // Dynamic tab title
  useEffect(() => {
    if (weather) document.title = `${city} Weather 🌤️`;
    else document.title = "Weather App 🌤️";
  }, [weather, city]);

  useEffect(() => {
    fetchWeather(city);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#111827] text-white">
      {/* Sidebar (handles its own hamburger button) */}
      <Sidebar />

      {/* Mobile Top Bar: centered title, leaves space for sidebar hamburger on the left */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#111827] z-40">
        <div className="h-14 flex items-center justify-center px-4">
          <h1 className="text-white font-semibold text-base">
            Modern Weather App
          </h1>
        </div>
      </div>

      {/* Animated Dashboard */}
      <AnimatePresence mode="wait">
        {weather && (
          <motion.div
            key={city}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 w-full"
          >
            {/* Add top padding only on mobile to clear the fixed top bar */}
            <div className="p-6 pt-16 lg:pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Search + Main Weather */}
                <motion.div
                  key="main-weather"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="mb-4">
                    <SearchBar
                      onSearch={(val) => {
                        setCity(val);
                        fetchWeather(val);
                      }}
                    />
                  </div>
                  <WeatherMain weather={weather} />
                </motion.div>

                {/* Today’s Forecast (Hourly) */}
                <motion.div
                  key="today-forecast"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <TodayForecast hourly={forecast.hourly} />
                </motion.div>

                {/* Conditions */}
                <motion.div
                  key="conditions"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-[#1F2937] rounded-2xl p-6 shadow-lg"
                >
                  <Conditions weather={weather} />
                </motion.div>
              </div>

              {/* Right Side (7-Day Forecast) */}
              <motion.div
                key="seven-day"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-[#1F2937] rounded-2xl p-6 shadow-lg flex flex-col"
              >
                <h2 className="text-lg font-semibold mb-6">7-Day Forecast</h2>
                <div className="flex-1">
                  <Forecast daily={forecast.daily} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
