"use client";
import React, { useState } from "react";
import Movie from "./Movie";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Loading from "../Loading";
import { useClerk, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { ShowType } from "@/lib/types";
import CustomReview from "@/components/reviewComponents/CustomReview";
import ShowReview from "@/components/reviewComponents/ShowReview";

const ShowsSection = ({ shows }: { shows: ShowType[] }) => {
  const router = useRouter();
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();
  const [filters, setFilters] = useState({
    status: "",
    date: "",
    time: "",
    priceMin: "",
    priceMax: "",
    blockName: "",
    screen: "",
    language: "",
    genre: "",
  });

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

  if (!shows) return <Loading />;

  const filteredShows = shows.filter((show) => {
    const {
      status,
      date,
      time,
      priceMin,
      priceMax,
      blockName,
      screen,
      language,
      genre,
    } = filters;

    let keep = true;

    if (status && show.status !== status) keep = false;
    if (date && show.showDate !== date) keep = false;
    if (time && show.showTime !== time) keep = false;
    if (priceMin && show.showPrice < Number(priceMin)) keep = false;
    if (priceMax && show.showPrice > Number(priceMax)) keep = false;

    if (
      blockName &&
      !show.blockId?.name?.toLowerCase().includes(blockName.toLowerCase())
    )
      keep = false;
    if (screen && show.blockId?.screen !== screen) keep = false;

    if (language && show.movie?.original_language !== language) keep = false;

    if (
      genre &&
      !show.movie?.genres?.some(
        (g) => g.name.toLowerCase() === genre.toLowerCase()
      )
    )
      keep = false;

    return keep;
  });

  return (
    <div className="pb-20">
      <h2 className="text-xl font-semibold mb-6 text-white">🕒 Shows</h2>

      {/* Filters UI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="p-2 border rounded text-white bg-black"
        >
          <option value="">Status</option>
          <option value="scheduled" className="text-white">
            Scheduled
          </option>
          <option value="cancelled" className="text-white">
            Cancelled
          </option>
          <option value="completed" className="text-white">
            Completed
          </option>
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="p-2 border rounded w-full"
        />

        <input
          type="time"
          value={filters.time}
          onChange={(e) => setFilters({ ...filters, time: e.target.value })}
          className="p-2 border rounded w-full"
        />

        <input
          type="number"
          placeholder="Min Price"
          value={filters.priceMin}
          onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
          className="p-2 border rounded w-full"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.priceMax}
          onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
          className="p-2 border rounded w-full"
        />

        <input
          type="text"
          placeholder="Block Name"
          value={filters.blockName}
          onChange={(e) =>
            setFilters({ ...filters, blockName: e.target.value })
          }
          className="p-2 border rounded w-full"
        />

        <select
          value={filters.screen}
          onChange={(e) => setFilters({ ...filters, screen: e.target.value })}
          className="p-2 border rounded text-white bg-black w-full"
        >
          <option value="">Screen Type</option>
          <option value="Normal" className="text-white">
            Normal
          </option>
          <option value="3D" className="text-white">
            3D
          </option>
          <option value="IMAX" className="text-white">
            IMAX
          </option>
        </select>

        <input
          type="text"
          placeholder="Language"
          value={filters.language}
          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
          className="p-2 border rounded w-full"
        />

        <input
          type="text"
          placeholder="Genre"
          value={filters.genre}
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
          className="p-2 border rounded w-full"
        />

        <button
          onClick={() =>
            setFilters({
              status: "",
              date: "",
              time: "",
              priceMin: "",
              priceMax: "",
              blockName: "",
              screen: "",
              language: "",
              genre: "",
            })
          }
          className="p-2 border rounded bg-red-500 text-white hover:bg-red-600 col-span-2 md:col-span-1"
        >
          Reset
        </button>
      </div>

      {/* Filtered Show Cards */}
      {filteredShows.length === 0 ? (
        <p className="text-white">No shows available for selected filters.</p>
      ) : (
        <div className="space-y-6">
          {filteredShows.map((show) => (
            <div
              key={show._id}
              className="bg-gray-900 rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-4"
            >
              <div className="w-full md:w-1/3">
                <Movie movie={show.movie} />
              </div>

              <div className="flex-1 space-y-2 text-white md:border-r md:border-gray-700 md:pr-4">
                <h3 className="text-xl font-bold mb-2">{show.movie.title}</h3>
                <p>
                  📅 <strong>Date:</strong> {show.showDate}
                </p>
                <p>
                  ⏰ <strong>Time:</strong> {show.showTime}
                </p>
                <p>
                  ⏰ <strong>Status:</strong> {show.status}
                </p>
                <p>
                  🎟 <strong>Price:</strong> ₹{show.showPrice}
                </p>
                <p>
                  🧱 <strong>Block:</strong> {show.blockId?.name || "N/A"}
                </p>
                <p>
                  🎥 <strong>Screen:</strong> {show.blockId?.screen || "N/A"}
                </p>
                <div className="pt-4">
                  <div className="pt-4">
                    {show.status === "scheduled" && (
                      <Button
                        onClick={() => handleBooking(show._id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        🎫 Book Now
                      </Button>
                    )}
                    {show.status === "cancelled" && (
                      <p className="text-red-400 italic">
                        ❌ This show has been cancelled. It will be rescheduled
                        soon.
                      </p>
                    )}
                    {show.status === "completed" && (
                      <p className="text-gray-400 italic">
                        ✅ This show has already been completed.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Reviews */}
              <div className="mt-8">
                {/* Add review form */}
                <CustomReview type="show" id={show._id} />

                {/* Show reviews */}
                <h3 className="text-xl font-semibold mt-8 mb-4 text-white">
                  📝 Customer Reviews
                </h3>
                <ShowReview reviews={show.showReview} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowsSection;
