import ConnectDb from "@/lib/ConnectDb";
import Booking from "@/models/bookingModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
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

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    // ensure only completed or cancelled bookings are deleted
    if (
      booking.paymentStatus !== "cancelled" &&
      booking.movie?.status !== "completed"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Only completed or cancelled bookings can be deleted.",
        },
        { status: 400 }
      );
    }

    await booking.deleteOne();

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (err) {
    console.error("❌ Delete Booking Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
