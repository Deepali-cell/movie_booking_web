"use client";

import dayjs from "dayjs";
import { Locate } from "lucide-react";
import Image from "next/image";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BookingType, GroupPlanType, ShowType, TheaterType } from "@/lib/types";

interface BookingCardProps {
  b: BookingType;
  setShowFoodOptionModal: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTicket: React.Dispatch<React.SetStateAction<BookingType | null>>;
  setfoodCourtGetDetail: React.Dispatch<React.SetStateAction<any>>;
  fetchBookingList: () => void;
}

const BookingCard = ({
  b,
  setShowFoodOptionModal,
  setActiveTicket,
  setfoodCourtGetDetail,
  fetchBookingList,
}: BookingCardProps) => {
  const theater =
    typeof b.theater === "string" ? null : (b.theater as TheaterType);
  const showDetails =
    typeof b.movie === "string" ? null : (b.movie as ShowType);
  const groupPlan =
    typeof b.groupPlan === "string" ? null : (b.groupPlan as GroupPlanType);

  const movie = showDetails?.movie;
  const title = movie?.title ?? "Unknown Movie";

  const foodOrdered = !!b.foodOrder;

  const blockName = showDetails?.blockId?.name || "N/A";
  const theaterName = theater?.name || "Unknown Theater";
  const theaterId = theater?._id;

  const theaterAddressText = `${theater?.location?.addressLine || ""}, ${
    theater?.location?.city || ""
  }`;
  const theaterMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    theaterAddressText
  )}`;

  const showStatus = showDetails?.status || "scheduled";

  const getPaymentBadgeColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-600";
      case "pending":
        return "bg-yellow-500 text-black";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  const getShowBadgeColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500";
      case "completed":
        return "bg-green-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  const handleCancelBooking = async () => {
    try {
      const { data } = await axios.patch("/api/cancelBooking", {
        bookingId: b._id,
      });
      if (data.success) {
        toast.success(data.message);
        fetchBookingList();
      } else {
        toast.error(data.message || "Failed to cancel booking.");
      }
    } catch (err) {
      console.error("Cancel booking error:", err);
      toast.error("Failed to cancel booking. Try again.");
    }
  };

  const handleDeleteBooking = async () => {
    try {
      const bookingId = b._id;
      const { data } = await axios.delete("/api/deleteBooking", {
        data: { bookingId },
      });

      if (data.success) {
        toast.success(data.message);
        fetchBookingList();
      } else {
        toast.error(data.message || "Failed to delete booking.");
      }
    } catch (err) {
      console.error("Delete booking error:", err);
      toast.error("Failed to delete booking. Try again.");
    }
  };

  return (
    <div className="p-5 text-white border-b border-gray-700">
      <div className="flex gap-6 flex-wrap">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold truncate">🎬 {title}</h3>
          <Image
            src={movie?.poster_path ?? "/poster-placeholder.jpg"}
            alt={title}
            width={200}
            height={120}
            className="rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-2 min-w-[240px]">
          <p>🏛️ Theater: {theaterName}</p>
          <p>
            📍 Location:{" "}
            <a
              href={theaterMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-blue-400 inline-flex items-center gap-1"
            >
              <Locate className="w-4 h-4" />
              {theaterAddressText}
            </a>
          </p>
          <p>🧱 Block: {blockName}</p>
          <p>🎫 Booking ID: {b._id.slice(-6)}</p>
        </div>

        <div className="flex flex-col gap-2 min-w-[240px]">
          <p>🪑 Seats: {b.seats.join(", ")}</p>
          <p>💵 Total: ₹{b.totalPrice}</p>
          <p>📅 Booked On: {dayjs(b.createdAt).format("MMM D, YYYY h:mm A")}</p>
          <p>
            🕒 Show Time: {showDetails?.showDate} at {showDetails?.showTime}
          </p>
        </div>

        <div className="flex flex-col gap-2 min-w-[240px]">
          <p>
            🎬 Show Status:{" "}
            <span
              className={`px-2 py-1 rounded text-sm font-semibold ${getShowBadgeColor(
                showStatus
              )}`}
            >
              {showStatus.toUpperCase()}
            </span>
          </p>

          <p>
            🍔 Food Order:{" "}
            <span className={foodOrdered ? "text-green-400" : "text-red-400"}>
              {foodOrdered ? "Yes" : "No"}
            </span>
          </p>

          {groupPlan && (
            <div className="bg-purple-800 p-2 rounded mt-1">
              <p>
                👥 <strong>Group Booking</strong>
              </p>
              <p>
                💳 Payment:{" "}
                <span className="font-semibold">{groupPlan.paymentStatus}</span>
              </p>

              {groupPlan.paymentStatus === "split" &&
                (() => {
                  const currentUserId =
                    typeof b.user === "string" ? b.user : b.user._id;
                  const userSplit = groupPlan.splitDetails?.find((s) =>
                    typeof s.user === "string"
                      ? s.user === currentUserId
                      : s.user._id === currentUserId
                  );

                  return (
                    <p className="text-sm">
                      {userSplit?.paid
                        ? "✅ You have paid your split."
                        : "⚠️ You still need to pay your split."}
                    </p>
                  );
                })()}

              {groupPlan.paymentStatus === "singlePaid" && (
                <p className="text-sm">Paid by group creator.</p>
              )}
            </div>
          )}

          {showStatus !== "cancelled" ? (
            <p>
              💳 Payment:{" "}
              <span
                className={`px-2 py-1 rounded text-sm font-semibold ${getPaymentBadgeColor(
                  b.paymentStatus
                )}`}
              >
                {b.paymentStatus.toUpperCase()}
              </span>
            </p>
          ) : (
            <p className="text-yellow-400 font-semibold">
              {b.paymentStatus === "paid"
                ? "💰 Refund within 1 hour"
                : "⚠️ No payment taken, so no refund"}
            </p>
          )}

          {showStatus === "completed" && b.paymentStatus !== "cancelled" && (
            <button
              onClick={() => setActiveTicket(b)}
              className="bg-yellow-400 text-black font-semibold py-1 px-3 rounded hover:bg-yellow-500 transition"
            >
              🎟️ Show Ticket
            </button>
          )}

          {showStatus === "scheduled" && b.paymentStatus !== "cancelled" && (
            <>
              <button
                onClick={() => {
                  setfoodCourtGetDetail({
                    bookingId: b._id,
                    blockName,
                    theaterId,
                    paymentStatus: b.paymentStatus,
                    showStatus,
                  });
                  setShowFoodOptionModal(true);
                }}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mt-1"
              >
                🍔 Order Food
              </button>

              <button
                onClick={handleCancelBooking}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 mt-1"
              >
                ❌ Cancel Booking
              </button>

              <button
                onClick={() => setActiveTicket(b)}
                className="bg-yellow-400 text-black font-semibold py-1 px-3 rounded hover:bg-yellow-500 transition mt-1"
              >
                🎟️ Show Ticket
              </button>
            </>
          )}

          {(showStatus === "completed" || b.paymentStatus === "cancelled") && (
            <button
              onClick={handleDeleteBooking}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 mt-1"
            >
              🗑️ Delete Booking
            </button>
          )}

          {showStatus === "cancelled" && (
            <div className="bg-red-500 bg-opacity-30 border border-red-400 text-white p-3 rounded mt-2">
              Sorry, your show was cancelled.
              <br />
              Please contact support if needed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
