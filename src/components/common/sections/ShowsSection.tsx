"use client";
import React, { useEffect } from "react";
import Loading from "../Loading";
import { ShowType } from "@/lib/types";
import ShowCard from "../card/ShowCard";
import axios from "axios";

const ShowsSection = ({
  shows,
  fetchTheaterDetails,
}: {
  shows: ShowType[];
  fetchTheaterDetails: () => void;
}) => {
  useEffect(() => {
    const runCleanup = async () => {
      try {
        await axios.get("/api/cleanupShows");
        console.log("✅ Cleanup done from ShowsSection");
      } catch (err) {
        console.error("Cleanup error:", err);
      }
    };

    runCleanup();
  }, []);
  if (!shows) return <Loading />;

  return (
    <div className="pb-20">
      <h2 className="text-3xl font-bold mb-10 text-center text-white">
        🎬 Movie Shows
      </h2>

      <div className="flex flex-col gap-8">
        {shows.map((show) => (
          <ShowCard
            key={show._id}
            show={show}
            fetchTheaterDetails={fetchTheaterDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default ShowsSection;
