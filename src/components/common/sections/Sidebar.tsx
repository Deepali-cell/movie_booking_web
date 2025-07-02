"use client";
import React from "react";

const tabs = [
  { id: "overview", label: "🎭 Overview" },
  { id: "movies", label: "🎬 Movies" },
  { id: "shows", label: "🕒 Shows" },
  { id: "foodcourts", label: "🍔 Food Courts" },
];

const Sidebar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}) => {
  return (
    <div className="w-52 bg-[#1a1a1a] rounded-xl shadow-md p-4 space-y-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
            activeTab === tab.id
              ? "bg-white text-black"
              : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
