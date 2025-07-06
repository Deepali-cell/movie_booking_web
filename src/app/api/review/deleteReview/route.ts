import ConnectDb from "@/lib/ConnectDb";
import foodCourtModel from "@/models/foodCourtModel";
import Theater from "@/models/threaterModel";
import Movie from "@/models/movieModel";
import Show from "@/models/showModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(req: NextRequest) {
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
  const { createdAt } = await req.json(); // you need to pass createdAt from frontend

  if (!type || !id || !createdAt) {
    return NextResponse.json(
      { success: false, message: "Missing type, id, or createdAt" },
      { status: 400 }
    );
  }

  try {
    let updateResult;
    switch (type) {
      case "theater":
        updateResult = await Theater.updateOne(
          { _id: id },
          { $pull: { reviews: { userId: user._id, createdAt } } }
        );
        break;

      case "movie":
        updateResult = await Movie.updateOne(
          { _id: id },
          { $pull: { movieReview: { userId: user._id, createdAt } } }
        );
        break;

      case "show":
        updateResult = await Show.updateOne(
          { _id: id },
          { $pull: { showReview: { userId: user._id, createdAt } } }
        );
        break;

      case "foodcourt":
        updateResult = await foodCourtModel.updateOne(
          { _id: id },
          {
            $pull: {
              "foodService.orderReviews": { userId: user._id, createdAt },
            },
          }
        );
        break;

      default:
        return NextResponse.json(
          { success: false, message: "Invalid type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
      result: updateResult,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
