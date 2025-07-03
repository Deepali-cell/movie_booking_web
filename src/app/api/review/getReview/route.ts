import ConnectDb from "@/lib/ConnectDb";
import foodCourtModel from "@/models/foodCourtModel";
import Theater from "@/models/threaterModel";
import Movie from "@/models/movieModel";
import Show from "@/models/showModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await ConnectDb();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json(
      { success: false, message: "Missing type or id" },
      { status: 400 }
    );
  }

  try {
    let doc;
    let reviews;

    switch (type) {
      case "theater":
        doc = await Theater.findById(id);
        reviews = doc?.reviews || [];
        break;
      case "movie":
        doc = await Movie.findById(id);
        reviews = doc?.movieReview || [];
        break;
      case "foodcourt":
        doc = await foodCourtModel.findById(id);
        reviews = doc?.foodService?.orderReviews || [];
        break;
      case "show":
        doc = await Show.findById(id);
        reviews = doc?.showReview || [];
        break;
      default:
        return NextResponse.json(
          { success: false, message: "Invalid type" },
          { status: 400 }
        );
    }

    if (!doc) {
      return NextResponse.json(
        { success: false, message: `${type} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
