import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiMapPin } from "react-icons/fi";
import useDebounce from "../hooks/useDebounce";

const API_KEY = import.meta.env.VITE_API_KEY;

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  // Suggestions / dropdown
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Recent searches
  const [recent, setRecent] = useState(() => {
    try {
      const raw = localStorage.getItem("recentCities");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const debouncedCity = useDebounce(city, 250);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const disabled = city.trim().length === 0 || loading;

  const saveRecent = (value) => {
    const next = [
      value,
      ...recent.filter((c) => c.toLowerCase() !== value.toLowerCase()),
    ].slice(0, 5);
    setRecent(next);
    localStorage.setItem("recentCities", JSON.stringify(next));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    setLoading(true);
    try {
      await onSearch(city.trim());
      saveRecent(city.trim());
      setOpen(false);
    } finally {
      setLoading(false);
      setCity("");
      setActiveIndex(-1);
    }
  };

  const selectSuggestion = async (s) => {
    setOpen(false);
    setCity("");
    saveRecent(s);
    await onSearch(s);
  };

  // 🔎 Autocomplete (OpenWeather geocoding)
  useEffect(() => {
    const q = debouncedCity.trim();

    // If no API key or very short query: show recent only (if any) and bail
    if (!API_KEY || q.length < 2) {
      setSuggestions([]);
      setOpen(
        recent.length > 0 &&
          (city.length > 0 || document.activeElement === inputRef.current)
      );
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const resp = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            q
          )}&limit=5&appid=${API_KEY}`
        );
        const data = await resp.json();
        if (cancelled) return;
        const names = Array.isArray(data)
          ? data.map((d) =>
              [d.name, d.state, d.country].filter(Boolean).join(", ")
            )
          : [];
        setSuggestions(names);
        setOpen(
          (names.length > 0 || recent.length > 0) &&
            (city.length > 0 || document.activeElement === inputRef.current)
        );
      } catch {
        setSuggestions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedCity, recent.length, city.length]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (!listRef.current || !inputRef.current) return;
      if (
        !listRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Merge suggestions + recent (dedup)
  const dropdownItems = useMemo(() => {
    const lower = new Set(suggestions.map((s) => s.toLowerCase()));
    return [
      ...suggestions,
      ...recent.filter((r) => !lower.has(r.toLowerCase())),
    ];
  }, [suggestions, recent]);

  const onKeyDown = (e) => {
    if (!open || dropdownItems.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % dropdownItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (i) => (i - 1 + dropdownItems.length) % dropdownItems.length
      );
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        selectSuggestion(dropdownItems[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  // 📍 Geolocate → reverse geocode → onSearch
  const handleGeolocate = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLoading(true);
    try {
      await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        })
      ).then(async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
        );
        const data = await res.json();
        const first = Array.isArray(data) && data[0];
        const label = first
          ? [first.name, first.state, first.country].filter(Boolean).join(", ")
          : `${lat.toFixed(3)}, ${lon.toFixed(3)}`;

        await onSearch(label);
        saveRecent(label);
        setCity("");
        setOpen(false);
      });
    } catch (err) {
      console.error("Geolocate error:", err);
      alert(
        "Could not get your location. Please allow location access or try again."
      );
    } finally {
      setGeoLoading(false);
    }
  };

  return (
    <div className="relative z-[60] w-full max-w-xl mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          w-full flex items-center
          bg-white/10 backdrop-blur-lg
          rounded-xl shadow-lg overflow-hidden
          border border-white/20
        "
      >
        <input
          ref={inputRef}
          type="search"
          placeholder="Search city…"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          className="
            flex-1 px-4 h-12
            bg-transparent text-white placeholder-gray-300
            text-sm sm:text-base
            focus:outline-none
          "
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="search-suggestions"
        />

        {/* 📍 Geolocate button */}
        <button
          type="button"
          onClick={handleGeolocate}
          disabled={geoLoading || !API_KEY}
          className={`
            h-12 px-3 sm:px-4
            flex items-center justify-center
            text-white/80 hover:text-white
            ${geoLoading ? "opacity-60 cursor-wait animate-pulse" : ""}
          `}
          title="Use my location"
          aria-label="Use my location"
        >
          <FiMapPin className="text-lg" />
        </button>

        {/* Clear button */}
        {city && (
          <button
            type="button"
            onClick={() => setCity("")}
            className="px-2 text-gray-300 hover:text-white"
            aria-label="Clear search"
          >
            ×
          </button>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={city.trim().length === 0 || loading}
          className={`
            h-12 px-5 sm:px-6
            flex items-center justify-center
            bg-gradient-to-r from-blue-400 to-indigo-500
            font-semibold
            ${
              city.trim().length === 0 || loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:opacity-90"
            }
            text-white text-sm sm:text-base
          `}
          aria-busy={loading}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </motion.form>

      {/* Dropdown */}
      {open && dropdownItems.length > 0 && (
        <div
          ref={listRef}
          id="search-suggestions"
          className="
            absolute left-0 right-0 mt-2
            bg-[#111827] border border-white/10 rounded-xl shadow-2xl
            max-h-72 overflow-y-auto
          "
          role="listbox"
        >
          {dropdownItems.map((item, idx) => (
            <button
              key={item + idx}
              role="option"
              aria-selected={idx === activeIndex}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectSuggestion(item)}
              className={`
                w-full text-left px-4 py-2
                ${idx === activeIndex ? "bg-white/10" : "bg-transparent"}
                text-gray-200 hover:bg-white/10
              `}
            >
              {item}
            </button>
          ))}

          {recent.length > 0 && (
            <div className="flex justify-end border-t border-white/10">
              <button
                onClick={() => {
                  setRecent([]);
                  localStorage.removeItem("recentCities");
                }}
                className="text-xs text-gray-400 hover:text-gray-200 px-3 py-2"
              >
                Clear recent
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
