import ConnectDb from "@/lib/ConnectDb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Show from "@/models/showModel";
import Booking from "@/models/bookingModel";
import groupPlane from "@/models/groupPlaneModel";

export async function POST(req: NextRequest) {
  await ConnectDb();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const showId = searchParams.get("showId");
    const { selectedSeats, paymentMethod, inviteLink } = await req.json();

    if (!selectedSeats || selectedSeats.length === 0) {
      return NextResponse.json(
        { success: false, message: "No seats selected" },
        { status: 400 }
      );
    }

    // ✅ Find group if inviteLink provided
    let group = null;
    if (inviteLink) {
      group = await groupPlane.findOne({ inviteLink });
      console.log("🚀 Group Plan found:", group);
    }

    // ✅ Get show details
    const show = await Show.findById(showId).populate("blockId");
    if (!show) {
      return NextResponse.json(
        { success: false, message: "Show not found" },
        { status: 404 }
      );
    }

    const theaterId = show.blockId.theaterId;

    // ✅ Check occupied seats
    const alreadyOccupied = selectedSeats.some(
      (seat: any) => show.occupiedSeats.get(seat) === true
    );
    if (alreadyOccupied) {
      return NextResponse.json(
        { success: false, message: "One or more seats already occupied" },
        { status: 409 }
      );
    }

    // ✅ Mark seats as occupied
    selectedSeats.forEach((seat: any) => show.occupiedSeats.set(seat, true));
    await show.save();

    const totalPrice = selectedSeats.length * show.showPrice;

    // ✅ Create booking with groupPlan if any
    const booking = await Booking.create({
      user: userId,
      theater: theaterId,
      movie: showId,
      seats: selectedSeats,
      totalPrice,
      paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
      groupPlan: group ? group._id : undefined,
    });

    // ✅ Handle group payment modes
    if (group) {
      if (group.paymentStatus === "singlePaid") {
        // ek hi banda poora pay karega
        group.groupBooking = booking._id;
        group.paymentStatus = "completed";
        await group.save();
      } else if (group.paymentStatus === "split") {
        // split karna sab ke beech
        const allUsers = [group.creator, ...group.invitedUsers];
        const perPerson = totalPrice / allUsers.length;

        // Update splitDetails for first booking
        group.splitDetails = allUsers.map((u) => ({
          user: u,
          amount: perPerson,
          paid: u === userId && paymentMethod === "online", // ✅ only mark paid if mode is online
        }));
        group.groupBooking = booking._id;
        await group.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: `🎟️ Booking successful via ${paymentMethod}`,
      booking,
      isGroupBooking: !!group,
      paymentMode: group?.paymentStatus,
      splitDetails: group?.splitDetails || [],
    });
  } catch (error: any) {
    console.error("🚨 Booking error:", error?.message);
    return NextResponse.json({
      success: false,
      message: "Booking failed",
      error: error?.message,
    });
  }
}
