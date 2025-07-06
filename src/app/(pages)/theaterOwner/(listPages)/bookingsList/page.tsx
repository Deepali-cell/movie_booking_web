"use client";
import Loading from "@/components/common/Loading";
import { useStateContext } from "@/context/StateContextProvider";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

// ✅ type guards
function isPopulatedUser(user: any): user is { name: string; email: string } {
  return user && typeof user === "object" && "name" in user && "email" in user;
}

function isPopulatedTheater(
  theater: any
): theater is { name: string; location?: any } {
  return theater && typeof theater === "object" && "name" in theater;
}

const Page = () => {
  const { theaterList, fetchBookingsList, bookings, selectedTheaterId } =
    useStateContext();
  const [loading, setLoading] = useState(false);

  const formatLocation = (location: any) => {
    if (!location) return "N/A";
    const { addressLine, city, state, country, pincode, landmarks } = location;
    return `${addressLine ?? ""}, ${city ?? ""}, ${state ?? ""}, ${
      country ?? ""
    } - ${pincode ?? ""}${
      landmarks?.length ? " (Landmarks: " + landmarks.join(", ") + ")" : ""
    }`;
  };

  const handleFetchBookings = async (theaterId: string) => {
    try {
      setLoading(true);
      await fetchBookingsList(theaterId);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      toast.error("Error loading bookings");
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { data } = await axios.put("/api/owner/updateBookingStatus", {
        bookingId,
        status: newStatus,
      });
      if (data.success) {
        toast.success("Payment status updated!");
        setLoading(true);
        if (selectedTheaterId) {
          await fetchBookingsList(selectedTheaterId);
        }
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Failed to update payment status:", err);
      toast.error("Error updating status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🎬 View Bookings by Theater</h1>

      {/* 🎭 Theater Selector */}
      <div className="mb-6 space-x-4">
        {theaterList.map((theater) => (
          <button
            key={theater._id}
            onClick={() => handleFetchBookings(theater._id)}
            className={`px-4 py-2 rounded-full border transition ${
              selectedTheaterId === theater._id
                ? "bg-white text-black"
                : "bg-transparent text-white border-white hover:bg-white hover:text-black"
            }`}
          >
            {theater.name}
          </button>
        ))}
      </div>

      {/* ✅ Show Loading */}
      {loading ? (
        <Loading />
      ) : bookings.length === 0 && selectedTheaterId ? (
        <div className="flex flex-col items-center justify-center text-gray-400 mt-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17v-2h6v2m-6 0h6M4 6h16M4 6a2 2 0 002-2h12a2 2 0 002 2M4 6l.928 13.01A2 2 0 006.926 21h10.148a2 2 0 001.998-1.99L20 6H4z"
            />
          </svg>
          <p className="text-lg">No bookings found for this theater yet.</p>
          <p className="text-sm text-gray-500">
            Try selecting another theater to see its bookings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-800 text-white rounded-lg p-5 shadow"
            >
              <h3 className="text-lg font-semibold mb-2">
                🎟 Booking ID: {booking._id}
              </h3>

              <p>
                👤 <strong>User:</strong>{" "}
                {isPopulatedUser(booking.user)
                  ? `${booking.user.name} (${booking.user.email})`
                  : booking.user}
              </p>

              <p>
                🎬 <strong>Movie:</strong> {booking.movie?.movie?.title}
              </p>

              <p>
                🏢 <strong>Theater:</strong>{" "}
                {isPopulatedTheater(booking.theater)
                  ? booking.theater.name
                  : booking.theater}
              </p>

              <p>
                📍 <strong>Location:</strong>{" "}
                {isPopulatedTheater(booking.theater)
                  ? formatLocation(booking.theater.location)
                  : "N/A"}
              </p>

              <p>
                ⏰ <strong>Show:</strong> {booking.movie?.showDate} at{" "}
                {booking.movie?.showTime}
              </p>

              <p>
                💺 <strong>Seats:</strong> {booking.seats?.join(", ")}
              </p>

              <p>
                💰 <strong>Total Price:</strong> ₹{booking.totalPrice}
              </p>

              <div className="mt-3">
                <strong>💳 Payment:</strong> {booking.paymentStatus}
                {booking.paymentStatus === "pending" && (
                  <div className="mt-2">
                    <select
                      className="text-black p-1 rounded"
                      defaultValue=""
                      onChange={(e) =>
                        e.target.value &&
                        updatePaymentStatus(booking._id, e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Update status
                      </option>
                      <option value="paid">Mark as Paid</option>
                      <option value="cancelled">Cancel Booking</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
