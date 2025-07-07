"use client";
import React, { useEffect, useState } from "react";
import { useStateContext } from "@/context/StateContextProvider";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const BlockList = () => {
  const {
    selectedTheaterId,
    setSelectedTheaterId,
    theaterList,
    blocks,
    fetchBlocks,
  } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const loadBlocks = async () => {
      if (selectedTheaterId) {
        setIsLoading(true);
        await fetchBlocks(selectedTheaterId);
        setIsLoading(false);
      }
    };
    loadBlocks();
  }, [selectedTheaterId, fetchBlocks]);

  const handleDelete = async (blockId: string) => {
    try {
      const { data } = await axios.delete(
        `/api/owner/deleteBlock?blockId=${blockId}`
      );
      if (data.success) {
        toast.success("Block deleted successfully!");
        setIsLoading(true);
        await fetchBlocks(selectedTheaterId!);
        setIsLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting block");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Blocks by Theater</h2>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium ">
          Select Theater First To show the all the blocks of that theater.
        </label>
        <select
          value={selectedTheaterId ?? ""}
          onChange={(e) => setSelectedTheaterId(e.target.value)}
          className="p-2 border rounded w-full max-w-md"
        >
          <option value="" disabled>
            Select a theater
          </option>
          {theaterList.map((theater) => (
            <option key={theater._id} value={theater._id}>
              {theater.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTheaterId && (
        <>
          <h3 className="text-xl font-semibold mb-3">
            Blocks in this Theater:
          </h3>

          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading blocks...</p>
            </div>
          ) : (
            <>
              {blocks.length === 0 && <p>No blocks found.</p>}
              <div className="grid gap-4">
                {blocks.map((block) => (
                  <div key={block._id} className="p-4 border rounded-xl shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-semibold">{block.name}</h4>
                        <p className="text-sm text-gray-600">
                          Screen: {block.screen}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            router.push(`/theaterOwner/EditBlock/${block._id}`)
                          }
                          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(block._id)}
                          className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BlockList;
