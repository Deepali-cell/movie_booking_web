import ConnectDb from "@/lib/ConnectDb";
import Theater from "@/models/threaterModel";
import User from "@/models/userModel";
import "@/models/blockModel";
import "@/models/foodCourtModel";
import "@/models/showModel";
import "@/models/movieModel";
import { auth } from "@clerk/nextjs/server";
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
      { message: "Only owners are allowed to view their theaters" },
      { status: 403 }
    );
  }

  try {
    const theatersList = await Theater.find({
      theaterOwner: user._id,
    })
      .populate({
        path: "blocks",
        populate: {
          path: "movies",
          model: "Show",
          populate: {
            path: "movie",
            model: "Movie",
            select: "title",
          },
        },
      })
      .populate({
        path: "foodCourts",
        model: "FoodCourt", // Ensure this is the correct model name
      });

    return NextResponse.json({
      success: true,
      message: "✅ Theaters fetched successfully!",
      list: theatersList,
    });
  } catch (error: any) {
    console.error("🚨 Error fetching theaters:", error.message);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to fetch theaters",
      error: error.message,
    });
  }
}
