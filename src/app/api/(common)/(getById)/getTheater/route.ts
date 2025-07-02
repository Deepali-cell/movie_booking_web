import ConnectDb from "@/lib/ConnectDb";
import Theater from "@/models/threaterModel";
import Show from "@/models/showModel";
import Block from "@/models/blockModel";
import "@/models/movieModel";
import "@/models/foodCourtModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await ConnectDb();
  try {
    const { searchParams } = new URL(req.url);

    const theaterId = searchParams.get("theaterId");

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0]; // "YYYY-MM-DD"

    // ✅ 1. Update status to completed if scheduled show time passed
    const scheduledShows = await Show.find({ status: "scheduled" });
    for (const show of scheduledShows) {
      const showDateTime = new Date(`${show.showDate}T${show.showTime}:00`);
      if (showDateTime < now) {
        await Show.updateOne(
          { _id: show._id },
          { $set: { status: "completed" } }
        );
      }
    }

    // ✅ 2. Remove past date shows + clean block & theater references
    const expiredShows = await Show.find({ showDate: { $lt: todayStr } });

    for (const show of expiredShows) {
      await Block.updateOne(
        { _id: show.blockId },
        { $pull: { movies: String(show._id) } }
      );

      await Theater.updateMany(
        { moviesPlaying: String(show._id) },
        { $pull: { moviesPlaying: String(show._id) } }
      );

      await Show.deleteOne({ _id: show._id });
    }

    // ✅ Finally fresh theater details fetch karo
    const theater = await Theater.findById(theaterId)
      .populate({
        path: "blocks",
        select: "name screen",
      })
      .populate({
        path: "moviesPlaying",
        populate: [
          { path: "movie" },
          { path: "blockId", select: "name screen" },
        ],
      })
      .populate("allMovies")
      .populate("foodCourts");

    if (!theater) {
      return NextResponse.json({
        success: false,
        message: "Theater not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Theater found successfully.",
      theater,
    });
  } catch (error: any) {
    console.error("🚨 Error fetching theater details:", error.message);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to fetch theater details",
      error: error.message,
    });
  }
}
