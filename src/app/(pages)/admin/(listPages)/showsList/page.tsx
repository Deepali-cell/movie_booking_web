"use client";

import Loading from "@/components/common/Loading";
import { Badge } from "@/components/ui/badge";
import { useStateContext } from "@/context/StateContextProvider";
import { ShowType, TheaterType } from "@/lib/types";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AdminTheaterShowsPage = () => {
  const { alltheaterList } = useStateContext();
  const [selectedTheaterId, setSelectedTheaterId] = useState("");
  const [showList, setShowList] = useState<ShowType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchShowList = async (theaterId: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/admin/showsList?theaterId=${theaterId}`
      );

      if (data.success) {
        setShowList(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("❌ Error fetching shows:", error);
      toast.error("Error fetching shows");
    } finally {
      setLoading(false);
    }
  };

  const handleTheaterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const theaterId = e.target.value;
    setSelectedTheaterId(theaterId);
    if (theaterId) {
      fetchShowList(theaterId);
    } else {
      setShowList([]); // clear shows if no theater selected
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-600">
            {status}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-600">
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-green-600">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="px-4 md:px-10 text-white">
      <h1 className="text-2xl font-bold mb-4">🎬 View Shows by Theater</h1>

      {/* Dropdown to select theater */}
      <select
        className="bg-gray-900 border border-gray-600 text-white px-3 py-2 rounded mb-6"
        value={selectedTheaterId}
        onChange={handleTheaterChange}
      >
        <option value="">Select Theater</option>
        {alltheaterList.map((theater: TheaterType) => (
          <option key={theater._id} value={theater._id}>
            {theater.name} - {theater.location?.city}
          </option>
        ))}
      </select>

      {/* Loading */}
      {loading && <Loading />}

      {/* Show List */}
      {!loading && showList.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {showList.map((show: ShowType, idx: number) => (
            <div
              key={idx}
              className="bg-gray-800 p-4 rounded border border-gray-600 shadow"
            >
              <div className="mb-3 w-full h-40 relative">
                <Image
                  src={show.movie?.poster_path}
                  alt={show.movie?.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <h2 className="text-lg font-semibold">{show.movie?.title}</h2>
              <p className="text-sm text-gray-400 italic">
                {show.movie?.tagline}
              </p>

              <div className="text-sm mt-2 space-y-1">
                <p>🧮 Price: ₹{show.showPrice}</p>
                <p>📅 Date: {show.showDate}</p>
                <p>⏰ Time: {show.showTime}</p>
                <p>🧾 Runtime: {show.movie?.runtime} mins</p>
                <p>
                  🎭 Screen: {show.blockId?.name} ({show.blockId?.screen})
                </p>
                <p>
                  ⭐ {show.movie?.vote_average} ({show.movie?.vote_count} votes)
                </p>
                {getStatusBadge(show.status)}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && selectedTheaterId && showList.length === 0 && (
        <p className="text-gray-400 italic">No shows found for this theater.</p>
      )}
    </div>
  );
};

export default AdminTheaterShowsPage;
