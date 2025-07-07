import ConnectDb from "@/lib/ConnectDb";
import Block from "@/models/blockModel";
import Show from "@/models/showModel";
import Theater from "@/models/threaterModel";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // 🔒 Check Authorization header
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await ConnectDb();
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const scheduled = await Show.find({ status: "scheduled" });
  for (const show of scheduled) {
    if (new Date(`${show.showDate}T${show.showTime}:00`) < now) {
      await Show.updateOne(
        { _id: show._id },
        { $set: { status: "completed" } }
      );
    }
  }

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
