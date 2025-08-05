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
      className="flex items-center bg-white/10 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/20"
    >
      <input
        type="text"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 px-3 py-2 bg-transparent text-white placeholder-gray-300 focus:outline-none"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-semibold hover:opacity-90 transition"
      >
        Search
      </button>
    </motion.form>
  );
};

export default SearchBar;
