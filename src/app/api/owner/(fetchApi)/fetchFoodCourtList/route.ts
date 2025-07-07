// owner/fetchFoodCourtList
import ConnectDb from "@/lib/ConnectDb";
import foodCourtModel from "@/models/foodCourtModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json(
      { message: "Only owners are allowed to view their food courts" },
      { status: 403 }
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const theaterId = searchParams.get("theaterId");
  const blockName = searchParams.get("block");

  if (!theaterId && !blockName) {
    return NextResponse.json(
      { message: "At least theaterId or block must be provided" },
      { status: 400 }
    );
  }

  try {
    const query: any = {};

    // 👉 Case 1: Both theaterId and block provided — match both **exactly**
    if (theaterId && blockName) {
      query["theater"] = new mongoose.Types.ObjectId(theaterId);
      query["location.block"] = blockName;
    }

    // 👉 Case 2: Only theaterId
    else if (theaterId) {
      query["theater"] = new mongoose.Types.ObjectId(theaterId);
    }

    // 👉 Case 3: Only blockName
    else if (blockName) {
      query["location.block"] = blockName;
    }

    const foodCourts = await foodCourtModel.find(query);

    return NextResponse.json({
      success: true,
      message: "✅ Food courts fetched successfully!",
      foodCourts: foodCourts, // instead of foodCourtList
    });
  } catch (error: any) {
    console.error("🚨 Error fetching food courts:", error.message);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to fetch food courts",
      error: error.message,
    });
  }
}
