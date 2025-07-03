import ConnectDb from "@/lib/ConnectDb";
import foodCourtModel from "@/models/foodCourtModel";
import Theater from "@/models/threaterModel";
import Movie from "@/models/movieModel";
import Show from "@/models/showModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  await ConnectDb();

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  const { comment, rating } = await req.json();

  if (!type || !id) {
    return NextResponse.json(
      { success: false, message: "Missing type or id" },
      { status: 400 }
    );
  }

  try {
    let doc;
    switch (type) {
      case "theater":
        doc = await Theater.findById(id);
        if (!doc) throw new Error("Theater not found");
        doc.reviews.push({
          userId: user._id,
          userName: user.name,
          comment,
          rating,
          createdAt: new Date(),
        });
        break;

      case "movie":
        doc = await Movie.findById(id);
        if (!doc) throw new Error("Movie not found");
        doc.movieReview.push({
          userId: user._id,
          userName: user.name,
          comment,
          rating,
          createdAt: new Date(),
        });
        break;

      case "show":
        doc = await Show.findById(id);
        if (!doc) throw new Error("Show not found");
        doc.showReview.push({
          userId: user._id,
          userName: user.name,
          comment,
          rating,
          createdAt: new Date(),
        });
        break;

      case "foodcourt":
        doc = await foodCourtModel.findById(id);
        if (!doc) throw new Error("FoodCourt not found");
        doc.foodService.orderReviews.push({
          userId: user._id,
          userName: user.name,
          comment,
          rating,
          createdAt: new Date(),
        });
        break;

      default:
        return NextResponse.json(
          { success: false, message: "Invalid type" },
          { status: 400 }
        );
    }

    await doc.save();

    return NextResponse.json(
      { success: true, message: "Review added", data: doc },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
