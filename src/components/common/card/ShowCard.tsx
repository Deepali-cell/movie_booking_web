"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useClerk, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import CustomReview from "@/components/reviewComponents/CustomReview";
import ShowReview from "@/components/reviewComponents/ShowReview";

const ShowCard = ({
  show,
  fetchTheaterDetails,
  isSelected,
  onSelect,
}: {
  show: any;
  fetchTheaterDetails: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
}) => {
  const router = useRouter();
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();
  const [activeReviews, setActiveReviews] = useState<string | null>(null);

  const handleBooking = (showId: string) => {
    if (!isSignedIn) {
      toast.error("Please log in to book a seat");
      openSignIn({
        afterSignInUrl: `/seatLayout/${showId}`,
      });
      return;
    }
    router.push(`/seatLayout/${showId}`);
  };

  const goToMovieDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/movieDetail/${show.movie?._id}`);
  };

  return (
    <div
      className={`bg-[#1c1c1c] border rounded-2xl overflow-hidden shadow-lg hover:scale-[1.01] transition-transform duration-300 
        ${isSelected ? "bg-green-700 border-green-400" : "border-gray-700"}`}
    >
      <div className="flex flex-col md:flex-row p-6 gap-6">
        {/* LEFT POSTER */}
        <img
          src={show.movie?.poster_path || "/placeholder.png"}
          alt={show.movie?.title}
          className="w-32 h-48 object-cover rounded-xl shadow cursor-pointer"
          onClick={goToMovieDetail}
        />

        {/* DETAILS */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h3
                className="text-xl font-bold text-white mb-2 cursor-pointer"
                onClick={goToMovieDetail}
              >
                {show.movie?.title}
              </h3>
            </div>

            <p className="text-gray-300 mb-1">
              📅 {show.showDate} ⏰ {show.showTime}
            </p>
            <p className="text-gray-400 text-sm mb-2">
              🎥 {show.blockId?.screen} | Block: {show.blockId?.name}
            </p>
            <p className="text-green-400 font-bold mb-1">₹{show.showPrice}</p>
            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold 
                ${show.status === "scheduled" ? "bg-blue-600" : ""}
                ${show.status === "completed" ? "bg-green-600" : ""}
                ${show.status === "cancelled" ? "bg-red-600" : ""}`}
            >
              {show.status}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 items-center">
            {show.status === "scheduled" && !onSelect && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBooking(show._id);
                }}
                className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-full"
              >
                🎫 Book Now
              </Button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveReviews(activeReviews === show._id ? null : show._id);
              }}
              className="text-blue-400 hover:underline text-xs"
            >
              {activeReviews === show._id ? "Hide Reviews" : "View Reviews"}
            </button>
          </div>
        </div>
        {/* REAL CHECKBOX */}
        {onSelect && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="w-5 h-5 accent-green-500 cursor-pointer"
          />
        )}
      </div>

      {/* REVIEWS SECTION */}
      {activeReviews === show._id && (
        <div className="bg-[#262626] border-t border-gray-700 p-6 grid gap-6 md:grid-cols-2">
          <div className="bg-[#2e2e2e] p-4 rounded-xl">
            <h4 className="text-gray-200 text-sm font-semibold mb-3">
              ➕ Add Review
            </h4>
            <CustomReview
              type="show"
              id={show._id}
              refreshReviews={fetchTheaterDetails}
            />
          </div>
          <div className="bg-[#2e2e2e] p-4 rounded-xl overflow-y-auto max-h-[300px]">
            <h4 className="text-gray-200 text-sm font-semibold mb-3">
              📝 Reviews
            </h4>
            <ShowReview
              reviews={show.showReview}
              type="show"
              id={show._id}
              refreshReviews={fetchTheaterDetails}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowCard;
