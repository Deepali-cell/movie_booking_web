"use client";

import React from "react";
import { useStateContext } from "@/context/StateContextProvider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { TheaterType } from "@/lib/types";

const AdminTheaterListPage = () => {
  const { alltheaterList } = useStateContext();

  return (
    <div className="px-4 md:px-10 text-white">
      <h1 className="text-2xl font-bold mb-6">🎭 All Theaters</h1>

      {alltheaterList?.length === 0 ? (
        <p className="text-white italic">No theaters found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {alltheaterList.map((theater: TheaterType, index: number) => (
            <Card
              key={index}
              className="text-white bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="mb-3">
                <Image
                  src={theater.image}
                  alt={theater.name}
                  fill
                  className="object-cover rounded"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <h2 className="text-xl font-semibold">{theater.name}</h2>
              <p className="text-sm text-gray-400 italic mb-2 capitalize">
                Tier: {theater.tier}
              </p>

              <div className="text-sm space-y-1">
                <p>
                  📍 {theater.location?.city}, {theater.location?.state}
                </p>
                <p>☎️ {theater.contact?.phone}</p>
                <p>📧 {theater.contact?.email}</p>
                <p>🛋️ Screens: {theater.screens?.length}</p>
                <p>🎬 Movies Playing: {theater.moviesPlaying?.length}</p>
                <p>⭐ Rating: {theater.ratings?.totalRatings}</p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={
                    theater.isVerified ? "bg-green-600" : "bg-yellow-600"
                  }
                >
                  {theater.isVerified ? "Verified" : "Not Verified"}
                </Badge>
                <Badge
                  variant="outline"
                  className={theater.isActive ? "bg-blue-600" : "bg-red-600"}
                >
                  {theater.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTheaterListPage;
