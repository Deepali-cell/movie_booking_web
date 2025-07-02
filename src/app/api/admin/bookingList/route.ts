// /app/api/admin/theater-owners/route.ts

import ConnectDb from "@/lib/ConnectDb";
import Booking from "@/models/bookingModel";
import User from "@/models/userModel";
import "@/models/threaterModel";
import "@/models/movieModel";
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
  if (!admin || admin.role !== "admin") {
    return NextResponse.json(
      { message: "Only admin can access this route" },
      { status: 403 }
    );
  }

  try {
    const bookingList = await Booking.find()
      .populate("user", "name email") // only name and email
      .populate("theater", "name location")
      .populate({
        path: "movie", // ref to Show
        populate: {
          path: "movie", // ref inside Show to Movie
          select: "title", // only title of the Movie
        },
        select: "showDate showTime showPrice movie", // include movie for next level
      })
      .populate("foodOrder") // optional, full object
      .populate("groupPlan"); // optional

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
