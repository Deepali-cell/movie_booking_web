"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface OrderDataType {
  userDetail: { name: string; seat: string; block: string };
  theaterId: string;
  foodCourtId: string;
  items: { name: string; quantity: number; price: number; allergyNote?: string }[];
  totalAmount: number;
}

const OrderModal = ({
  onClose,
  orderData,
  action,
}: {
  onClose: () => void;
  orderData: OrderDataType;
  action: string;
}) => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [seat, setSeat] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"cash" | "online">("cash");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        userDetail: {
          name,
          block: orderData.userDetail.block,
          ...(action === "preOrder" ? {} : { seat }),
          action: action === "preOrder" ? "pre-order" : "post-order",
        },
        theaterId: orderData.theaterId,
        foodCourtId: orderData.foodCourtId,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        paymentType,
      };
      await axios.post("/api/orderFood", payload);
      toast.success("✅ Order placed successfully!");
      router.push("/myBookings");
      onClose();
    } catch (error) {
      console.error("Order submission failed", error);
      toast.error("❌ Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalConfirm = () => {
    setShowConfirm(false);
    handleSubmit();
  };

  return (
    <>
      <Dialog open={!showConfirm} onOpenChange={onClose}>
        <DialogContent className="bg-[#1a1a1a] text-white border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Order</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-black text-white"
              />
            </div>

            {!(action === "preOrder") && (
              <div>
                <Label>Seat Number</Label>
                <Input
                  value={seat}
                  onChange={(e) => setSeat(e.target.value)}
                  placeholder="Enter seat number"
                  className="bg-black text-white"
                />
              </div>
            )}

            <div>
              <Label>Payment Type</Label>
              <Select
                value={paymentType}
                onValueChange={(value) => setPaymentType(value as "cash" | "online")}
              >
                <SelectTrigger className="bg-black text-white">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] text-white">
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-400">
              Total: ₹{orderData.totalAmount}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                disabled={
                  submitting || !name || (!(action === "preOrder") && !seat)
                }
                onClick={() =>
                  paymentType === "online"
                    ? setShowConfirm(true)
                    : handleSubmit()
                }
              >
                {submitting ? "Placing..." : "Place Order"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirm} onOpenChange={() => setShowConfirm(false)}>
        <DialogContent className="bg-[#111] text-white border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl">Review & Confirm</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 text-sm">
            <p>
              <strong>Name:</strong> {name}
            </p>
            {!(action === "preOrder") && (
              <p>
                <strong>Seat:</strong> {seat}
              </p>
            )}
            <p>
              <strong>Block:</strong> {orderData.userDetail.block}
            </p>
            <p>
              <strong>Payment:</strong> Online
            </p>
            <p className="font-bold text-green-400">
              Total: ₹{orderData.totalAmount}
            </p>
            <div className="pt-4 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowConfirm(false)}>
                Back
              </Button>
              <Button
                onClick={handleFinalConfirm}
                className="bg-green-600 hover:bg-green-700"
              >
                Confirm Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderModal;
