"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import TheaterInfo from "@/components/common/sections/TheaterInfo";
import Sidebar from "@/components/common/sections/Sidebar";
import MoviesSection from "@/components/common/sections/MovieSection";
import ShowsSection from "@/components/common/sections/ShowsSection";
import FoodCourtsSection from "@/components/common/sections/FoodCourtsSection";
import Loading from "@/components/common/Loading";

const Page = () => {
  const params = useParams();
  const theaterId = params.theaterId as string;
  const [detail, setDetail] = useState<any>();
  const [activeTab, setActiveTab] = useState<
    "overview" | "movies" | "shows" | "foodcourts"
  >("overview");

  useEffect(() => {
    const fetchTheaterDetails = async () => {
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
    };

    if (theaterId) {
      fetchTheaterDetails();
    }
  }, [theaterId]);

  if (!detail) return <Loading />;

  return (
    <div className="pt-20 px-4 md:px-10 text-white bg-[#111] min-h-screen">
      {/* Sidebar layout */}
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 ml-6">
          {activeTab === "overview" && <TheaterInfo theater={detail} />}
          {activeTab === "movies" && (
            <MoviesSection movies={detail.allMovies} />
          )}
          {activeTab === "shows" && (
            <ShowsSection shows={detail.moviesPlaying} />
          )}
          {activeTab === "foodcourts" && (
            <FoodCourtsSection foodCourts={detail.foodCourts} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
