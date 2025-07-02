import ConnectDb from "@/lib/ConnectDb";
import Booking from "@/models/bookingModel";
import FoodOrder from "@/models/foodOrderModel";
import Show from "@/models/showModel";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  await ConnectDb();

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

    // 🔥 2. Update Show to remove these seats
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

    // 🔥 3. Delete associated food order
    if (booking.foodOrder) {
      await FoodOrder.findByIdAndDelete(booking.foodOrder);
    }

    // 🔥 4. Finally delete the booking itself
    await booking.deleteOne();

    return NextResponse.json({
      success: true,
      message: "Booking cancelled, seats released, food order deleted.",
    });
  } catch (err) {
    console.error("❌ Cancel Booking Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
