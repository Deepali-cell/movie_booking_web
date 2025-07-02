"use client";
import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import FoodBill from "@/components/common/bookingSection/FoodBill";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import type { FoodOrderType, BookingType } from "@/lib/types";

const Page = () => {
  const [foodOrders, setFoodOrders] = useState<FoodOrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFoodOrder, setActiveFoodOrder] = useState<FoodOrderType | null>(
    null
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/getBookingByUserId");
        const data: { success: boolean; bookingList: BookingType[] } =
          await res.json();
        if (data.success) {
          const orders = data.bookingList
            .filter((b) => b.foodOrder)
            .map((b) => b.foodOrder as FoodOrderType); // type cast
          setFoodOrders(orders);
        }
      } catch (err) {
        console.error("Error fetching food orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const cancelFoodOrder = async (foodOrderId: string) => {
    try {
      const { data }: { data: { success: boolean; message: string } } =
        await axios.post("/api/cancelOrder", {
          foodOrderId,
        });
      if (data.success) {
        toast.success(data.message);
        // optionally remove the order from list
        setFoodOrders((prev) =>
          prev.map((order) =>
            order._id === foodOrderId
              ? { ...order, status: "cancelled" }
              : order
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("🚨 Cancel order failed:", err);
      toast.error("Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        <Loader2 className="animate-spin w-8 h-8 mr-2" /> Loading...
      </div>
    );
  }

  if (foodOrders.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        🍔 You have no food orders yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 max-w-xl mx-auto px-4 text-white flex flex-col">
      <h2 className="text-4xl font-bold mb-10 text-center text-white">
        🍔 Your Food Orders
      </h2>

      <div className="flex-1 space-y-6">
        {foodOrders.map((order) => (
          <div
            key={order._id}
            className="border border-white/30 rounded-xl p-4 hover:shadow-lg transition hover:border-white/70"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-white">
                Order #{order._id.slice(-6)}
              </h3>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold border ${
                  order.status === "delivered"
                    ? "border-green-400 text-green-400"
                    : order.status === "cancelled"
                    ? "border-red-400 text-red-400"
                    : "border-yellow-400 text-yellow-400"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-gray-300 mb-1">
              <strong>Block:</strong> {order.userDetail?.block ?? ""}, Seat:{" "}
              {order.userDetail?.seat ?? ""} (
              <em>{order.userDetail?.action ?? ""}</em>)
            </p>
            <p className="text-xs text-blue-300 mb-3">
              Payment: <span className="capitalize">{order.paymentType}</span>
            </p>

            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 border border-white/20 rounded p-2"
                >
                  <div className="w-12 h-12 rounded border border-white/20 overflow-hidden"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      Qty: {item.quantity} | ₹{item.price * item.quantity}
                    </p>
                    {item.allergyNote && (
                      <p className="text-xs text-yellow-300">
                        ⚠ {item.allergyNote}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-1 text-sm">
                {order.status === "delivered" ? (
                  <CheckCircle className="text-green-400 w-4 h-4" />
                ) : order.status === "cancelled" ? (
                  <XCircle className="text-red-400 w-4 h-4" />
                ) : (
                  <Clock className="text-yellow-400 w-4 h-4" />
                )}
                <span>
                  {order.status === "delivered"
                    ? "Delivered"
                    : order.status === "cancelled"
                    ? "Cancelled"
                    : "In Progress"}
                </span>
              </div>
              <div className="text-base font-semibold text-green-400">
                ₹{order.totalAmount}
              </div>
            </div>

            <button
              onClick={() => setActiveFoodOrder(order)}
              className="mt-4 w-full py-2 rounded bg-green-600 hover:bg-green-700 text-white"
            >
              🧾 View Bill
            </button>
            <Button
              className="mt-4 w-full py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (confirm("Are you sure you want to cancel this order?")) {
                  cancelFoodOrder(order._id);
                }
              }}
            >
              ❌ Cancel Order
            </Button>
          </div>
        ))}
      </div>

      {activeFoodOrder && (
        <FoodBill
          activeFoodOrder={activeFoodOrder}
          onClose={() => setActiveFoodOrder(null)}
        />
      )}
    </div>
  );
};

export default Page;
