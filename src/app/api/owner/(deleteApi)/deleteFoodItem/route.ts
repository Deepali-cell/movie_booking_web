// owner/deleteFoodItem
import ConnectDb from "@/lib/ConnectDb";
import FoodCourt from "@/models/foodCourtModel";
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
      { message: "Only owners can delete food items" },
      { status: 403 }
    );
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const foodCourtId = searchParams.get("foodCourtId");
    const itemName = searchParams.get("itemName");

    if (!foodCourtId || !itemName) {
      return NextResponse.json(
        { success: false, message: "Missing foodCourtId or itemName" },
        { status: 400 }
      );
    }

    const result = await FoodCourt.findByIdAndUpdate(
      foodCourtId,
      { $pull: { foodMenu: { name: itemName } } },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Food court not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `✅ Item "${itemName}" deleted successfully`,
      foodCourts: result,
    });
  } catch (error: any) {
    console.error("❌ Error deleting food item:", error);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to delete food item",
      error: error.message,
    });
  }
}
