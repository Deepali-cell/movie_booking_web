import ConnectDb from "@/lib/ConnectDb";
import Movie from "@/models/movieModel";
import Show from "@/models/showModel";
import Theater from "@/models/threaterModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user || user.role !== "owner") {
    return NextResponse.json(
      { message: "Only owners can delete movies" },
      { status: 403 }
    );
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json(
        { success: false, message: "Missing movieId in query" },
        { status: 400 }
      );
    }

    // 1. Delete the movie from Movie collection
    const deletedMovie = await Movie.findByIdAndDelete(movieId);
    if (!deletedMovie) {
      return NextResponse.json(
        { success: false, message: "Movie not found" },
        { status: 404 }
      );
    }

    // 2. Remove movieId from all theaters' allMovies array
    await Theater.updateMany({}, { $pull: { allMovies: movieId } });

    // 3. Update shows using this movie → status = cancelled
    await Show.updateMany(
      { movie: movieId },
      { $set: { status: "cancelled" } }
    );

    return NextResponse.json({
      success: true,
      message:
        "✅ Movie deleted, removed from theaters, and related shows cancelled",
    });
  } catch (error: any) {
    console.error("❌ Error deleting movie:", error);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to delete the movie",
      error: error.message,
    });
  }
}
