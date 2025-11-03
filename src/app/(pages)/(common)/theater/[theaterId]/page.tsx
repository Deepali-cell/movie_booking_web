"use client";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import TheaterInfo from "@/components/common/sections/TheaterInfo";
import Sidebar from "@/components/common/sections/Sidebar";
import ShowsSection from "@/components/common/sections/ShowsSection";
import FoodCourtsSection from "@/components/common/sections/FoodCourtsSection";
import Loading from "@/components/common/Loading";

const Page = () => {
  const params = useParams();
  const theaterId = params.theaterId as string;
  const [detail, setDetail] = useState<any>();
  const [activeTab, setActiveTab] = useState<
    "overview" | "shows" | "foodcourts"
  >("overview");

  // ✅ API call to fetch theater details
  const fetchTheaterDetails = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `/api/getTheater?theaterId=${theaterId}`
      );
      if (data.success) {
        setDetail(data.theater);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching theater details:", error);
    }
  }, [theaterId]);

  useEffect(() => {
    if (theaterId) fetchTheaterDetails();
  }, [theaterId, fetchTheaterDetails]);

  if (!detail) return <Loading />;

  return (
    <div className="pt-20 px-2 sm:px-4 md:px-10 text-white bg-[#111] min-h-screen">
      {/* ✅ MOBILE TOP TAB BAR */}
      <div className="md:hidden flex justify-between bg-[#1a1a1a] rounded-xl p-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg text-sm ${
            activeTab === "overview" ? "bg-[#333]" : "opacity-60"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>

        <button
          className={`px-4 py-2 rounded-lg text-sm ${
            activeTab === "shows" ? "bg-[#333]" : "opacity-60"
          }`}
          onClick={() => setActiveTab("shows")}
        >
          Shows
        </button>

        <button
          className={`px-4 py-2 rounded-lg text-sm ${
            activeTab === "foodcourts" ? "bg-[#333]" : "opacity-60"
          }`}
          onClick={() => setActiveTab("foodcourts")}
        >
          Food Courts
        </button>
      </div>

      {/* ✅ RESPONSIVE LAYOUT */}
      <div className="flex flex-col md:flex-row">
        {/* ✅ Sidebar hidden on mobile */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* ✅ Content Section */}
        <div className="flex-1 mt-4 md:mt-0 md:ml-6">
          {activeTab === "overview" && (
            <TheaterInfo
              theater={detail}
              fetchTheaterDetails={fetchTheaterDetails}
            />
          )}

          {activeTab === "shows" && (
            <ShowsSection
              shows={detail.moviesPlaying}
              fetchTheaterDetails={fetchTheaterDetails}
            />
          )}

          {activeTab === "foodcourts" && (
            <FoodCourtsSection
              foodCourts={detail.foodCourts}
              fetchTheaterDetails={fetchTheaterDetails}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
