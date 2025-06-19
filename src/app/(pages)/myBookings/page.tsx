"use client";
import React from "react";
import dayjs from "dayjs";
import { dummyBookingData } from "@/assets/assets";
import FeaturedSection from "@/components/FeaturedSection";
import Image from "next/image";

const MyBookingsPage = () => {
  return (
    <div className="py-20 min-h-screen  text-white px-4">
      <FeaturedSection headerTitle="My Bookings" />

      <div className="grid gap-6 max-w-5xl mx-auto">
        {dummyBookingData.map((booking, index) => {
          const movie = booking.show.movie;
          const showTime = dayjs(booking.show.showDateTime).format(
            "DD MMM YYYY, h:mm A"
          );

          return (
            <div
              key={index}
              className="flex flex-col md:flex-row bg-[#1e293b] rounded-lg shadow-lg overflow-hidden border border-white/10"
            >
              {/* Movie Poster */}
              <Image
                src={movie.poster_path}
                alt={movie.title}
                width={160} // Equivalent to md:w-40 (40 * 4 = 160px)
                height={240} // Equivalent to h-60 (60 * 4 = 240px)
                className="w-full md:w-40 h-60 object-cover"
              />

              {/* Booking Info */}
              <div className="flex flex-col justify-between p-4 flex-grow">
                <div>
                  <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
                  <p className="text-sm text-gray-300 mb-1">
                    🗓️ <span className="text-white">{showTime}</span>
                  </p>
                  <p className="text-sm text-gray-300 mb-1">
                    💺 Seats:{" "}
                    <span className="text-white font-medium">
                      {booking.bookedSeats.join(", ")}
                    </span>
                  </p>
                  <p className="text-sm text-gray-300 mb-1">
                    💰 Amount:{" "}
                    <span className="text-green-400 font-medium">
                      ₹{booking.amount}
                    </span>
                  </p>
                  <p className="text-sm text-gray-300 mb-2">
                    🎭 Genre:{" "}
                    {movie.genres.map((g) => (
                      <span key={g.id} className="mr-1">
                        {g.name}
                      </span>
                    ))}
                  </p>
                </div>

                <div className="mt-2">
                  {booking.isPaid ? (
                    <span className="text-green-500 font-semibold">
                      ✅ Payment Complete
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      ❌ Payment Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookingsPage;
