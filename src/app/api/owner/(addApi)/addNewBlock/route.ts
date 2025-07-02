// app/api/block/add/route.ts
import ConnectDb from "@/lib/ConnectDb";
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

    // ✅ Get user and check role
    const user = await User.findById(userId);
    if (!user || user.role !== "owner") {
      return NextResponse.json(
        { message: "Only owners are allowed to add theaters" },
        { status: 403 }
      );
    }
  
  try {
    const body = await req.json();
    const { name, screen, theaterId } = body;

    // Create Block
    const newBlock = await Block.create({ name, screen, theaterId });

    // Push to Theater
    await Theater.findByIdAndUpdate(theaterId, {
      $push: { blocks: newBlock._id },
    });

    return NextResponse.json({
      success: true,
      message: "✅ Block added successfully",
      data: newBlock,
    });
  } catch (error) {
    console.error("❌ Error adding block:", error);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to add block",
    });
  }
}
