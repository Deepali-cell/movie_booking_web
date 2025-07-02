import { NextRequest, NextResponse } from "next/server";
import Theater from "@/models/threaterModel";
import ConnectDb from "@/lib/ConnectDb";

export async function GET(req: NextRequest) {
  await ConnectDb();

  try {
    const { searchParams } = new URL(req.url);

    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const refundable = searchParams.get("refundable");
    const screen = searchParams.get("screen");
    const language = searchParams.get("language");
    const genre = searchParams.get("genre");
    const foodCourt = searchParams.get("foodCourt");
    const tier = searchParams.get("tier");

    // ✅ Tell TS this will have string keys with any values
    const filter: Record<string, any> = {};

    if (city)
      filter["location.city"] = { $regex: new RegExp(`^${city}$`, "i") };
    if (state)
      filter["location.state"] = { $regex: new RegExp(`^${state}$`, "i") };
    if (refundable === "true") filter["cancellationPolicy.refundable"] = true;
    if (screen) filter["screens"] = { $elemMatch: { type: screen } };
    if (language) filter["supportedLanguages"] = language;
    if (genre) filter["supportedGenres"] = genre;
    if (foodCourt === "true") filter["foodCourts.0"] = { $exists: true };
    if (tier) filter["tier"] = tier;

    const theaters = await Theater.find(filter).lean();

    return NextResponse.json({
      success: true,
      count: theaters.length,
      theaters,
    });
  } catch (error) {
    console.error("❌ Error filtering theaters:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
