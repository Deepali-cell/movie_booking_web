"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface FoodCourtGetDetailsType {
  bookingId: string;
  blockName: string;
  theaterId: string;
  paymentStatus?: string;
  showStatus?: string;
}

const FoodOptionModal = ({
  setShowFoodOptionModal,
  foodCourtGetDetails,
}: {
  setShowFoodOptionModal: React.Dispatch<React.SetStateAction<boolean>>;
  foodCourtGetDetails: FoodCourtGetDetailsType;
}) => {
  const router = useRouter();
  const { bookingId, blockName, theaterId, paymentStatus, showStatus } =
    foodCourtGetDetails;

  const handleRoute = (action: string) => {
    const query = new URLSearchParams({
      action,
      blockName,
      theaterId,
    }).toString();

    router.push(`/foodOrder/${bookingId}?${query}`);
    setShowFoodOptionModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl text-center">
        <h3 className="text-2xl font-bold mb-4 text-black">🍿 Order Food</h3>
        <p className="mb-6 text-gray-700">
          Would you like to pre-order snacks or order during the show?
        </p>
        <div className="flex flex-col gap-4">
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded"
            onClick={() => handleRoute("preOrder")}
          >
            🕐 Pre-Order
          </button>

          {paymentStatus === "paid" && showStatus === "scheduled" && (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              onClick={() => handleRoute("postOrder")}
            >
              🎥 Order During Show
            </button>
          )}

          <button
            className="mt-2 text-gray-500 hover:underline"
            onClick={() => setShowFoodOptionModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodOptionModal;
