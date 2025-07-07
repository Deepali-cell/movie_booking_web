import ConnectDb from "@/lib/ConnectDb";
import Block from "@/models/blockModel";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  await ConnectDb();
  try {
    const { searchParams } = new URL(req.url);
    const blockId = searchParams.get("blockId");

    
    const { name, screen } = await req.json();
    const updated = await Block.findByIdAndUpdate(
      blockId,
      { name, screen },
      { new: true }
    );
    if (!updated)
      return NextResponse.json({ success: false, message: "Block not found" });
    return NextResponse.json({ success: true, block: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Internal error" });
  }
}
