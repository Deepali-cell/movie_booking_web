import ConnectDb from "@/lib/ConnectDb";
import { NextRequest, NextResponse } from "next/server";
import Show from "@/models/showModel";
import Block from "@/models/blockModel";
import Theater from "@/models/threaterModel";

export async function GET(req: NextRequest) {
  await ConnectDb();
  try {
    const { searchParams } = new URL(req.url);
    const theaterId = searchParams.get("theaterId");
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0]; // e.g. "2025-07-07"

    // ✅ 1. Update scheduled shows to completed if show time passed
    const scheduledShows = await Show.find({ status: "scheduled" });
    await Promise.all(
      scheduledShows.map(async (show) => {
        const showDateTime = new Date(`${show.showDate}T${show.showTime}:00`);
        if (showDateTime < now) {
          await Show.updateOne(
            { _id: show._id },
            { $set: { status: "completed" } }
          );
        }
      })
    );

    // ✅ 2. Clean up past shows: remove from blocks & theaters, then delete show
    const expiredShows = await Show.find({ showDate: { $lt: todayStr } });
    await Promise.all(
      expiredShows.map(async (show) => {
        await Block.updateOne(
          { _id: show.blockId },
          { $pull: { movies: String(show._id) } }
        );

        await Theater.updateMany(
          { moviesPlaying: String(show._id) },
          { $pull: { moviesPlaying: String(show._id) } }
        );

        await Show.deleteOne({ _id: show._id });
      })
    );

    // ✅ 3. Now fetch fresh shows after cleanup
    const shows = await Show.find()
      .populate("blockId", "name screen theaterId")
      .populate("movie", "title poster_path tagline");

    const filteredShows = shows.filter(
      (show) => show.blockId?.theaterId?.toString() === theaterId
    );

    return NextResponse.json({
      success: true,
      shows: filteredShows,
    });
  } catch (error) {
    console.error("🚨 Error fetching shows:", error);
    // ✅ Safe error message handling
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({
      success: false,
      message: "❌ Failed to fetch shows by theater id",
      error: errorMessage,
    });
  }
}
