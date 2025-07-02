import ConnectDb from "@/lib/ConnectDb";
import Theater from "@/models/threaterModel";
import User from "@/models/userModel";
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
      { message: "Only owners are allowed to view their movies" },
      { status: 403 }
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const theaterId = searchParams.get("theaterId");

  if (!theaterId) {
    return NextResponse.json(
      { message: "Missing theaterId in query parameters" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Find the theater and populate allMovies
    const theater = await Theater.findById(theaterId).populate("allMovies");

    if (!theater) {
      return NextResponse.json(
        { message: "Theater not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "🎬 Movies fetched successfully!",
      movies: theater.allMovies,
    });
  } catch (error: any) {
    console.error("🚨 Error fetching movies:", error.message);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to fetch movies",
      error: error.message,
    });
  }
}
