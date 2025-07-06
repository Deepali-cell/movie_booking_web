"use client";
import React from "react";
import Loading from "../Loading";
import { ShowType } from "@/lib/types";
import ShowCard from "../card/ShowCard";

const ShowsSection = ({
  shows,
  fetchTheaterDetails,
}: {
  shows: ShowType[];
  fetchTheaterDetails: () => void;
}) => {
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
