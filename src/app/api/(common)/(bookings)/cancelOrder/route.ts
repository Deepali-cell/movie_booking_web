import ConnectDb from "@/lib/ConnectDb";
import FoodOrder from "@/models/foodOrderModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { foodOrderId } = body;

    if (!foodOrderId) {
      return NextResponse.json(
        { success: false, message: "Food Order ID is required" },
        { status: 400 }
      );
    }

    // Update the order status to cancelled
    const updatedOrder = await FoodOrder.findByIdAndUpdate(
      foodOrderId,
      { $set: { status: "cancelled" } },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Food Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Food order has been cancelled",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("🚨 Cancel Order Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
