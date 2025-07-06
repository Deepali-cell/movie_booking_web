"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import axios from "axios";
import { ShowType } from "@/lib/types";

const rowSeatCounts = [4, 6, 8, 10, 10, 8, 6, 4];

const SeatLayout: React.FC = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  const searchParams = useSearchParams();
  const inviteLink = searchParams.get("inviteLink");

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [show, setShow] = useState<ShowType | null>(null);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const handleSelectSeat = (seatId: string) => {
    if (show?.occupiedSeats?.[seatId]) {
      toast.error(`Seat ${seatId} is already occupied.`);
      return;
    }
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBooking = async (paymentMethod: "cash" | "online") => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat.");
      return;
    }

    try {
      const { data } = await axios.post<{
        success: boolean;
        message: string;
        isGroupBooking?: boolean;
        paymentMode?: string;
      }>(`/api/bookingMovie?showId=${id}`, {
        selectedSeats,
        paymentMethod,
        inviteLink,
      });

      if (data.success) {
        toast.success(data.message);

        if (data.isGroupBooking && data.paymentMode === "split") {
          router.push(`/splitStatus/${inviteLink}`);
        } else {
          router.push("/myBookings");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Booking error:", error);
      toast.error("Booking failed. Please try again.");
    }
  };

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const { data } = await axios.get<{
          success: boolean;
          show?: ShowType;
          message?: string;
        }>(`/api/getShowById?showId=${id}`);

        if (data.success && data.show) {
          setShow(data.show);
        } else {
          toast.error(data.message ?? "Show not found");
        }
      } catch (error) {
        console.error("❌ Error fetching show by ID:", error);
        toast.error("Failed to fetch show");
      }
    };

    if (id) fetchShowDetails();
  }, [id]);

  const seatPrice = show?.showPrice || 0;
  const totalPrice = selectedSeats.length * seatPrice;

  return (
    <div className="pt-20 min-h-screen px-4 flex flex-col items-center text-white">
      <h1 className="text-2xl font-bold mb-2">Select Your Seats</h1>

      {show && (
        <div className="text-sm text-gray-300 mb-6 text-center">
          <p>
            🎬 <strong>{show.movie?.title}</strong>
          </p>
          <p>
            📅 {dayjs(show.showDate).format("MMM DD, YYYY")} at {show.showTime}
          </p>
          <p>💵 Price per seat: ₹{seatPrice}</p>
        </div>
      )}

      <div className="w-full max-w-2xl bg-white/10 py-1 px-4 text-center rounded mb-10 text-sm text-white">
        🎥 SCREEN
      </div>

      <div className="bg-[#1e1e2f] p-6 rounded-lg shadow-2xl w-full max-w-3xl flex flex-col gap-3 items-center">
        {rowSeatCounts.map((count, i) => {
          const row = String.fromCharCode(65 + i);
          const padding = Math.floor(
            (rowSeatCounts[rowSeatCounts.length - 1] - count) / 2
          );

          return (
            <div key={i} className="flex items-center justify-center gap-2">
              {Array.from({ length: padding }).map((_, j) => (
                <div key={`space-${j}`} className="w-10" />
              ))}
              {Array.from({ length: count }, (_, j) => {
                const seatId = `${row}${j + 1}`;
                const isSelected = selectedSeats.includes(seatId);
                const isOccupied = show?.occupiedSeats?.[seatId];

                return (
                  <button
                    key={seatId}
                    onClick={() => handleSelectSeat(seatId)}
                    disabled={isOccupied}
                    className={`w-10 h-10 rounded-full text-sm font-semibold border transition
                    ${
                      isOccupied
                        ? "bg-red-500 border-red-600 cursor-not-allowed"
                        : isSelected
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

        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
          <p className="text-sm text-gray-300">
            Selected:{" "}
            <span className="text-white font-semibold">
              {selectedSeats.join(", ") || "None"}
            </span>{" "}
            | 💵 Total: ₹{totalPrice}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => handleBooking("cash")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Pay with Cash
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              Pay Online
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Online Payment (Mock)</h2>
            <p>Total Amount: ₹{totalPrice}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBooking("online")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatLayout;
