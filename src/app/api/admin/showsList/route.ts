// /app/api/admin/theater-shows/route.ts

import ConnectDb from "@/lib/ConnectDb";
import User from "@/models/userModel";
import "@/models/showModel"; // ✅ Add this
import "@/models/movieModel"; // optional but safe
import "@/models/blockModel"; // optional but safe
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Theater from "@/models/threaterModel";

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
    const searchParams = req.nextUrl.searchParams;
    const theaterId = searchParams.get("theaterId");

    if (!theaterId) {
      return NextResponse.json(
        { message: "Missing theaterId in query parameters" },
        { status: 400 }
      );
    }

    const theater = await Theater.findById(theaterId).populate({
      path: "moviesPlaying",
      populate: [
        {
          path: "movie",
          model: "Movie",
          select: "title poster_path tagline vote_average vote_count runtime",
        },
        {
          path: "blockId",
          model: "Block",
          select: "name screen",
        },
      ],
    });

    if (!theater) {
      return NextResponse.json(
        { success: false, message: "❌ Theater not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "✅ Shows fetched successfully!",
      shows: theater.moviesPlaying,
    });
  } catch (error: any) {
    console.error("🚨 Error fetching theater shows:", error.message);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to fetch theater shows",
      error: error.message,
    });
  }
}
