import ConnectDb from "@/lib/ConnectDb";
import Show from "@/models/showModel";
import Theater from "@/models/threaterModel";
import Block from "@/models/blockModel";
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
      { message: "Only owners can delete shows" },
      { status: 403 }
    );
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const showId = searchParams.get("showId");

    if (!showId) {
      return NextResponse.json(
        { success: false, message: "Missing showId in query" },
        { status: 400 }
      );
    }

    // 1. Delete the show itself
    const deletedShow = await Show.findByIdAndDelete(showId);
    if (!deletedShow) {
      return NextResponse.json(
        { success: false, message: "Show not found" },
        { status: 404 }
      );
    }

    // 2. Remove showId from all theaters (moviesPlaying and allMovies)
    await Theater.updateMany(
      {},
      {
        $pull: {
          moviesPlaying: showId,
        },
      }
    );

    // 3. Remove showId from all blocks (movies array)
    await Block.updateMany({}, { $pull: { movies: showId } });

    return NextResponse.json({
      success: true,
      message: "✅ Show deleted and references cleaned up successfully",
    });
  } catch (error: any) {
    console.error("❌ Error deleting show:", error);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to delete the show",
      error: error.message,
    });
  }
}
