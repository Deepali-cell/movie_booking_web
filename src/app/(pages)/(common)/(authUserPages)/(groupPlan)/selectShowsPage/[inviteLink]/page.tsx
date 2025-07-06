"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import ShowCard from "@/components/common/card/ShowCard";
import { ShowType, TheaterType } from "@/lib/types";

type TheaterWithShows = TheaterType & { shows: ShowType[] };

export default function SelectShowsPage() {
  const searchParams = useSearchParams();
  const { inviteLink } = useParams();
  const router = useRouter();

  const [theatersData, setTheatersData] = useState<TheaterWithShows[]>([]);
  const [selectedShows, setSelectedShows] = useState<{
    [theaterId: string]: string[];
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAlreadySelected = async () => {
      try {
        const { data } = await axios.get(
          `/api/groupData?inviteLink=${inviteLink}`
        );
        if (data.hasSelectedShows) {
          router.replace(`/summary/${inviteLink}`);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkAlreadySelected();
  }, [inviteLink, router]);

  useEffect(() => {
    const theaterIds = searchParams.get("theaters")?.split(",") || [];

    const fetchShows = async () => {
      try {
        const res = await axios.get(
          `/api/getShows?theaters=${theaterIds.join(",")}`
        );
        setTheatersData(res.data.theaters);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchShows();
  }, [searchParams]);

  const toggleShow = (theaterId: string, showId: string) => {
    setSelectedShows((prev) => {
      const currentShows = prev[theaterId] || [];
      const isSelected = currentShows.includes(showId);

      return {
        ...prev,
        [theaterId]: isSelected
          ? currentShows.filter((id) => id !== showId)
          : [...currentShows, showId],
      };
    });
  };

  const handleNext = async () => {
    if (Object.keys(selectedShows).length < 1) {
      toast.error("Please select at least one show.");
      return;
    }

    try {
      const { data } = await axios.post("/api/selection", {
        inviteLink,
        shows: selectedShows,
      });

      if (data.success) {
        toast.success("Shows selected!");
        router.push(`/summary/${inviteLink}`);
      } else {
        toast.error(data.message || "Failed to save selections.");
      }
    } catch (err) {
      console.error("Failed to save shows:", err);
      toast.error("An error occurred.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 pt-20 mx-auto min-h-screen">
      <h2 className="text-3xl font-bold mb-8">Select Shows</h2>
      {theatersData.map((theater) => (
        <div key={theater._id} className="mb-10">
          <div className="mb-4">
            <h3 className="text-2xl font-semibold">
              🎭 {theater.name}{" "}
              <span className="text-sm text-gray-400">({theater.tier})</span>
            </h3>
            <p className="text-gray-400 text-sm">
              📍 {theater.location?.city}, {theater.location?.state}
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {theater.shows.map((show) => (
              <ShowCard
                key={show._id}
                show={show}
                fetchTheaterDetails={() => {}}
                isSelected={selectedShows[theater._id]?.includes(show._id)}
                onSelect={() => toggleShow(theater._id, show._id)}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-full"
        >
          Finalize Shows
        </button>
      </div>
    </div>
  );
}
