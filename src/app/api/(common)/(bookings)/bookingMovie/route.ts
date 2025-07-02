import ConnectDb from "@/lib/ConnectDb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Show from "@/models/showModel";
import Booking from "@/models/bookingModel";

export async function POST(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const showId = searchParams.get("showId");

    const body = await req.json();
    const { selectedSeats, paymentMethod } = body;

    if (!selectedSeats || selectedSeats.length === 0) {
      return NextResponse.json(
        { success: false, message: "No seats selected" },
        { status: 400 }
      );
    }

    const show = await Show.findById(showId).populate("blockId");
    if (!show) {
      return NextResponse.json(
        { success: false, message: "Show not found" },
        { status: 404 }
      );
    }

    const theaterId = show.blockId.theaterId;
    const alreadyOccupied = selectedSeats.some(
      (seat: any) => show.occupiedSeats.get(seat) === true
    );

    if (alreadyOccupied) {
      return NextResponse.json(
        { success: false, message: "One or more seats already occupied" },
        { status: 409 }
      );
    }

    // Mark seats as occupied
    selectedSeats.forEach((seat: string) => show.occupiedSeats.set(seat, true));
    await show.save();

    const totalPrice = selectedSeats.length * show.showPrice;

    const booking = await Booking.create({
      user: userId,
      theater: theaterId,
      movie: showId,
      seats: selectedSeats,
      totalPrice,
      paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
    });

    return NextResponse.json({
      success: true,
      message: `🎟️ Booking successful via ${paymentMethod}`,
      booking,
      tempTicket: paymentMethod === "cash",
    });
  } catch (error: any) {
    console.error("🚨 Booking error:", error.message);
    return NextResponse.json({
      success: false,
      message: "Booking failed",
      error: error.message,
    });
  }
}
