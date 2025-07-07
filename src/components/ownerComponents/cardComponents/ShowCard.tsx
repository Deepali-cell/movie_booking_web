"use client";
import React from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ShowType } from "@/lib/types";
import { useDeleteShowMutation, useUpdateShowStatusMutation } from "@/app/serveces/app";


interface Props {
  show: ShowType;
  onUpdate?: () => void;
}

const ShowCard: React.FC<Props> = ({ show, onUpdate }) => {
  const router = useRouter();
  const [deleteShow] = useDeleteShowMutation();
  const [updateShowStatus] = useUpdateShowStatusMutation();

  const handleDelete = async () => {
    try {
      await deleteShow(show._id).unwrap();
      toast.success("✅ Show deleted successfully");
      onUpdate?.();
    } catch (err) {
      toast.error("Failed to delete show");
    }
  };

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value as ShowType["status"];
    try {
      await updateShowStatus({ showId: show._id, newStatus }).unwrap();
      toast.success("✅ Show status updated");
      onUpdate?.();
    } catch (err) {
      toast.error("Failed to update show status");
    }
  };

  return (
    <div className="bg-black border border-white text-white rounded-xl p-4 shadow-lg">
      <div className="flex gap-4">
        <div className="relative w-28 h-40 border border-gray-800 rounded overflow-hidden">
          <Image
            src={show.movie?.poster_path || "/placeholder.jpg"}
            alt={show.movie?.title || "Movie"}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>

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
            <strong>⏱️ Runtime:</strong> {show.movie?.runtime} min
          </p>

          <div className="mt-2">
            <label className="block text-sm mb-1">Show Status:</label>
            <select
              className="bg-gray-800 text-white p-2 rounded"
              value={
                show.status === "scheduled" || show.status === "cancelled"
                  ? show.status
                  : "completed"
              }
              onChange={handleStatusChange}
              disabled={show.status === "completed"}
            >
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {show.status === "completed" && (
              <p className="text-xs text-green-400 mt-1">
                ✅ This show is completed
              </p>
            )}
          </div>
        </div>
      </div>

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
        {(show.status === "scheduled" || show.status === "cancelled") && (
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
