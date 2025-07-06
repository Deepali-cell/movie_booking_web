import ConnectDb from "@/lib/ConnectDb";
import Theater from "@/models/threaterModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await ConnectDb();

  try {
    const { searchParams } = new URL(req.url);
    const theatersParam = searchParams.get("theaters");

    if (!theatersParam) {
      return NextResponse.json(
        { error: "No theaters provided" },
        { status: 400 }
      );
    }

    const theaterIds = theatersParam.split(",");

    type LeanTheaterType = {
      _id: string;
      name: string;
      tier: string;
      location: {
        addressLine?: string;
        city?: string;
        state?: string;
        country?: string;
        pincode?: string;
        landmarks?: string[];
      };
      moviesPlaying: any[];
    };

    const theaters = await Promise.all(
      theaterIds.map(async (tid) => {
        const theater = await Theater.findById(tid)
          .populate({
            path: "moviesPlaying",
            populate: { path: "movie" },
          })
          .lean<LeanTheaterType>(); // 👈 fix type

        if (!theater) return null;

        return {
          _id: theater._id,
          name: theater.name,
          tier: theater.tier,
          location: theater.location,
          shows: theater.moviesPlaying,
        };
      })
    );

    const result = theaters.filter((t) => t !== null);

    return NextResponse.json({ theaters: result }, { status: 200 });
  } catch (error) {
    console.error("🚨 Error fetching theaters:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch theaters",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
