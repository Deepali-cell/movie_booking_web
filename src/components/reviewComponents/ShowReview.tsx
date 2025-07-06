"use client";

import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { FaUser, FaStar, FaCalendarAlt, FaTrash } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";

interface Review {
  userId: string;
  userName: string;
  comment: string;
  rating: number;
  createdAt: string;
}

const ShowReview = ({
  reviews,
  type,
  id,
  refreshReviews,
}: {
  reviews: Review[];
  type: string;
  id: string;
  refreshReviews?: () => void;
}) => {
  const { user } = useUser();
  const loggedInUserId = user?.id;

  const handleDelete = async (review: Review) => {
    try {
      const { data } = await axios.delete(
        `/api/review/deleteReview?type=${type}&id=${id}`,
        { data: { createdAt: review.createdAt } }
      );

      if (data.success) {
        toast.success("Review deleted successfully");
        if (refreshReviews) {
          refreshReviews();
        }
      } else {
        toast.error(data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting review");
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-4 p-4 text-center italic text-gray-400">
        No reviews yet. Be the first to share your experience!
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {reviews.map((review, i) => (
        <div
          key={i}
          className="flex items-start gap-4 p-4  rounded-xl shadow hover:shadow-lg transition"
        >
          <div className=" rounded-full w-12 h-12 flex items-center justify-center text-white text-xl">
            <FaUser />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg text-white">{review.userName}</p>
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(review.rating)].map((_, idx) => (
                  <FaStar key={idx} />
                ))}
              </div>
            </div>
            <p className="text-gray-300 mt-1 italic">"{review.comment}"</p>
            <div className="flex items-center text-sm text-gray-400 mt-2">
              <FaCalendarAlt className="mr-1" />
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Only show if current logged user is review owner */}
          {loggedInUserId === review.userId && (
            <button
              onClick={() => handleDelete(review)}
              className="text-red-500 hover:text-red-700 transition ml-2"
              title="Delete Review"
            >
              <FaTrash />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ShowReview;
