import ConnectDb from "@/lib/ConnectDb";
import Booking from "@/models/bookingModel";
import FoodOrder from "@/models/foodOrderModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await ConnectDb();

  try {
    const body = await req.json();
    const { foodOrderId } = body;

    if (!foodOrderId) {
      return NextResponse.json(
        { success: false, message: "Food Order ID is required" },
        { status: 400 }
      );
    }

    // Unlink from bookings
    await Booking.updateMany(
      { foodOrder: foodOrderId },
      { $set: { foodOrder: null } }
    );

    // Find and delete the food order
    const deletedOrder = await FoodOrder.findByIdAndDelete(foodOrderId);

    if (!deletedOrder) {
      return NextResponse.json(
        { success: false, message: "Food Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Food order cancelled, deleted and unlinked from booking",
    });
  } catch (err) {
    console.error("🚨 Cancel Order Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
