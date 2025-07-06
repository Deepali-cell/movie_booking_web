import ConnectDb from "@/lib/ConnectDb";
import groupPlane from "@/models/groupPlaneModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDb();
    const { inviteLink, mode } = await req.json();

    if (!inviteLink || !mode) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    const group = await groupPlane.findOne({ inviteLink });
    if (!group) {
      return NextResponse.json(
        { success: false, message: "Group not found" },
        { status: 404 }
      );
    }

    group.paymentStatus = mode;
    await group.save();

    return NextResponse.json({
      success: true,
      message: `Payment mode set to ${mode}`,
    });
  } catch (err) {
    console.error("Error setting payment mode:", err);
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 }
    );
  }
}
