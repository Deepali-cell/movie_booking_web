import ConnectDb from "@/lib/ConnectDb";
import groupPlane from "@/models/groupPlaneModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import "@/models/showModel";
import "@/models/movieModel";
import "@/models/userModel";
import "@/models/threaterModel";

export async function GET(req: NextRequest) {
  try {
    await ConnectDb();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const inviteLink = searchParams.get("inviteLink");

    if (!inviteLink) {
      return NextResponse.json({
        success: false,
        message: "Missing invite link",
      });
    }

    const group = await groupPlane
      .findOne({ inviteLink })
      .populate("userSelections.theaters")
      .populate({
        path: "userSelections.shows",
        populate: {
          path: "movie",
          model: "Movie",
        },
      })
      .populate({
        path: "finalMovie",
        populate: {
          path: "movie",
          model: "Movie",
        },
      })
      .populate({
        path: "creator",
        model: "User",
        select: "email phoneNumber",
      })
      .populate({
        path: "invitedUsers",
        model: "User",
        select: "email phoneNumber",
      })
      .populate({
        path: "userSelections.user",
        model: "User",
        select: "email phoneNumber",
      });

    if (!group) {
      return NextResponse.json({
        success: false,
        message: "Group not found",
      });
    }

    const userSelection = group.userSelections.find(
      (sel: any) => sel.user._id.toString() === userId
    );

    const hasSelectedTheaters = userSelection?.theaters?.length > 0;
    const hasSelectedShows = userSelection?.shows?.length > 0;
    const allSelected = group.userSelections.every(
      (sel: any) => sel.theaters.length > 0 && sel.shows.length > 0
    );

    return NextResponse.json({
      success: true,
      group,
      currentUser: userId,
      alreadySelected: hasSelectedShows && hasSelectedTheaters,
      hasSelectedTheaters,
      hasSelectedShows,
      allSelected, // 👈 add kiya
      isCreator: group.creator._id === userId,
    });
  } catch (err) {
    console.error("GET groupData API error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
