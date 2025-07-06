import ConnectDb from "@/lib/ConnectDb";
import groupPlane from "@/models/groupPlaneModel";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await ConnectDb();
    const body = await req.json();
    const { creator } = body;

    const inviteLink = uuidv4();

    const groupPlan = await groupPlane.create({
      creator,
      inviteLink,
    });

    return NextResponse.json({
      success: true,
      message: "Group created successfully",
      groupId: groupPlan._id,
      inviteLink: groupPlan.inviteLink,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      sucess: false,
      message: "Something went wrong",
    });
  }
}
