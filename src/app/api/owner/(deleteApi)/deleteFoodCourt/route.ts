import ConnectDb from "@/lib/ConnectDb";
import FoodCourt from "@/models/foodCourtModel";
import Theater from "@/models/threaterModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user || user.role !== "owner") {
    return NextResponse.json(
      { message: "Only owners can delete food courts" },
      { status: 403 }
    );
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const foodCourtId = searchParams.get("foodCourtId");

    if (!foodCourtId) {
      return NextResponse.json(
        { success: false, message: "Missing foodCourtId" },
        { status: 400 }
      );
    }

    // 1. Find the food court to get the theater ID
    const foodCourt = await FoodCourt.findById(foodCourtId);
    if (!foodCourt) {
      return NextResponse.json(
        { success: false, message: "Food court not found" },
        { status: 404 }
      );
    }

    const theaterId = foodCourt.theater;

    // 2. Delete the food court
    await FoodCourt.findByIdAndDelete(foodCourtId);

    // 3. Pull the food court ID from the theater's `foodCourts` array
    await Theater.findByIdAndUpdate(theaterId, {
      $pull: { foodCourts: foodCourtId },
    });

    return NextResponse.json({
      success: true,
      message: "✅ Food court deleted and removed from theater successfully",
    });
  } catch (error: any) {
    console.error("❌ Error deleting food court:", error);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to delete food court",
      error: error.message,
    });
  }
}
