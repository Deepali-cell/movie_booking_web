import ConnectDb from "@/lib/ConnectDb";
import groupPlane from "@/models/groupPlaneModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const inviteLink = searchParams.get("inviteLink");
    const body = await req.json();

    if (!inviteLink) {
      return NextResponse.json({
        success: false,
        message: "Invite link missing",
      });
    }

    const groupPlan = await groupPlane.findOne({ inviteLink });
    if (!groupPlan) {
      return NextResponse.json({ success: false, message: "Group not found" });
    }

    // ✅ If user is creator, immediately tell frontend to redirect
    if (groupPlan.creator === userId) {
      return NextResponse.json({
        success: true,
        alreadyJoined: true,
        message: "You are the creator",
      });
    }

    // ✅ If user already in invitedUsers, also tell to redirect
    if (groupPlan.invitedUsers.includes(userId)) {
      return NextResponse.json({
        success: true,
        alreadyJoined: true,
        message: "Already joined as invited user",
      });
    }

    // ✅ Else: actually add to invitedUsers
    groupPlan.invitedUsers.push(userId);
    await groupPlan.save();

    return NextResponse.json({
      success: true,
      alreadyJoined: false,
      message: "Joined group successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "Error joining group",
    });
  }
}
