import ConnectDb from "@/lib/ConnectDb";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ConnectDb();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId).populate("favourites");

    if (!user) {
      return NextResponse.json(
        { success: true, favourites: [] }, // no error, just empty list
        { status: 200 }
      );
    }
    return NextResponse.json({
      success: true,
      favourites: user.favourites, // full movie objects
    });
  } catch (error: any) {
    console.error("❌ Failed to fetch user favourites:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user favourites",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
