import ConnectDb from "@/lib/ConnectDb";
import Block from "@/models/blockModel";
import Theater from "@/models/threaterModel";
import Show from "@/models/showModel";
import FoodCourt from "@/models/foodCourtModel";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  await ConnectDb();
  try {
    const { searchParams } = new URL(req.url);
    const blockId = searchParams.get("blockId");

    const block = await Block.findById(blockId);
    if (!block)
      return NextResponse.json({ success: false, message: "Block not found" });

    // 1. Cancel all shows in this block
    await Show.updateMany({ blockId }, { status: "cancelled" });

    // 2. Remove block reference from theater
    await Theater.updateOne(
      { _id: block.theaterId },
      { $pull: { blocks: blockId } }
    );

    // 3. Update foodCourts whose block matches this block name
    await FoodCourt.updateMany(
      { "location.block": block.name },
      { "location.block": "not-provided" }
    );

    // 4. Finally delete block
    await Block.findByIdAndDelete(blockId);

    return NextResponse.json({
      success: true,
      message: "Block deleted with cascading updates",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
