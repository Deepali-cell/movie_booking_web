"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useStateContext } from "@/context/StateContextProvider";

const EditBlockPage = () => {
  const { blockId } = useParams() as { blockId: string };
  const router = useRouter();
  const { selectedTheaterId, fetchBlocks } = useStateContext();

  const [name, setName] = useState("");
  const [screen, setScreen] = useState("Normal");
  const [loading, setLoading] = useState(true);

  // fetch block details
  useEffect(() => {
    const fetchBlock = async () => {
      try {
        const { data } = await axios.get(
          `/api/getBlockById?blockId=${blockId}`
        );
        if (data.success) {
          setName(data.block.name);
          setScreen(data.block.screen);
          console.log(data);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load block details");
      } finally {
        setLoading(false);
      }
    };

    fetchBlock();
  }, [blockId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        `/api/owner/editBlock?blockId=${blockId}`,
        {
          name,
          screen,
        }
      );

      if (data.success) {
        toast.success("Block updated successfully!");
        if (selectedTheaterId) {
          await fetchBlocks(selectedTheaterId); // refresh block list
        }
        router.push("/theaterOwner/blockList");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update block");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Block</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Screen Type
          </label>
          <select
            value={screen}
            onChange={(e) => setScreen(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Normal " className="text-black">
              Normal
            </option>
            <option value="3D " className="text-black">
              3D
            </option>
            <option value="IMAX " className="text-black">
              IMAX
            </option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditBlockPage;
