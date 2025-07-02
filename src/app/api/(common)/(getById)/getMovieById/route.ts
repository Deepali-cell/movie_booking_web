import ConnectDb from "@/lib/ConnectDb";
import { NextRequest, NextResponse } from "next/server";
import Movie from "@/models/movieModel";

export async function GET(req: NextRequest) {
  await ConnectDb();
  try {
    const { searchParams } = new URL(req.url);

    const movieId = searchParams.get("movieId");

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return NextResponse.json({
        success: false,
        message: "movie not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Theater found successfully.",
      movie,
    });
  } catch (error: any) {
    console.error("🚨 Error fetching movie:", error.message);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to fetch movie",
      error: error.message,
    });
  }
}
