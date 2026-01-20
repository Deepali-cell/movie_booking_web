"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { TheaterType } from "@/lib/types";
import TheaterCard from "./card/TheaterCard";

const AllTheaters = ({
  alltheaterList,
}: {
  alltheaterList: TheaterType[] | null;
}) => {
  const router = useRouter();

  if (!alltheaterList)
    return (
      <div className="p-6 rounded-xl min-h-screen bg-black text-white">
        <h2 className="text-2xl font-semibold mb-6 animate-pulse">
          Please wait, loading theaters...
        </h2>

        {/* Skeleton grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-gray-800 rounded-xl p-4 flex flex-col gap-4 animate-pulse"
            >
              <div className="h-48 w-full bg-gray-700 rounded-md"></div>
              <div className="h-6 w-3/4 bg-gray-700 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="p-6 rounded-xl min-h-screen bg-black text-white">
      {alltheaterList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {alltheaterList.map((theater) => (
            <TheaterCard key={theater._id} theater={theater} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic mt-8">No theaters available.</p>
      )}
    </div>
  );
};

export default AllTheaters;
