// pages/api/set-role.ts
import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "@/lib/ConnectDb";
import User from "@/models/userModel";
import { auth } from "@clerk/nextjs/server";
import TheaterOwner from "@/models/theaterOwnerModel";
import Admin from "@/models/adminModel";

export async function POST(req: NextRequest) {
  try {
    const { role, secretCode } = await req.json();
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await ConnectDb();

    const ownerCodes = process.env.OWNER_CODES?.split(",") || [];
    const adminCodes = process.env.ADMIN_CODES?.split(",") || [];

    let allowed = false;

    if (role === "owner" && ownerCodes.includes(secretCode)) {
      allowed = true;
    } else if (role === "admin" && adminCodes.includes(secretCode)) {
      allowed = true;
    } else if (role === "user") {
      allowed = true;
    }

    if (!allowed) {
      return NextResponse.json(
        { message: "Invalid role or secret code" },
        { status: 403 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    // 🔥 Create related model if owner or admin
    if (role === "owner") {
      await TheaterOwner.create({
        userId: userId,
        theaters: [],
        isVerified: false,
        isActive: true,
      });
    }

    if (role === "admin") {
      await Admin.create({
        userId: userId,
        permissions: {
          manageUsers: true,
          manageTheaters: true,
          manageBookings: true,
          viewReports: true,
        },
        superAdmin: false,
      });
    }

    return NextResponse.json({
      success : true,
      message: "Role updated",
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("Role update error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
