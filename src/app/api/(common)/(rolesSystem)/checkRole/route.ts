import ConnectDb from "@/lib/ConnectDb";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await ConnectDb();
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ role: user.role || null });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
