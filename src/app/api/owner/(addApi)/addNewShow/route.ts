import ConnectDb from "@/lib/ConnectDb";
import Show from "@/models/showModel";
import Block from "@/models/blockModel";
import Theater from "@/models/threaterModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user || user.role !== "owner") {
    return NextResponse.json(
      { message: "Only owners are allowed to add shows" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { theaterId, blockId, movie, showDate, showTime, showPrice, status } =
      body;

    // ✅ Create the Show
    const newShow = await Show.create({
      blockId,
      movie,
      showDate,
      showTime,
      showPrice,
      status,
    });

    // ✅ Update Theater -> moviesPlaying[]
    const theaterUpdate = await Theater.findByIdAndUpdate(
      theaterId,
      { $push: { moviesPlaying: newShow._id } },
      { new: true }
    );

    if (!theaterUpdate) {
      return NextResponse.json({
        success: false,
        message: "show is not added in the theater",
      });
    }
    // ✅ Update Block -> movies[]
    const blockUpdate = await Block.findByIdAndUpdate(
      blockId,
      { $push: { movies: newShow._id } },
      { new: true }
    );

    if (!blockUpdate) {
      return NextResponse.json({
        success: false,
        message: "show is not added in the block",
      });
    }
    return NextResponse.json({
      success: true,
      message: "✅ Show created and linked successfully!",
      show: newShow,
    });
  } catch (error: any) {
    console.error("❌ Error adding new show:", error);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to add new show",
      error: error.message,
    });
  }
}
