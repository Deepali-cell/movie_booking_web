import ConnectDb from "@/lib/ConnectDb";
import Theater from "@/models/threaterModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await ConnectDb();
  try {
    const theatersList = await Theater.find();

    if (!theatersList) {
      return NextResponse.json({ success: false, message: "No theater found" });
    }
    return NextResponse.json({
      success: true,
      message: "✅ Theaters fetched successfully!",
      list: theatersList,
    });
  } catch (error: any) {
    console.error("🚨 Error fetching theaters:", error.message);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to fetch theaters",
      error: error.message,
    });
  }
}
