"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Loading from "./Loading";
import { TheaterType } from "@/lib/types";
import TheaterCard from "./card/TheaterCard";

const AllTheaters = ({
  alltheaterList,
}: {
  alltheaterList: TheaterType[] | null;
}) => {
  const router = useRouter();

  if (!alltheaterList) return <Loading />;

  return (
    <div className="p-6 rounded-xl min-h-screen bg-black text-white">
      {alltheaterList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {alltheaterList.map((theater) => {
            return <TheaterCard key={theater._id} theater={theater} />;
          })}
        </div>
      ) : (
        <p className="text-gray-500 italic mt-8">No theaters available.</p>
      )}
    </div>
  );
};

export default AllTheaters;
