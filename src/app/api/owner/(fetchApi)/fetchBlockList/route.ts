import ConnectDb from "@/lib/ConnectDb";
import Block from "@/models/blockModel";
import Show from "@/models/showModel";
import Theater from "@/models/threaterModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user || user.role !== "owner") {
    return NextResponse.json(
      { message: "Only owners are allowed to view blocks" },
      { status: 403 }
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const theaterId = searchParams.get("theaterId");

  if (!theaterId) {
    return NextResponse.json(
      { message: "Missing theaterId in query parameters" },
      { status: 400 }
    );
  }

  try {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0]; // "YYYY-MM-DD"

    // ✅ 1. Scheduled -> Completed if time passed
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

    // ✅ 2. Delete old shows & clean references
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
    // ✅ 3. Get fresh data
    const blocks = await Block.find({ theaterId }).populate({
      path: "movies",
      populate: {
        path: "movie",
        model: "Movie",
        select: "title poster_path release_date runtime tagline",
      },
    });

    return NextResponse.json({
      success: true,
      message: "✅ Blocks fetched successfully!",
      blocks,
    });
  } catch (error: any) {
    console.error("🚨 Error fetching blocks:", error.message);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to fetch blocks",
      error: error.message,
    });
  }
}
