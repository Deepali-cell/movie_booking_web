import ConnectDb from "@/lib/ConnectDb";
import FoodCourt from "@/models/foodCourtModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await ConnectDb();

  try {
    const { searchParams } = new URL(req.url);
    const foodCourtId = searchParams.get("foodCourtId");
    const foodCourt = await FoodCourt.findById(foodCourtId);

    if (!foodCourt) {
      return NextResponse.json({
        success: false,
        message: "❌ Food court not found",
      });
    }

    return NextResponse.json({
      success: true,
      foodCourt,
    });
  } catch (err: any) {
    console.error("❌ Error fetching food court by ID:", err);
    return NextResponse.json({
      success: false,
      message: "🚨 Failed to fetch food court details",
      error: err.message,
    });
  }
}
