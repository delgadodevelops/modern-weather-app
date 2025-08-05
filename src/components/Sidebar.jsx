import React from "react";
import { motion } from "framer-motion";
import { FiCloud, FiMap, FiSettings } from "react-icons/fi";
import { MdLocationCity } from "react-icons/md";

const Sidebar = () => {
  const navItems = [
    { icon: <FiCloud size={24} />, label: "Weather" },
    { icon: <MdLocationCity size={24} />, label: "Cities" },
    { icon: <FiMap size={24} />, label: "Map" },
    { icon: <FiSettings size={24} />, label: "Settings" },
  ];

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className=" rounded-2xl w-20 bg-[#1F2937] flex flex-col items-center py-8 space-y-8 shadow-xl m-4"
    >
      {navItems.map((item, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-300 hover:text-white transition-colors"
        >
          {item.icon}
        </motion.button>
      ))}
    </motion.aside>
  );
};

export default Sidebar;
