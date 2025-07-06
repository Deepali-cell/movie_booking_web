import ConnectDb from "@/lib/ConnectDb";
import Block from "@/models/blockModel";
import Show from "@/models/showModel";
import Theater from "@/models/threaterModel";
import { NextResponse } from "next/server";

// /app/api/cleanupShows/route.ts
export const dynamic = "force-dynamic";
export async function GET() {
  await ConnectDb();
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // Scheduled -> completed
  const scheduled = await Show.find({ status: "scheduled" });
  for (const show of scheduled) {
    if (new Date(`${show.showDate}T${show.showTime}:00`) < now) {
      await Show.updateOne(
        { _id: show._id },
        { $set: { status: "completed" } }
      );
    }
  }

  // Old delete
  const expired = await Show.find({ showDate: { $lt: todayStr } });
  for (const show of expired) {
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

  return NextResponse.json({ success: true, message: "Cleanup done." });
}
