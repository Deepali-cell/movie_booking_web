"use client";
import React from "react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ShowType } from "@/lib/types";

interface Props {
  show: ShowType;
  onUpdate?: () => void;
}

const ShowCard: React.FC<Props> = ({ show, onUpdate }) => {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this show?"
    );
    if (!confirmed) return;

    try {
      const { data } = await axios.delete(
        `/api/owner/deleteShow?showId=${show._id}`
      );

      if (data.success) {
        toast.success("✅ Show deleted successfully");
        onUpdate?.();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Error deleting show:", error);
      toast.error("Failed to delete show");
    }
  };

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value as ShowType["status"];
    try {
      const { data } = await axios.patch("/api/owner/updateShowStatus", {
        showId: show._id,
        newStatus,
      });

      if (data.success) {
        toast.success(data.message);
        onUpdate?.();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update show status");
    }
  };

  return (
    <div className="bg-black border border-white text-white rounded-xl p-4 shadow-lg">
      <div className="flex gap-4">
        {/* 🎬 Movie Poster */}
        <div className="relative w-28 h-40 border border-gray-800 rounded overflow-hidden">
          <Image
            src={show.movie?.poster_path || "/placeholder.jpg"}
            alt={show.movie?.title || "Movie"}
            fill
            className="object-cover"
            sizes="112px" // w-28 = 112px
          />
        </div>

        {/* 📝 Show + Movie Info */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-1">{show.movie?.title}</h2>
          <p className="text-sm italic text-gray-300 mb-2">
            {show.movie?.tagline}
          </p>

          <p className="text-sm text-gray-400 mb-1">
            <strong>📅 Show Date:</strong> {show.showDate} |{" "}
            <strong>🕒 Time:</strong> {show.showTime}
          </p>
          <p className="text-sm text-gray-400 mb-1">
            <strong>🎟️ Price:</strong> ₹{show.showPrice}
          </p>
          <p className="text-sm text-gray-400 mb-1">
            <strong>🎬 Movie Release:</strong> {show.movie?.release_date}
          </p>
          <p className="text-sm text-gray-400 mb-1">
            <strong>⏱️ Runtime:</strong> {show.movie?.runtime} minutes
          </p>

          <div className="mt-2">
            <label className="block text-sm mb-1">Show Status:</label>
            <select
              className="bg-gray-800 text-white p-2 rounded"
              value={show.status}
              onChange={handleStatusChange}
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* 💬 Reviews */}
      {show.showReview?.length > 0 && (
        <div className="mt-3 text-sm">
          <p className="font-semibold mb-1">💬 Reviews:</p>
          <ul className="ml-4 list-disc text-gray-300">
            {show.showReview.map((rev, i) => (
              <li key={i}>
                {rev.comment} - {rev.userName} ⭐ {rev.rating}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex justify-end space-x-2">
        {show.status !== "completed" && (
          <button
            onClick={() => router.push(`/theaterOwner/editShow/${show._id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            ✏️ Edit Show
          </button>
        )}

        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
        >
          🗑️ Delete Show
        </button>
      </div>
    </div>
  );
};

export default ShowCard;
