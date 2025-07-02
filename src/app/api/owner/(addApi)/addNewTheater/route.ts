import ConnectDb from "@/lib/ConnectDb";
import TheaterOwner from "@/models/theaterOwnerModel";
import Theater from "@/models/threaterModel";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await ConnectDb();

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // ✅ Get user and check role
  const user = await User.findById(userId);
  if (!user || user.role !== "owner") {
    return NextResponse.json(
      { message: "Only owners are allowed to add theaters" },
      { status: 403 }
    );
  }

  try {
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

    if (!image || !image.startsWith("http")) {
      return NextResponse.json({
        success: false,
        message: "Invalid image URL",
      });
    }

    // ✅ Create theater
    const newTheater = await Theater.create({
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
      theaterOwner: user._id,
    });

    // ✅ Find TheaterOwner and push new theater's ID
    const theaterOwner = await TheaterOwner.findOne({ userId });

    if (theaterOwner) {
      theaterOwner.theaters.push(newTheater._id);
      await theaterOwner.save();
    } else {
      console.warn("⚠️ No TheaterOwner found for this user.");
    }

    return NextResponse.json({
      success: true,
      message: "🎉 Theater created successfully!",
      data: newTheater,
    });
  } catch (error) {
    console.error("🚨 Error creating theater:", error);
    return NextResponse.json({
      success: false,
      message: "❌ Failed to create theater",
    });
  }
}
