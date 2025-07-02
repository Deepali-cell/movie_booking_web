import ConnectDb from "@/lib/ConnectDb";
import Show from "@/models/showModel";
import User from "@/models/userModel";
import Block from "@/models/blockModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Theater from "@/models/threaterModel";

export async function PUT(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user || user.role !== "owner") {
    return NextResponse.json(
      { message: "Only owners are allowed to edit shows" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);

    const showId = searchParams.get("showId");
    const { theaterId, blockId, movie, showDate, showTime, showPrice, status } =
      await req.json();

    const existingShow = await Show.findById(showId);
    if (!existingShow) {
      return NextResponse.json({
        success: false,
        message: "❌ Show not found",
      });
    }

    const oldTheaterId = existingShow.theaterId;
    const oldBlockId = existingShow.blockId;

    // Update the Show document
    const updatedShow = await Show.findByIdAndUpdate(
      showId,
      {
        theaterId,
        blockId,
        movie,
        showDate,
        showTime,
        showPrice,
        status,
      },
      { new: true }
    );

    // If theater was changed
    if (String(oldTheaterId) !== String(theaterId)) {
      await Theater.findByIdAndUpdate(oldTheaterId, {
        $pull: { moviesPlaying: showId },
      });
      await Theater.findByIdAndUpdate(theaterId, {
        $addToSet: { moviesPlaying: showId },
      });
    }

    // If block was changed
    if (String(oldBlockId) !== String(blockId)) {
      await Block.findByIdAndUpdate(oldBlockId, {
        $pull: { movies: showId },
      });
      await Block.findByIdAndUpdate(blockId, {
        $addToSet: { movies: showId },
      });
    }

    return NextResponse.json({
      success: true,
      message: "✅ Show updated successfully!",
      show: updatedShow,
    });
  } catch (error: any) {
    console.error("❌ Error editing show:", error);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to update show",
      error: error.message,
    });
  }
}
