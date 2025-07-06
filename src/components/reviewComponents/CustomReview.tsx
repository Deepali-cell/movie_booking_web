"use client";
import React, { useState, FormEvent } from "react";
import axios from "axios";
import { FaStar, FaCommentDots } from "react-icons/fa";
import toast from "react-hot-toast";

interface CustomReviewProps {
  type: string;
  id: string;
  refreshReviews?: () => void;
}

const CustomReview: React.FC<CustomReviewProps> = ({
  type,
  id,
  refreshReviews,
}) => {
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `/api/review/commonReview?type=${type}&id=${id}`,
        {
          comment,
          rating,
        }
      );
      if (data.success) {
        toast.success("✅ Review added successfully!");
        refreshReviews?.();
        setComment("");
        setRating(5);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      if (error.response && error.response.status === 401) {
        toast.error("🚫 You must login before posting a comment.");
      } else {
        toast.error("❌ Failed to add review.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 ">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Share Your Experience ✍️
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-black flex flex-wrap items-center gap-4 p-4 rounded-xl shadow-lg border hover:shadow-xl transition"
      >
        {/* Comment */}
        <div className="flex items-center gap-2 flex-[2] min-w-[200px] flex-grow">
          <FaCommentDots className="text-green-600 text-xl" />
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 min-w-[150px] flex-grow">
          <FaStar className="text-yellow-500 text-xl" />
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="p-3 border rounded-md focus:outline-none bg-black focus:ring-2 focus:ring-blue-400 w-full"
          >
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>
                {num} ⭐
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 w-full sm:w-auto"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CustomReview;
