import ConnectDb from "@/lib/ConnectDb";
import groupPlane from "@/models/groupPlaneModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userIdFromQuery = searchParams.get("userId");

    // select only what is needed
    const createdGroups = await groupPlane
      .find({ creator: userIdFromQuery })
      .select("inviteLink createdAt finalMovie paymentStatus groupBooking");
    const invitedGroups = await groupPlane
      .find({ invitedUsers: userIdFromQuery })
      .select("inviteLink createdAt finalMovie paymentStatus groupBooking");

    return NextResponse.json({
      success: true,
      createdGroups,
      invitedGroups,
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({
      success: false,
      message: "Error fetching groups",
    });
  }
}
