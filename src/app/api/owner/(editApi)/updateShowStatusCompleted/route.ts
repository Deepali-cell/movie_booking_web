import ConnectDb from "@/lib/ConnectDb";
import Show from "@/models/showModel";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  await ConnectDb();

  try {
    const now = new Date();
    const shows = await Show.find({ status: "scheduled" });

    let updatedCount = 0;
    for (const show of shows) {
      const showDateTime = new Date(`${show.showDate}T${show.showTime}:00`);
      if (showDateTime < now) {
        await Show.updateOne(
          { _id: show._id },
          { $set: { status: "completed" } }
        );
        updatedCount++;
      }
    }

    return NextResponse.json({
      message: `Updated ${updatedCount} shows to completed`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" });
  }
}
