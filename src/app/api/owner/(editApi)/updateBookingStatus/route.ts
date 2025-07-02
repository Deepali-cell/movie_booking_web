import ConnectDb from "@/lib/ConnectDb";
import Booking from "@/models/bookingModel";
import FoodOrder from "@/models/foodOrderModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const admin = await User.findById(userId);
  if (!admin || admin.role !== "owner") {
    return NextResponse.json(
      { message: "Only owner can update status" },
      { status: 403 }
    );
  }

  const { bookingId, status } = await req.json();

  if (!["pending", "paid", "cancelled"].includes(status)) {
    return NextResponse.json(
      { message: "Invalid status value" },
      { status: 400 }
    );
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return NextResponse.json({ message: "Booking not found" }, { status: 404 });
  }

  // if cancelling, delete the linked food order
  if (status === "cancelled" && booking.foodOrder) {
    await FoodOrder.findByIdAndDelete(booking.foodOrder);
  }

  booking.paymentStatus = status;
  await booking.save();

  return NextResponse.json({
    success: true,
    message: `Payment status updated${
      status === "cancelled" && booking.foodOrder
        ? " and food order deleted"
        : ""
    }`,
  });
}
