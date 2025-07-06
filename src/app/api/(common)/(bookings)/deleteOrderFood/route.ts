import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "@/lib/ConnectDb";
import FoodOrder from "@/models/foodOrderModel";
import { auth } from "@clerk/nextjs/server";
import Booking from "@/models/bookingModel";

export async function POST(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { foodOrderId } = await req.json();

    if (!foodOrderId) {
      return NextResponse.json({
        success: false,
        message: "Food order ID is required",
      });
    }

    const foodOrder = await FoodOrder.findById(foodOrderId);

    if (!foodOrder) {
      return NextResponse.json({
        success: false,
        message: "Food order not found",
      });
    }

    if (foodOrder.status !== "delivered" && foodOrder.status !== "cancelled") {
      return NextResponse.json({
        success: false,
        message: "Order can only be deleted if it is delivered or cancelled",
      });
    }

    // Unlink from bookings
    await Booking.updateMany(
      { foodOrder: foodOrderId },
      { $set: { foodOrder: null } }
    );

    await FoodOrder.findByIdAndDelete(foodOrderId);

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    console.error("🚨 Delete food order failed:", err);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
