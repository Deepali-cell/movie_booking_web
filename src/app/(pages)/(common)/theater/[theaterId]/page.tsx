"use client";
import { useParams } from "next/navigation";
import React, { useCallback, useState } from "react";
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

  if (!detail) return <Loading />;

  return (
    <div className="pt-20 px-4 md:px-10 text-white bg-[#111] min-h-screen">
      {/* Sidebar layout */}
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 ml-6">
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
