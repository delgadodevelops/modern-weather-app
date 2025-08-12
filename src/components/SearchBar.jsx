import React, { useState } from "react";
import { motion } from "framer-motion";

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setCity("");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="
        relative z-10
        w-full max-w-md
        mx-auto
        flex items-center
        bg-white/10 backdrop-blur-lg
        rounded-xl shadow-lg overflow-hidden
        border border-white/20
      "
    >
      <input
        type="text"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="
          flex-1
          px-4
          h-12
          bg-transparent text-white placeholder-gray-300
          text-sm sm:text-base
          focus:outline-none
        "
      />
      <button
        type="submit"
        className="
          h-12
          px-5 sm:px-6
          flex items-center justify-center
          bg-gradient-to-r from-blue-400 to-indigo-500
          text-white font-semibold
          hover:opacity-90 transition
          text-sm sm:text-base
        "
      >
        Search
      </button>
    </motion.form>
  );
};

export default SearchBar;
