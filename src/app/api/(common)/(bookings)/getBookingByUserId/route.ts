import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "@/lib/ConnectDb";
import "@/models/showModel";
import "@/models/movieModel";
import "@/models/threaterModel";
import "@/models/blockModel";
import "@/models/foodCourtModel";
import "@/models/foodOrderModel";
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
        path: "movie", // Booking.movie = Show
        model: "Show",
        populate: [
          {
            path: "movie", // Show.movie = Movie
            model: "Movie",
          },
          {
            path: "blockId", // Show.blockId = Block
            model: "Block",
            select: "name", // 👈 Just the block name
          },
        ],
      })
      .populate({
        path: "theater",
        model: "Theater",
        populate: {
          path: "foodCourts",
          model: "FoodCourt", // ✅ your food court model name
        },
      })
      .populate({
        path: "foodOrder", // ✅ Add this to get full food order details
        model: "FoodOrder",
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
