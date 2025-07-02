// /app/api/admin/theater-owners/route.ts

import ConnectDb from "@/lib/ConnectDb";
import TheaterOwner from "@/models/theaterOwnerModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await ConnectDb();

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const admin = await User.findById(userId);
  if (!admin || admin.role !== "admin") {
    return NextResponse.json(
      { message: "Only admin can access this route" },
      { status: 403 }
    );
  }

  try {
    const ownersList = await TheaterOwner.find()
      .populate({
        path: "userId",
        select: "name email phoneNumber image role",
      })
      .populate({
        path: "theaters",
      });

    return NextResponse.json({
      success: true,
      message: "✅ Theater owners fetched successfully!",
      ownersList,
    });
  } catch (error: any) {
    console.error("🚨 Error fetching theater owners:", error.message);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to fetch theater owners",
      error: error.message,
    });
  }
}
