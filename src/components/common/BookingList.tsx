"use client";

import React, { useState } from "react";
import Ticket from "./bookingSection/Ticket";
import FoodOptionModal from "./bookingSection/FoodOptionModal";
import BookingCard from "./bookingSection/BookingCard";
import Loading from "./Loading";
import { BookingType } from "@/lib/types";

interface FoodCourtGetDetailsType {
  bookingId: string;
  blockName: string;
  theaterId: string;
  paymentStatus?: string;
  showStatus?: string;
}

const BookingList = ({ bookingList }: { bookingList?: BookingType[] }) => {
  const [activeTicket, setActiveTicket] = useState<BookingType | null>(null);
  const [showFoodOptionModal, setShowFoodOptionModal] = useState(false);
  const [foodCourtGetDetails, setfoodCourtGetDetails] =
    useState<FoodCourtGetDetailsType>({
      bookingId: "",
      blockName: "",
      theaterId: "",
    });

  if (!bookingList) {
    return <Loading />;
  }

  if (bookingList.length === 0) {
    return (
      <div className="text-center text-white min-h-[70vh] flex justify-center items-center">
        <p className="text-xl font-semibold">🎫 You have no bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 min-h-[90vh]">
      <h2 className="text-4xl font-bold text-white mb-10 text-center">
        🎟️ Your Bookings
      </h2>

      <div className="overflow-x-auto pb-6">
        <div className="flex flex-col gap-6 snap-x snap-mandatory overflow-x-auto px-1">
          {bookingList.map((b) => (
            <div key={b._id} className="border">
              <BookingCard
                b={b}
                setActiveTicket={setActiveTicket}
                setShowFoodOptionModal={setShowFoodOptionModal}
                setfoodCourtGetDetail={setfoodCourtGetDetails}
              />
            </div>
          ))}
        </div>
      </div>

      {activeTicket && (
        <Ticket activeTicket={activeTicket} setActiveTicket={setActiveTicket} />
      )}

      {showFoodOptionModal && (
        <FoodOptionModal
          foodCourtGetDetails={foodCourtGetDetails}
          setShowFoodOptionModal={setShowFoodOptionModal}
        />
      )}
    </div>
  );
};

export default BookingList;
