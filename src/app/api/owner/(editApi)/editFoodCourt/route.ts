

import ConnectDb from "@/lib/ConnectDb";
import FoodCourt from "@/models/foodCourtModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user || user.role !== "owner") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);

  const foodCourtId = searchParams.get("foodCourtId");
  const body = await req.json();

  const { name, location, foodService } = body;

  try {
    const updated = await FoodCourt.findByIdAndUpdate(
      foodCourtId,
      {
        name,
        location,
        foodService,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({
        success: false,
        message: "❌ Food court not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "✅ Food court updated successfully!",
      foodCourt: updated,
    });
  } catch (error: any) {
    console.error("Error updating food court:", error);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to update food court",
      error: error.message,
    });
  }
}
