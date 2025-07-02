"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AllTheaters from "@/components/common/AllTheaters";

const Page = () => {
  const defaultFilters = {
    city: "",
    state: "",
    refundable: false,
    screen: "",
    language: "",
    genre: "",
    foodCourt: false,
    tier: "",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [alltheaterList, setalltheaterList] = useState([]);

  useEffect(() => {
    const fetchFilteredTheaters = async () => {
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (typeof value === "boolean" && value === true) {
            params.append(key, "true");
          } else if (value !== "" && value !== false) {
            params.append(key, value);
          }
        });

        const { data } = await axios.get(
          `/api/user/query/theaterQuery?${params.toString()}`
        );
        if (data.success) {
          setalltheaterList(data.theaters);
        }
      } catch (err) {
        console.error("❌ Error fetching filtered theaters:", err);
      }
    };

    fetchFilteredTheaters();
  }, [filters]);

  return (
    <div className="p-6 pt-20 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🎬 Find Your Perfect Theater
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 w-full max-w-5xl">
        <input
          type="text"
          placeholder="City"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className="p-2 border rounded w-full"
        />

        <input
          type="text"
          placeholder="State"
          value={filters.state}
          onChange={(e) => setFilters({ ...filters, state: e.target.value })}
          className="p-2 border rounded w-full"
        />

        <select
          value={filters.screen}
          onChange={(e) => setFilters({ ...filters, screen: e.target.value })}
          className="p-2 border rounded w-full"
        >
          <option value="" className="text-black">
            Screen Type
          </option>
          <option value="Normal" className="text-black">
            Normal
          </option>
          <option value="3D" className="text-black">
            3D
          </option>
          <option value="IMAX" className="text-black">
            IMAX
          </option>
        </select>

        <select
          value={filters.language}
          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
          className="p-2 border rounded w-full"
        >
          <option value="" className="text-black">
            Language
          </option>
          <option value="Hindi" className="text-black">
            Hindi
          </option>
          <option value="English" className="text-black">
            English
          </option>
          <option value="Tamil" className="text-black">
            Tamil
          </option>
        </select>

        <select
          value={filters.genre}
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
          className="p-2 border rounded w-full"
        >
          <option value="" className="text-black">
            Genre
          </option>
          <option value="Action" className="text-black">
            Action
          </option>
          <option value="Comedy" className="text-black">
            Comedy
          </option>
          <option value="Horror" className="text-black">
            Horror
          </option>
        </select>

        <select
          value={filters.tier}
          onChange={(e) => setFilters({ ...filters, tier: e.target.value })}
          className="p-2 border rounded w-full"
        >
          <option value="" className="text-black">
            Tier
          </option>
          <option value="normal" className="text-black">
            Normal
          </option>
          <option value="premium" className="text-black">
            Premium
          </option>
          <option value="luxury" className="text-black">
            Luxury
          </option>
          <option value="budget" className="text-black">
            Budget
          </option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.refundable}
            onChange={(e) =>
              setFilters({ ...filters, refundable: e.target.checked })
            }
          />
          Refundable
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.foodCourt}
            onChange={(e) =>
              setFilters({ ...filters, foodCourt: e.target.checked })
            }
          />
          Has Food Court
        </label>
      </div>

      <button
        onClick={() => setFilters(defaultFilters)}
        className="mb-12 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
      >
        Reset Filters
      </button>

      {alltheaterList.length > 0 ? (
        <AllTheaters alltheaterList={alltheaterList} />
      ) : (
        <div className="text-center mt-20 animate-pulse">
          <div className="text-6xl mb-4">🤔</div>
          <p className="text-xl text-gray-500">
            Oops! Aapki filter ki khoj me koi theater nahi mila...
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Try changing your filters — ya sab free hai, mast enjoy karo 😄
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
