"use client";
import React, { useEffect } from "react";
import ShowCard from "@/components/ownerComponents/cardComponents/ShowCard";
import { useStateContext } from "@/context/StateContextProvider";
import { useGetShowsQuery } from "@/app/serveces/app";
import { ShowType } from "@/lib/types";
import axios from "axios";

const Page = () => {
  const { theaterList, blocks, fetchBlocks, selectedTheaterId } =
    useStateContext();

  // ✅ on page load: cleanup API call
  useEffect(() => {
    const runCleanup = async () => {
      try {
        await axios.get("/api/cleanupShows");
        console.log("✅ Cleanup done on shows page");
      } catch (err) {
        console.error("Cleanup error:", err);
      }
    };

    runCleanup();
  }, []);
  const { data, isLoading, refetch } = useGetShowsQuery(selectedTheaterId!, {
    skip: !selectedTheaterId,
  });

  return (
    <div className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🎬 View Shows by Theater</h1>

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

      {isLoading && (
        <div className="text-center text-gray-300 py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          Loading data...
        </div>
      )}

      {!isLoading && (
        <>
          {blocks.length > 0 ? (
            blocks.map((block) => {
              const blockShows = (data?.shows || []).filter(
                (show: ShowType) => show.blockId?._id === block._id
              );
              return (
                <div
                  key={block._id}
                  className="mb-10 p-4 border border-white rounded-lg shadow-md"
                >
                  <h2 className="text-2xl font-semibold mb-4">
                    🎯 Block: {block.name} ({block.screen})
                  </h2>

                  {blockShows.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {blockShows.map((show: ShowType) => (
                        <ShowCard
                          key={show._id}
                          show={show}
                          onUpdate={refetch}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">
                      No shows available in this block.
                    </p>
                  )}
                </div>
              );
            })
          ) : selectedTheaterId ? (
            <p className="text-gray-500 italic">
              No blocks found for this theater.
            </p>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Page;
