import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "@/lib/ConnectDb";
import FoodOrder from "@/models/foodOrderModel";
import Booking from "@/models/bookingModel";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  await ConnectDb();

  try {
    const body = await req.json();
    const {
      userDetail, // { name, seat, block, action }
      theaterId,
      foodCourtId,
      items,
      totalAmount,
      paymentType,
    } = body;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find latest booking for this user & theater
    const booking = await Booking.findOne({
      user: userId,
      theater: theaterId,
    }).sort({ createdAt: -1 });

    let foodOrder;

    if (booking?.foodOrder) {
      // ✅ Update existing food order
      foodOrder = await FoodOrder.findByIdAndUpdate(
        booking.foodOrder,
        {
          userDetail,
          items,
          totalAmount,
          paymentType,
        },
        { new: true }
      );
    } else {
      // ✅ Create new food order
      foodOrder = await FoodOrder.create({
        userDetail,
        theaterId,
        foodCourtId,
        items,
        totalAmount,
        paymentType,
      });

      // ✅ Link foodOrder to booking (if booking exists)
      if (booking) {
        booking.foodOrder = foodOrder._id;
        await booking.save();
      }
    }

    return NextResponse.json({ success: true, foodOrder });
  } catch (error) {
    console.error("❌ Order Food API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
