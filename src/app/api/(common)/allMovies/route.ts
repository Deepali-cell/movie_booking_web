// /app/api/admin/theater-shows/route.ts

import ConnectDb from "@/lib/ConnectDb";
import Movie from "@/models/movieModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await ConnectDb();

  try {
    const movies = await Movie.find();

    if (!movies) {
      return NextResponse.json(
        {
          success: false,
          message: "Movies not found",
        },
        { status: 404 }
      ); // ❌ 401 mat bhejo yahan
    }

    return NextResponse.json(
      {
        success: true,
        message: "✅ Movies fetched successfully!",
        movies,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("🚨 Error fetching movies:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "❌ Failed to fetch movies",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
