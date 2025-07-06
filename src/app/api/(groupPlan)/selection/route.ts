import ConnectDb from "@/lib/ConnectDb";
import groupPlan from "@/models/groupPlaneModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { inviteLink, theaters, shows } = body;

    if (!inviteLink) {
      return NextResponse.json(
        { error: "Missing inviteLink" },
        { status: 400 }
      );
    }

    const group = await groupPlan.findOne({ inviteLink }); // 🔥 use const

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    let userSelection = group.userSelections.find(
      (sel: any) => sel.user === userId
    );

    if (!userSelection) {
      userSelection = {
        user: userId,
        theaters: theaters || [],
        shows: shows ? Object.values(shows).flat() : [],
        completed: false,
        voted: false,
      };
      group.userSelections.push(userSelection);
    } else {
      if (theaters) userSelection.theaters = theaters;
      if (shows) userSelection.shows = Object.values(shows).flat();
    }

    await group.save();
    return NextResponse.json(
      { message: "Selection updated." },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({
      success: false,
      message: "Error selection",
    });
  }
}
