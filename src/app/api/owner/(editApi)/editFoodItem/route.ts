// owner/editFoodItem
import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "@/lib/ConnectDb";
import FoodCourt from "@/models/foodCourtModel";

export async function PUT(req: NextRequest) {
  await ConnectDb();

  const { foodCourtId, originalName, updatedItem } = await req.json();

  if (!foodCourtId || !originalName || !updatedItem) {
    return NextResponse.json(
      { success: false, message: "Missing data" },
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

    const index = foodCourt.foodMenu.findIndex(
      (item: any) => item.name.toLowerCase() === originalName.toLowerCase()
    );

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    foodCourt.foodMenu[index] = updatedItem;
    await foodCourt.save();

    return NextResponse.json({
      success: true,
      message: "Food item updated successfully",
      foodCourts: foodCourt,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to update item",
    });
  }
}
