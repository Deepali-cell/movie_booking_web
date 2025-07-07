import ConnectDb from "@/lib/ConnectDb";
import { NextRequest, NextResponse } from "next/server";
import Show from "@/models/showModel";
import "@/models/movieModel";
import "@/models/blockModel";
import "@/models/threaterModel";

export async function GET(req: NextRequest) {
  await ConnectDb();
  try {
    const { searchParams } = new URL(req.url);

    const showId = searchParams.get("showId");

    const show = await Show.findById(showId)
      .populate({
        path: "movie",
        select: "title poster_path tagline",
      })
      .populate({
        path: "blockId",
        select: "name screen theaterId", // ⬅️ include theaterId
      });

    if (!show) {
      return NextResponse.json({
        success: false,
        message: "❌ Show not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "✅ Show found successfully",
      show,
    });
  } catch (error: any) {
    console.error("🚨 Error fetching show by id:", error.message);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to fetch show by id",
      error: error.message,
    });
  }
}
