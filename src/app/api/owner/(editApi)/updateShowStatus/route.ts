import ConnectDb from "@/lib/ConnectDb";
import Show from "@/models/showModel";
import Block from "@/models/blockModel";
import { NextRequest, NextResponse } from "next/server";
import Theater from "@/models/threaterModel";

export async function PATCH(req: NextRequest) {
  await ConnectDb();

  try {
    const { showId, newStatus } = await req.json();

    if (!showId || !newStatus) {
      return NextResponse.json(
        { success: false, message: "Show ID and new status required" },
        { status: 400 }
      );
    }

    // 1. Find the show
    const show = await Show.findById(showId);
    if (!show) {
      return NextResponse.json(
        { success: false, message: "Show not found" },
        { status: 404 }
      );
    }

    // 2. Update show status
    show.status = newStatus;
    await show.save();

    // 3. If status is cancelled, remove from Theater.moviesPlaying and Block.movies
    if (newStatus === "cancelled") {
      const block = await Block.findById(show.blockId);
      if (block) {
        await Theater.updateOne(
          { _id: block.theaterId },
          { $pull: { moviesPlaying: show._id } }
        );

        await Block.updateOne(
          { _id: block._id },
          { $pull: { movies: show._id } }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Show updated to ${newStatus}${
        newStatus === "cancelled" ? " and removed from theater & block" : ""
      }`,
    });
  } catch (err) {
    console.error("Error updating show:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
