"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const rowSeatCounts = [4, 6, 8, 10, 10, 8, 6, 4]; // Triangle style

const SeatLayout = () => {
  const { id, date, time } = useParams();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleSelectSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat.");
      return;
    }
    toast.success("Booking confirmed!");
  };

  const rawTime = time ? decodeURIComponent(time as string) : "";
  const formattedTime = rawTime ? dayjs(rawTime).format("h:mm A") : "";

  return (
    <div className="pt-20 min-h-screen text-white px-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-2">Select Your Seats</h1>
      <p className="mb-6 text-sm text-gray-300 text-center">
        Movie ID: <strong>{id}</strong> | Date: <strong>{date}</strong> | Time:{" "}
        <strong>{formattedTime}</strong>
      </p>

      {/* Screen */}
      <div className="w-full max-w-2xl bg-white/10 text-white text-sm py-1 px-4 text-center rounded mb-10">
        🎬 SCREEN
      </div>

      {/* Triangle-style layout */}
      <div className="bg-[#1e1e2f] p-6 rounded-lg shadow-2xl w-full max-w-3xl flex flex-col gap-3 items-center">
        {rowSeatCounts.map((seatCount, rowIdx) => {
          const rowLabel = String.fromCharCode(65 + rowIdx);
          const startSpaces = Math.floor(
            (rowSeatCounts[rowSeatCounts.length - 1] - seatCount) / 2
          );

          return (
            <div
              key={rowIdx}
              className="flex items-center justify-center gap-2"
            >
              {/* Leading empty space for triangle effect */}
              {Array.from({ length: startSpaces }).map((_, i) => (
                <div key={`space-${i}`} className="w-10" />
              ))}

              {/* Seats */}
              {Array.from({ length: seatCount }, (_, seatIdx) => {
                const seatId = `${rowLabel}${seatIdx + 1}`;
                const isSelected = selectedSeats.includes(seatId);

                return (
                  <button
                    key={seatId}
                    onClick={() => handleSelectSeat(seatId)}
                    className={`w-10 h-10 rounded-full text-sm font-semibold border transition
                      ${
                        isSelected
                          ? "bg-yellow-400 border-yellow-500 text-black"
                          : "bg-gray-600 border-gray-400 hover:bg-yellow-300 hover:text-black"
                      }`}
                  >
                    {seatId}
                  </button>
                );
              })}
            </div>
          );
        })}

        {/* Selection Info */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
          <p className="text-sm text-gray-300">
            Selected:{" "}
            <span className="font-semibold text-white">
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </span>
          </p>
          <button
            onClick={handleConfirmBooking}
            className="bg-green-500 hover:bg-green-600 text-black font-bold px-6 py-2 rounded-lg transition"
          >
            Confirm Booking
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-sm mt-8 text-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-600 border border-gray-400" />
          Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-500" />
          Selected
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
