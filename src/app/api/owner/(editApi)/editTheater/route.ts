import ConnectDb from "@/lib/ConnectDb";
import Theater from "@/models/threaterModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  await ConnectDb();

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user || user.role !== "owner") {
    return NextResponse.json(
      { message: "Only owners are allowed to edit theaters" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);

    const theaterId = searchParams.get("theaterId");
    const body = await req.json();

    const {
      name,
      description,
      image,
      location,
      contact,
      basicServices,
      screens,
      supportedGenres,
      supportedLanguages,
      facilities,
      operatingHours,
      offDays,
      cancellationPolicy,
      tier,
    } = body;

    const updatedTheater = await Theater.findByIdAndUpdate(
      theaterId,
      {
        name,
        description,
        image,
        location,
        contact,
        basicServices,
        screens,
        supportedGenres,
        supportedLanguages,
        facilities,
        operatingHours,
        offDays,
        cancellationPolicy,
        tier,
      },
      { new: true }
    );

    if (!updatedTheater) {
      return NextResponse.json(
        { success: false, message: "❌ Theater not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "✅ Theater updated successfully!",
      theater: updatedTheater,
    });
  } catch (error: any) {
    console.error("🚨 Error editing theater:", error);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to update theater",
      error: error.message,
    });
  }
}
