import ConnectDb from "@/lib/ConnectDb";
import Show from "@/models/showModel";
import { NextRequest, NextResponse } from "next/server";

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

    // Find and update show status
    const show = await Show.findById(showId);
    if (!show) {
      return NextResponse.json(
        { success: false, message: "Show not found" },
        { status: 404 }
      );
    }

    show.status = newStatus;
    await show.save();

    return NextResponse.json({
      success: true,
      message: `Show status updated to ${newStatus}`,
    });
  } catch (err) {
    console.error("Error updating show:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
