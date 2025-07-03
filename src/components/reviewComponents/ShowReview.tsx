"use client";

import React from "react";
import { FaUser, FaStar, FaCalendarAlt } from "react-icons/fa";

interface Review {
  userName: string;
  comment: string;
  rating: number;
  createdAt: string;
}

const ShowReview = ({ reviews }: { reviews: Review[] }) => {
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
          className="flex items-start gap-4 p-4 bg-gray-800 rounded-xl shadow hover:shadow-lg transition"
        >
          <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white text-xl">
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
        </div>
      ))}
    </div>
  );
};

export default ShowReview;
