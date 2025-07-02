import ConnectDb from "@/lib/ConnectDb";
import Movie from "@/models/movieModel";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  await ConnectDb();
  try {
    const { searchParams } = new URL(req.url);

    const movieId = searchParams.get("movieId");
    const body = await req.json();

    const {
      title,
      overview,
      poster_path,
      backdrop_path,
      tagline,
      genres,
      casts,
      original_language,
      release_date,
      vote_average,
      vote_count,
      runtime,
      shorts,
      theaterId,
    } = body;

    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      {
        title,
        overview,
        poster_path,
        backdrop_path,
        tagline,
        genres,
        casts,
        original_language,
        release_date,
        vote_average,
        vote_count,
        runtime,
        shorts,
      },
      {
        new: true,
      }
    );

    if (!updatedMovie) {
      return NextResponse.json(
        { success: false, message: "Movie not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "✅ Movie updated successfully",
      movie: updatedMovie,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "❌ Failed to update movie",
      error: error.message,
    });
  }
}
