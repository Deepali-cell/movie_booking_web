import ConnectDb from "@/lib/ConnectDb";
import { auth } from "@clerk/nextjs/server";
import groupPlane from "@/models/groupPlaneModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();
  const { searchParams } = new URL(req.url);
  const inviteLink = searchParams.get("inviteLink");

  try {
    const group = await groupPlane.findOne({ inviteLink });
    if (!group) {
      return NextResponse.json({ success: false, message: "Group not found" });
    }

    await group.save();

    return NextResponse.json({
      success: true,
      group: {
        splitDetails: group.splitDetails,
        currentUser: userId,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "Failed to get split status",
    });
  }
}
