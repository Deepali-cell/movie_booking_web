import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "@/lib/ConnectDb";
import "@/models/showModel";
import "@/models/movieModel";
import "@/models/threaterModel";
import "@/models/blockModel";
import "@/models/foodCourtModel";
import "@/models/foodOrderModel";
import "@/models/groupPlaneModel";
import { auth } from "@clerk/nextjs/server";
import Booking from "@/models/bookingModel";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await ConnectDb();
  try {
    const bookingList = await Booking.find({ user: userId })
      .populate({
        path: "movie",
        model: "Show",
        populate: [
          { path: "movie", model: "Movie" },
          { path: "blockId", model: "Block", select: "name" },
        ],
      })
      .populate({
        path: "theater",
        model: "Theater",
        populate: { path: "foodCourts", model: "FoodCourt" },
      })
      .populate({
        path: "foodOrder",
        model: "FoodOrder",
      })
      .populate({
        path: "groupPlan",
        model: "GroupPlan",
        populate: [
          { path: "theater", model: "Theater" },
          { path: "finalMovie", model: "Show" },
          { path: "votes.user", model: "User" },
          { path: "splitDetails.user", model: "User" },
        ],
      });

    if (!bookingList) {
      return NextResponse.json({
        success: false,
        message: "Bookings not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Bookings found successfully",
      bookingList,
    });
  } catch (error) {
    console.error("fetch bookings error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
