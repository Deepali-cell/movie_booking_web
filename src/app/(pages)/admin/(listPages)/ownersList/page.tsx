"use client";

import { OwnerType } from "@/lib/types";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [ownerList, setOwnerList] = useState<OwnerType[]>([]);

  const fetchOwnerList = async () => {
    try {
      const { data } = await axios.get("/api/admin/ownersList");
      if (data.success) {
        setOwnerList(data.ownersList);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Error fetching owner list:", error);
      toast.error("Error fetching owner list");
    }
  };

  useEffect(() => {
    fetchOwnerList();
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">🎭 All Theater Owners</h2>

      {ownerList.length === 0 ? (
        <p className="text-gray-400">No theater owners found.</p>
      ) : (
        <div className="space-y-6">
          {ownerList.map((owner, index) => (
            <div
              key={index}
              className="border border-gray-700 bg-gray-900 rounded-lg p-4 shadow-md"
            >
              {/* Owner Profile */}
              <div className="flex items-center gap-4 mb-4">
                {/* <Image
                  src={owner.userId.image}
                  alt={owner.userId.name}
                  fill
                  className="object-cover"
                  sizes="56px" // matches w-14 (14 * 4 = 56px)
                /> */}
                <div>
                  <h3 className="text-lg font-semibold">{owner.userId.name}</h3>
                  <p className="text-sm text-gray-400">{owner.userId.email}</p>
                  <p className="text-sm text-gray-400">
                    📞 {owner.userId.phoneNumber}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-6 text-sm text-gray-300 mb-3">
                <p>
                  ✅ Verified:{" "}
                  <span
                    className={
                      owner.isVerified ? "text-green-400" : "text-red-400"
                    }
                  >
                    {owner.isVerified ? "Yes" : "No"}
                  </span>
                </p>
                <p>
                  🔓 Active:{" "}
                  <span
                    className={
                      owner.isActive ? "text-green-400" : "text-red-400"
                    }
                  >
                    {owner.isActive ? "Yes" : "No"}
                  </span>
                </p>
                <p>🎟️ Theaters: {owner.theaters.length}</p>
              </div>

              {/* Theaters Owned */}
              {owner.theaters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {owner.theaters.map((theater) => (
                    <div
                      key={theater._id}
                      className="p-3 bg-gray-800 rounded border border-gray-600"
                    >
                      <h4 className="font-semibold text-white mb-1">
                        🎬 {theater.name}
                      </h4>
                      <p className="text-sm text-gray-400">
                        🏙️ {theater?.location?.city || "City not available"}
                      </p>
                      <p className="text-sm">
                        🛡️ Status:{" "}
                        <span
                          className={
                            theater?.isActive
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {theater?.isActive ? "Active" : "Inactive"}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="italic text-gray-400">No theaters owned yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
