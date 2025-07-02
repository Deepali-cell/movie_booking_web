// app/api/favourites/[movieId]/route.ts
import ConnectDb from "@/lib/ConnectDb";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const alreadyFavourite = user.favourites.includes(movieId);

    let action = "";
    if (alreadyFavourite) {
      // Remove from favourites
      user.favourites = user.favourites.filter(
        (id: any) => id.toString() !== movieId
      );
      action = "removed";
    } else {
      // Add to favourites
      user.favourites.push(movieId);
      action = "added";
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: `Movie ${action} from favourites`,
      favourites: user.favourites,
    });
  } catch (error: any) {
    console.error("🚨 Error while toggling favourites", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "❌ Failed to toggle movie in favourites list",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
