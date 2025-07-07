import ConnectDb from "@/lib/ConnectDb";
import Block from "@/models/blockModel";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await ConnectDb();
  try {
    const { searchParams } = new URL(req.url);
    const blockId = searchParams.get("blockId");

    if (!blockId) {
      return NextResponse.json({ success: false, message: "blockId required" });
    }

    const block = await Block.findById(blockId);
    if (!block) {
      return NextResponse.json({ success: false, message: "Block not found" });
    }
    return NextResponse.json({ success: true, block });
  } catch (err) {
    console.error("Error fetching block:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
