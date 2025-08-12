import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCloud, FiMap, FiSettings } from "react-icons/fi";
import { MdLocationCity } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { icon: <FiCloud size={24} />, label: "Weather" },
    { icon: <MdLocationCity size={24} />, label: "Cities" },
    { icon: <FiMap size={24} />, label: "Map" },
    { icon: <FiSettings size={24} />, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white text-2xl"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.aside
            key="sidebar"
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:rounded-2xl lg:w-20 w-full lg:h-screen h-full bg-[#1F2937] flex flex-col items-center py-8 space-y-8 shadow-xl fixed lg:static z-50"
          >
            {navItems.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-300 hover:text-white transition-colors flex flex-col items-center"
              >
                {item.icon}
                <span className="text-xs mt-1 block lg:hidden">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
