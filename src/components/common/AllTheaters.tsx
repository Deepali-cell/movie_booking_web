"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import Loading from "./Loading";
import { TheaterType } from "@/lib/types";

const AllTheaters = ({
  alltheaterList,
}: {
  alltheaterList: TheaterType[] | null;
}) => {
  const router = useRouter();

  if (!alltheaterList) return <Loading />;

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      {alltheaterList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alltheaterList.map((theater) => (
            <div
              key={theater._id}
              onClick={() => router.push(`/theater/${theater._id}`)}
              className="cursor-pointer bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <div className="relative w-full h-48">
                <Image
                  src={theater.image}
                  alt={theater.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw,
                         (max-width: 1200px) 50vw,
                         33vw"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-1">{theater.name}</h2>
                <p className="text-sm text-gray-400">
                  {theater.location?.city}, {theater.location?.state},{" "}
                  {theater.location?.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic mt-8">No theaters available.</p>
      )}
    </div>
  );
};

export default AllTheaters;
