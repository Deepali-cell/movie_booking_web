import ConnectDb from "@/lib/ConnectDb";
import Booking from "@/models/bookingModel";
import User from "@/models/userModel";
import "@/models/threaterModel";
import "@/models/movieModel"; // force import
import "@/models/showModel"; // force import
import "@/models/foodOrderModel";
import "@/models/showModel";

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await ConnectDb();

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const admin = await User.findById(userId);
  if (!admin || admin.role !== "owner") {
    return NextResponse.json(
      { message: "Only owner can access this route" },
      { status: 403 }
    );
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const theaterId = searchParams.get("theaterId");

    if (!theaterId) {
      return NextResponse.json(
        { message: "Missing theaterId in query parameters" },
        { status: 400 }
      );
    }

    const bookingList = await Booking.find({ theater: theaterId })
      .populate("user", "name email")
      .populate("theater", "name location")
      .populate({
        path: "movie", // Show
        select: "showDate showTime showPrice movie",
        populate: {
          path: "movie", // Movie inside Show
          model: "Movie",
          select: "title",
        },
      })

      .populate("foodOrder")
      .populate("groupPlan");

    return NextResponse.json({
      success: true,
      message: "✅ Booking fetched successfully!",
      bookingList,
    });
  } catch (error: any) {
    console.error("🚨 Error fetching booking list:", error.message);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to fetch booking list",
      error: error.message,
    });
  }
}
