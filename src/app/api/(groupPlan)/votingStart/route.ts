import ConnectDb from "@/lib/ConnectDb";
import groupPlane from "@/models/groupPlaneModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDb();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { inviteLink } = body;

    if (!inviteLink) {
      return NextResponse.json({
        success: false,
        message: "Missing invite link",
      });
    }

    const group = await groupPlane.findOne({ inviteLink });

    if (!group) {
      return NextResponse.json({
        success: false,
        message: "Group not found",
      });
    }

    if (group.creator !== userId) {
      return NextResponse.json({
        success: false,
        message: "Only the group creator can start voting.",
      });
    }

    if (group.votingStarted) {
      return NextResponse.json({
        success: false,
        message: "Voting already started.",
      });
    }

    // Start voting with a 3 min timer
    group.votingStarted = true;
    group.votingEndsAt = new Date(Date.now() + 3 * 60 * 1000);

    await group.save();

    return NextResponse.json({
      success: true,
      message: "Voting started.",
      votingEndsAt: group.votingEndsAt,
    });
  } catch (err) {
    console.error("Start Voting API Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
