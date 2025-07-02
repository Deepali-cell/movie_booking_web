// app/api/movie/add/route.ts
import ConnectDb from "@/lib/ConnectDb";
import Movie from "@/models/movieModel";
import Theater from "@/models/threaterModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user || user.role !== "owner") {
    return NextResponse.json(
      { message: "Only owners are allowed to add movies" },
      { status: 403 }
    );
  }

  try {
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

    const newMovie = await Movie.create({
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
    });

    const updated = await Theater.findByIdAndUpdate(
      theaterId,
      { $push: { allMovies: newMovie._id } },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({
        success: false,
        message: "Movie is not correctly added to the theater",
      });
    }
    return NextResponse.json({
      success: true,
      message: "✅ New movie added and linked to theater",
      movie: newMovie,
    });
  } catch (error) {
    console.error("❌ Error adding movie:", error);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to add new movie",
    });
  }
}
