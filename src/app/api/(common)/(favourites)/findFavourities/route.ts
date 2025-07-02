import ConnectDb from "@/lib/ConnectDb";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      favourites: user.favourites.map((id: any) => id.toString()), // ensure strings
    });
  } catch (error: any) {
    console.error("🚨 Error while finding favourites", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "❌ Failed while finding favourites",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
