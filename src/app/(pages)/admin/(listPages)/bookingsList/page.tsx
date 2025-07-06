"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BookingType, TheaterType } from "@/lib/types";

const AdminBookingPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get<{
          success: boolean;
          bookingList: BookingType[];
          message?: string;
        }>("/api/admin/bookingList");
        if (data.success) {
          setBookings(data.bookingList);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatLocation = (location?: TheaterType["location"]) => {
    if (!location) return "N/A";
    const { addressLine, city, state, country, pincode, landmarks } = location;
    return `${addressLine ?? ""}, ${city ?? ""}, ${state ?? ""}, ${
      country ?? ""
    } - ${pincode ?? ""}${
      landmarks?.length ? " (Landmarks: " + landmarks.join(", ") + ")" : ""
    }`;
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">🎟️ All Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-800 text-white rounded-lg p-4 mb-4 shadow"
            >
              <h3 className="text-lg font-semibold mb-2">
                🎟 Booking ID: {booking._id}
              </h3>

              <p>
                👤 <strong>User:</strong>{" "}
                {typeof booking.user !== "string" ? (
                  <>
                    {booking.user?.name} ({booking.user?.email})
                  </>
                ) : (
                  booking.user
                )}
              </p>

              <p>
                🎬 <strong>Movie:</strong> {booking.movie?.movie?.title}
              </p>

              <p>
                🏢 <strong>Theater:</strong>{" "}
                {typeof booking.theater !== "string"
                  ? booking.theater?.name
                  : booking.theater}
              </p>

              <p>
                📍 <strong>Location:</strong>{" "}
                {typeof booking.theater !== "string"
                  ? formatLocation(booking.theater?.location)
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

              <p>
                💳 <strong>Payment:</strong> {booking.paymentStatus}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookingPage;
