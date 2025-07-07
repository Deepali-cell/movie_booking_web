import ConnectDb from "@/lib/ConnectDb";
import { NextRequest, NextResponse } from "next/server";
import Show from "@/models/showModel";

export async function GET(req: NextRequest) {
  await ConnectDb();
  try {
    const { searchParams } = new URL(req.url);
    const theaterId = searchParams.get("theaterId");

    const shows = await Show.find()
      .populate("blockId", "name screen theaterId")
      .populate("movie", "title poster_path tagline");

    const filteredShows = shows.filter(
      (show) => show.blockId?.theaterId?.toString() === theaterId
    );

    return NextResponse.json({
      success: true,
      shows: filteredShows,
    });
  } catch (error: any) {
    console.error("🚨 Error fetching shows:", error.message);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to fetch shows by theater id",
      error: error.message,
    });
  }
}
