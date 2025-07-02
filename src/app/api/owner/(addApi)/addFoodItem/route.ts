import ConnectDb from "@/lib/ConnectDb";
import foodCourtModel from "@/models/foodCourtModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDb();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "owner") {
      return NextResponse.json(
        { message: "Only owners can add food courts" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, image, type, price, isVegetarian, isVegan } = body;

    const searchParams = req.nextUrl.searchParams;
    const foodCourtId = searchParams.get("foodCourtId");

    if (!foodCourtId) {
      return NextResponse.json(
        { success: false, message: "Missing foodcourtId" },
        { status: 400 }
      );
    }

    const foodCourt = await foodCourtModel.findById(foodCourtId);
    if (!foodCourt) {
      return NextResponse.json(
        { success: false, message: "FoodCourt not found" },
        { status: 404 }
      );
    }

    // 👉 Create new food item
    const newFoodItem = {
      name,
      image,
      type,
      price,
      isVegetarian,
      isVegan,
    };

    // 👉 Push new item to foodMenu array
    foodCourt.foodMenu.push(newFoodItem);

    // 👉 Save updated foodCourt
    await foodCourt.save();

    return NextResponse.json({
      success: true,
      message: "Food item added successfully",
      foodMenu: foodCourt.foodMenu,
    });
  } catch (error: any) {
    console.error("❌ Error while adding new item to the foodCourt:", error);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to add new item to the foodCourt",
      error: error.message,
    });
  }
}
