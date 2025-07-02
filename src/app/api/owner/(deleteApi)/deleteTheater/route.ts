import ConnectDb from "@/lib/ConnectDb";
import Theater from "@/models/threaterModel";
import Block from "@/models/blockModel";
import Show from "@/models/showModel";
import FoodCourt from "@/models/foodCourtModel";
import FoodOrder from "@/models/foodOrderModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import TheaterOwner from "@/models/theaterOwnerModel";

export async function DELETE(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user || user.role !== "owner") {
    return NextResponse.json(
      { message: "Only owners can delete theaters" },
      { status: 403 }
    );
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const theaterId = searchParams.get("theaterId");

    if (!theaterId) {
      return NextResponse.json(
        { success: false, message: "Missing theaterId" },
        { status: 400 }
      );
    }

    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return NextResponse.json(
        { success: false, message: "Theater not found" },
        { status: 404 }
      );
    }

    // 1. Delete all blocks
    await Block.deleteMany({ theaterId });

    // 2. Delete all shows associated with the theater
    const allShowIds = theater.moviesPlaying || [];
    await Show.deleteMany({ _id: { $in: allShowIds } });

    // 3. Delete all food courts and food orders
    const foodCourts = await FoodCourt.find({ theater: theaterId });
    const foodCourtIds = foodCourts.map((fc) => fc._id);

    await FoodCourt.deleteMany({ theater: theaterId });
    await FoodOrder.deleteMany({ theaterId });

    // 4. Remove theater from TheaterOwner's theaters array
    await TheaterOwner.updateMany(
      { theaters: theaterId },
      { $pull: { theaters: theaterId } }
    );

    // 5. Finally, delete the theater itself
    await Theater.findByIdAndDelete(theaterId);

    return NextResponse.json({
      success: true,
      message: "✅ Theater and all related data deleted successfully",
    });
  } catch (error: any) {
    console.error("❌ Error deleting theater:", error);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to delete theater",
      error: error.message,
    });
  }
}
