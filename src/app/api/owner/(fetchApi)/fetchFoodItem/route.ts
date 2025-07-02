import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "@/lib/ConnectDb";
import FoodCourt from "@/models/foodCourtModel";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/userModel";

export async function GET(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user || user.role !== "owner") {
    return NextResponse.json(
      { message: "Only owners are allowed to view their food courts" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const foodCourtId = searchParams.get("foodCourtId");
  const itemName = searchParams.get("itemName")?.trim();

  if (!foodCourtId || !itemName) {
    return NextResponse.json(
      { success: false, message: "Missing parameters" },
      { status: 400 }
    );
  }

  try {
    const foodCourt = await FoodCourt.findById(foodCourtId);
    if (!foodCourt) {
      return NextResponse.json(
        { success: false, message: "Food court not found" },
        { status: 404 }
      );
    }
    const item = foodCourt.foodMenu.find(
      (item: any) => item.name.trim().toLowerCase() === itemName.toLowerCase()
    );

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error", error },
      { status: 500 }
    );
  }
}
