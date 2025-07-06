import ConnectDb from "@/lib/ConnectDb";
import { auth } from "@clerk/nextjs/server";
import groupPlane from "@/models/groupPlaneModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();
  const body = await req.json();
  const { inviteLink } = body;

  try {
    const group = await groupPlane.findOne({ inviteLink });
    if (!group) {
      return NextResponse.json({ success: false, message: "Group not found" });
    }

    const splitIndex = group.splitDetails.findIndex(
      (d: any) => d.user === userId
    );
    if (splitIndex === -1) {
      return NextResponse.json({
        success: false,
        message: "You are not part of this group",
      });
    }

    if (group.splitDetails[splitIndex].paid) {
      return NextResponse.json({ success: false, message: "Already paid" });
    }

    // ✅ Mark this user as paid
    group.splitDetails[splitIndex].paid = true;

    await group.save();

    return NextResponse.json({
      success: true,
      message: "Payment marked as complete",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Payment failed" });
  }
}
