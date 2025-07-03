"use client";
import Loading from "@/components/common/Loading";
import FoodCourtCard from "@/components/ownerComponents/cardComponents/FoodCourtCard";
import { useStateContext } from "@/context/StateContextProvider";
import { BlockType, FoodCourtType, TheaterType } from "@/lib/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const {
    theaterList,
    fetchBlocks,
    blocks,
    fetchFoodCourts,
    foodCourts,
    setFoodCourts,
  } = useStateContext();

  const [selectedTheaterId, setSelectedTheaterId] = useState<string | null>(
    null
  );
  const [viewOption, setViewOption] = useState<"blocks" | "all" | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // View by Blocks
  const handleViewBlocks = async () => {
    if (!selectedTheaterId) return;
    setViewOption("blocks");
    setSelectedBlock(null);
    setFoodCourts([]);
    setLoading(true);
    await fetchBlocks(selectedTheaterId);
    setLoading(false);
  };

  // View All food courts in Theater
  const handleViewAll = async () => {
    if (!selectedTheaterId) return;
    setViewOption("all");
    setSelectedBlock(null);
    setLoading(true);
    await fetchFoodCourts(selectedTheaterId);
    setLoading(false);
  };

  // Click Block to view its food courts
  const handleBlockClick = async (blockName: string) => {
    if (!selectedTheaterId) return;
    setSelectedBlock(blockName);
    setLoading(true);
    await fetchFoodCourts(selectedTheaterId, blockName);
    setLoading(false);
  };

  // Delete food court
  const handleDeleteFoodCourt = async (foodCourtId: string) => {
    try {
      const res = await axios.delete(
        `/api/owner/deleteFoodCourt?foodCourtId=${foodCourtId}`
      );
      if (res.data.success) {
        toast.success(res.data.message);
        if (selectedTheaterId)
          fetchFoodCourts(selectedTheaterId, selectedBlock || undefined);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Error deleting food court", err);
      toast.error("Failed to delete food court");
    }
  };

  // Delete food item
  const handleDeleteItem = async (foodCourtId: string, item: any) => {
    try {
      const res = await axios.delete(
        `/api/owner/deleteFoodItem?foodCourtId=${foodCourtId}&itemName=${encodeURIComponent(
          item.name
        )}`
      );
      if (res.data.success) {
        toast.success(res.data.message);
        if (selectedTheaterId)
          fetchFoodCourts(selectedTheaterId, selectedBlock || undefined);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Error deleting item", err);
      toast.error("Failed to delete food item");
    }
  };

  return (
    <div className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        🍟 View Food Courts by Theater
      </h1>

      <div className="mb-6 space-x-4">
        {theaterList.map((theater: TheaterType) => (
          <button
            key={theater._id}
            onClick={() => {
              setSelectedTheaterId(theater._id);
              setViewOption(null);
              setSelectedBlock(null);
              setFoodCourts([]);
            }}
            className={`px-4 py-2 rounded-full border transition ${
              selectedTheaterId === theater._id
                ? "bg-white text-black"
                : "bg-transparent text-white border-white hover:bg-white hover:text-black"
            }`}
          >
            {theater.name}
          </button>
        ))}
      </div>

      {selectedTheaterId && (
        <div className="mb-6 flex gap-4">
          <button
            className={`px-4 py-2 border rounded ${
              viewOption === "blocks"
                ? "bg-white text-black"
                : "bg-transparent border-white text-white"
            }`}
            onClick={handleViewBlocks}
          >
            View by Blocks
          </button>
          <button
            className={`px-4 py-2 border rounded ${
              viewOption === "all"
                ? "bg-white text-black"
                : "bg-transparent border-white text-white"
            }`}
            onClick={handleViewAll}
          >
            View All
          </button>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Block buttons */}
          {viewOption === "blocks" && (
            <>
              {blocks.length > 0 ? (
                <div className="mb-6 flex flex-wrap gap-4">
                  {blocks.map((block: BlockType) => (
                    <button
                      key={block._id}
                      onClick={() => handleBlockClick(block.name)}
                      className={`px-4 py-2 border rounded ${
                        selectedBlock === block.name
                          ? "bg-white text-black"
                          : "bg-transparent border-white text-white"
                      }`}
                    >
                      {block.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 6a2 2 0 002-2h12a2 2 0 002 2M4 6l1 14a2 2 0 002 2h10a2 2 0 002-2l1-14H4z"
                    />
                  </svg>
                  <p className="text-lg">
                    No blocks found for this theater yet.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Food courts */}
          {foodCourts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {foodCourts.map((fc: FoodCourtType) => (
                <FoodCourtCard
                  key={fc._id}
                  fc={fc}
                  onEdit={() =>
                    router.push(`/theaterOwner/EditFoodCourt/${fc._id}`)
                  }
                  onDelete={() => handleDeleteFoodCourt(fc._id)}
                  onEditItem={(fcId, item) =>
                    router.push(
                      `/theaterOwner/EditFoodItem?foodCourtId=${fcId}&itemName=${encodeURIComponent(
                        item.name.trim()
                      )}`
                    )
                  }
                  onDeleteItem={handleDeleteItem}
                />
              ))}
            </div>
          ) : (
            viewOption && (
              <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-20 w-20 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17v-2h6v2m-6 0h6M4 6h16M4 6a2 2 0 002-2h12a2 2 0 002 2M4 6l.928 13.01A2 2 0 006.926 21h10.148a2 2 0 001.998-1.99L20 6H4z"
                  />
                </svg>
                <p className="text-lg">
                  {selectedBlock
                    ? `No food courts found for block ${selectedBlock}.`
                    : "No food courts available."}
                </p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default Page;
