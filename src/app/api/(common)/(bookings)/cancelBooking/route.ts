import ConnectDb from "@/lib/ConnectDb";
import Booking from "@/models/bookingModel";
import Show from "@/models/showModel";
import FoodOrder from "@/models/foodOrderModel";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: "Booking ID required" },
        { status: 400 }
      );
    }

    // 🔥 1. Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    // 🔥 2. Check if already cancelled
    if (booking.paymentStatus === "cancelled") {
      return NextResponse.json({
        success: false,
        message: "Booking already cancelled.",
      });
    }

    // 🔥 3. Release seats
    if (booking.movie && booking.seats.length > 0) {
      const show = await Show.findById(booking.movie);
      if (show) {
        booking.seats.forEach((seat: any) => {
          show.occupiedSeats.delete(seat);
        });
        show.markModified("occupiedSeats");
        await show.save();
      }
    }

    // 🔥 4. Cancel food order if exists
    if (booking.foodOrder) {
      await FoodOrder.findByIdAndDelete(booking.foodOrder);
      booking.foodOrder = null;
    }

    // 🔥 5. Mark booking as cancelled
    booking.paymentStatus = "cancelled";
    await booking.save();

    return NextResponse.json({
      success: true,
      message: "Booking cancelled. Seats released & food order removed.",
    });
  } catch (err) {
    console.error("❌ Cancel Booking Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
