import ConnectDb from "@/lib/ConnectDb";
import Movie from "@/models/movieModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await ConnectDb();
    const user = await User.findById(userId);
    if (!user || user.role !== "owner") {
      return NextResponse.json(
        { success: false, message: "Only owners can add shorts" },
        { status: 403 }
      );
    }

    const { movieId, shortUrl } = await req.json();

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return NextResponse.json(
        { success: false, message: "Movie not found" },
        { status: 404 }
      );
    }

    movie.shorts.push(shortUrl);
    await movie.save();

    return NextResponse.json({ success: true, message: "Short added" });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
