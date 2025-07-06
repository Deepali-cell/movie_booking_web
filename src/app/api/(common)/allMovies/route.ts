// /app/api/admin/theater-shows/route.ts

import ConnectDb from "@/lib/ConnectDb";
import Movie from "@/models/movieModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await ConnectDb();

  try {
    const movies = await Movie.find();

    if (!movies) {
      return NextResponse.json({
        success: false,
        message: "Novies not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "✅Novies fetched successfully!",
      movies,
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
