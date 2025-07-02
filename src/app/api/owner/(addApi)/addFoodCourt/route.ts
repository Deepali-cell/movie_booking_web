import ConnectDb from "@/lib/ConnectDb";
import FoodCourt from "@/models/foodCourtModel";
import Theater from "@/models/threaterModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

  try {
    const body = await req.json();
    const { theater, name, location, foodMenu, foodService } = body;

    const newFoodCourt = await FoodCourt.create({
      theater,
      name,
      location,
      foodMenu,
      foodService,
    });

    // Push FoodCourt ID to Theater
    await Theater.findByIdAndUpdate(theater, {
      $push: { foodCourts: newFoodCourt._id },
    });

    return NextResponse.json({
      success: true,
      message: "✅ Food Court created successfully",
      data: newFoodCourt,
    });
  } catch (error: any) {
    console.error("❌ Error creating food court:", error);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to create food court",
      error: error.message,
    });
  }
}
