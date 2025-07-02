import ConnectDb from "@/lib/ConnectDb";
import FoodOrder from "@/models/foodOrderModel";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  await ConnectDb();
  const body = await req.json();
  const { orderId, status, foodCourtId } = body;

  if (!orderId || !status || !foodCourtId) {
    return NextResponse.json(
      { success: false, message: "Missing data" },
      { status: 400 }
    );
  }

  try {
    await FoodOrder.findByIdAndUpdate(orderId, { status });

    // Fetch updated list for this foodcourt
    const orders = await FoodOrder.find({ foodCourtId }).populate(
      "theaterId foodCourtId"
    );

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("🚨 Update status error:", error);
    return NextResponse.json(
      { success: false, message: "Update failed", error: error.message },
      { status: 500 }
    );
  }
}
