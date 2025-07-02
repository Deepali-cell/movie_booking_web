import ConnectDb from "@/lib/ConnectDb";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await ConnectDb();

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { message: "Only admin are allowed to view their users list" },
      { status: 403 }
    );
  }

  try {
    const usersList = await User.find({ role: "user" });
    return NextResponse.json({
      success: true,
      message: "✅users fetched successfully!",
      usersList,
    });
  } catch (error: any) {
    console.error("🚨 Error fetching users:", error.message);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to fetch users",
      error: error.message,
    });
  }
}
