import ConnectDb from "@/lib/ConnectDb";
import FoodOrder from "@/models/foodOrderModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user || user.role !== "owner") {
    return NextResponse.json(
      {
        success: false,
        message: "Only owners are allowed to view their theaters",
      },
      { status: 403 }
    );
  }

  // 🔥 Ensure foodCourtId is a non-null string
  const foodCourtId = req.nextUrl.searchParams.get("foodCourtId");

  if (!foodCourtId || !mongoose.Types.ObjectId.isValid(foodCourtId)) {
    return NextResponse.json(
      { success: false, message: "Invalid or missing foodCourtId" },
      { status: 400 }
    );
  }

  try {
    const orders = await FoodOrder.find({
      foodCourtId: new mongoose.Types.ObjectId(foodCourtId),
    })
      .populate("theaterId", "name")
      .populate("foodCourtId", "name location");

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("🚨 Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch food orders",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
