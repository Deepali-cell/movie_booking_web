"use client";
import React, { useEffect } from "react";
import ShowCard from "@/components/ownerComponents/cardComponents/ShowCard";
import { useStateContext } from "@/context/StateContextProvider";
import { ShowType } from "@/lib/types";

const Page = () => {
  const { theaterList, blocks, fetchBlocks, selectedTheaterId } =
    useStateContext();

  // ✅ This runs once on page load
  useEffect(() => {
    const runCleanup = async () => {
      try {
        const res = await fetch("/api/cleanupShows");
        const data = await res.json();
        console.log("Cleanup result:", data.message);
      } catch (err) {
        console.error("Error running cleanup:", err);
      }
    };

    runCleanup();
  }, []);

  const handleRefresh = () => {
    if (selectedTheaterId) {
      fetchBlocks(selectedTheaterId);
    } else {
      console.warn("No theater selected yet.");
    }
  };

  return (
    <div className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🎬 View Shows by Theater</h1>

      {/* 🎭 Theater Selector */}
      <div className="mb-6 space-x-4">
        {theaterList.map((theater) => (
          <button
            key={theater._id}
            onClick={() => fetchBlocks(theater._id)}
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

      {/* 🧱 Blocks & Shows */}
      {blocks.length > 0 ? (
        blocks.map((block) => (
          <div
            key={block._id}
            className="mb-10 p-4 border border-white rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-4">
              🎯 Block: {block.name} ({block.screen})
            </h2>

            {block.movies?.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {block.movies.map((show: ShowType) => (
                  <ShowCard
                    key={show._id}
                    show={show}
                    onUpdate={handleRefresh}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">
                No shows available in this block.
              </p>
            )}
          </div>
        ))
      ) : selectedTheaterId ? (
        <p className="text-gray-500 italic">
          No blocks found for this theater.
        </p>
      ) : null}
    </div>
  );
};

export default Page;
