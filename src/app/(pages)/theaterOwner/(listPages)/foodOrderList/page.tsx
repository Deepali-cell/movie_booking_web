"use client";
import React, { useState, useEffect } from "react";
import { useStateContext } from "@/context/StateContextProvider";
import axios from "axios";
import toast from "react-hot-toast";
import { FoodCourtType, FoodOrderType } from "@/lib/types";

const Page = () => {
  const { theaterList } = useStateContext();
  const [selectedFoodCourt, setSelectedFoodCourt] = useState<string | null>(
    null
  );

  const [orders, setOrders] = useState<FoodOrderType[]>([]);
  const [loading, setLoading] = useState(false);

  // Get the selected food court details for block & floor
  const selectedFoodCourtDetails = theaterList
    ?.flatMap((theater) => theater.foodCourts || [])
    .find((fc) => fc._id === selectedFoodCourt);
  useEffect(() => {
    const fetchOrders = async () => {
      if (!selectedFoodCourt) return;
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/owner/fetchOrderByFoodCourtId?foodCourtId=${selectedFoodCourt}`
        );
        if (data.success) {
          setOrders(data.orders);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log("frontend error while fetching orders", error);
        toast.error("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    if (selectedFoodCourt) fetchOrders();
  }, [selectedFoodCourt]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { data } = await axios.put(`/api/owner/updateOrderStatus`, {
        orderId,
        status: newStatus,
      });
      if (data.success) {
        toast.success("Status updated!");
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log("error updating status", err);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🎬 Theater Orders Panel
      </h1>

      {theaterList?.length ? (
        theaterList.map((theater) => (
          <div key={theater._id} className="mb-6 border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{theater.name}</h2>
            <ul className="ml-4">
              {theater.foodCourts?.length ? (
                theater.foodCourts.map((fc: FoodCourtType) => (
                  <li
                    key={fc._id}
                    className={`cursor-pointer hover:text-blue-600 transition ${
                      selectedFoodCourt === fc._id
                        ? "font-bold text-green-600"
                        : ""
                    }`}
                    onClick={() => setSelectedFoodCourt(fc._id)}
                  >
                    🍔 {fc.name}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No foodcourts available.</li>
              )}
            </ul>
          </div>
        ))
      ) : (
        <p>No theaters found.</p>
      )}

      {selectedFoodCourt && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Orders for:{" "}
            <span className="text-blue-600">
              {selectedFoodCourtDetails?.name}
            </span>
          </h2>
          <div className="text-center mb-6">
            {selectedFoodCourtDetails?.location?.block && (
              <span className="mr-4">
                Block:{" "}
                <strong>{selectedFoodCourtDetails.location.block}</strong>
              </span>
            )}
            {selectedFoodCourtDetails?.location?.floor && (
              <span>
                Floor:{" "}
                <strong>{selectedFoodCourtDetails.location.floor}</strong>
              </span>
            )}
          </div>

          {loading ? (
            <p className="text-center">Loading orders...</p>
          ) : orders?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <div key={order._id} className="border rounded p-5 shadow-md">
                  <div className="mb-2">
                    <strong>Order ID:</strong> {order._id}
                  </div>
                  <div>
                    <strong>Theater:</strong>{" "}
                    {typeof order.theaterId !== "string"
                      ? order.theaterId?.name
                      : ""}
                  </div>
                  <div>
                    <strong>FoodCourt:</strong>{" "}
                    {typeof order.foodCourtId === "string"
                      ? order.foodCourtId
                      : order.foodCourtId?.name}
                  </div>
                  <div className="mb-2">
                    <strong>Customer:</strong> {order.userDetail?.name}
                    {order.userDetail?.seat && (
                      <>
                        {" "}
                        | Seat: {order.userDetail.seat} | Block:{" "}
                        {order.userDetail.block}
                      </>
                    )}
                  </div>
                  <div className="mb-2">
                    <strong>Payment:</strong> {order.paymentType} |{" "}
                    <strong>Total:</strong> ₹{order.totalAmount}
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong>
                    <select
                      className="ml-2 border p-1 rounded"
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      <option value="">Select status</option>
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <strong>Items:</strong>
                    <ul className="list-disc ml-6 mt-1">
                      {order.items?.map((item, idx) => (
                        <li key={idx}>
                          {item.name} x {item.quantity} (₹{item.price})
                          {item.allergyNote && (
                            <span className="text-sm text-red-500 ml-2">
                              (Allergy: {item.allergyNote})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No orders found for this foodcourt.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
