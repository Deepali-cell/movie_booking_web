"use client";

import React, { useRef } from "react";
import domToImage from "dom-to-image";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

interface FoodOrderType {
  _id: string;
  userDetail: {
    name?: string;
    seat?: string;
    block?: string;
    action?: string;
  };
  createdAt: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  paymentType: "cash" | "online";
  status: string;
}

const FoodBill = ({
  activeFoodOrder,
  onClose,
}: {
  activeFoodOrder: FoodOrderType;
  onClose: () => void;
}) => {
  const billRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!billRef.current) return;
    try {
      const blob = await domToImage.toBlob(billRef.current, {
        bgcolor: "#ffffff",
      });
      saveAs(blob, "Food_Order_Bill.png");
    } catch (err) {
      console.error("Error downloading bill:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4">
      <div className="bg-white text-black p-6 rounded-xl w-full max-w-md shadow-2xl">
        <h3 className="text-2xl font-bold mb-4 text-center">
          🍽️ Your Food Order Bill
        </h3>

        <div
          ref={billRef}
          className="bg-white text-black border border-gray-300 p-4 rounded-md space-y-2"
        >
          <p>
            <strong>Order ID:</strong> {activeFoodOrder._id}
          </p>
          <p>
            <strong>Name:</strong> {activeFoodOrder.userDetail?.name}
          </p>
          {activeFoodOrder.userDetail?.seat && (
            <p>
              <strong>Seat:</strong> {activeFoodOrder.userDetail?.seat}
            </p>
          )}
          <p>
            <strong>Block:</strong> {activeFoodOrder.userDetail?.block}
          </p>
          <p>
            <strong>Order Time:</strong>{" "}
            {dayjs(activeFoodOrder.createdAt).format("MMM D, YYYY h:mm A")}
          </p>

          <div className="border-t pt-2">
            <p className="font-semibold">🧾 Items:</p>
            {activeFoodOrder.items?.map((item, idx) => (
              <p key={idx}>
                {item.name} × {item.quantity} = ₹{item.quantity * item.price}
              </p>
            ))}
          </div>

          <p className="pt-2">
            <strong>Total:</strong> ₹{activeFoodOrder.totalAmount}
          </p>
          <p>
            <strong>Payment Type:</strong>{" "}
            {activeFoodOrder.paymentType === "cash" ? "Cash" : "Online"}
          </p>
          <p>
            <strong>Status:</strong> {activeFoodOrder.status}
          </p>
          <p>
            <strong>Order Type:</strong>{" "}
            {activeFoodOrder.userDetail?.action === "post-order"
              ? "🍴 Post-Order"
              : "🕐 Pre-Order"}
          </p>
        </div>

        <div className="flex justify-between items-center gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-200"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ⬇️ Download Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodBill;
