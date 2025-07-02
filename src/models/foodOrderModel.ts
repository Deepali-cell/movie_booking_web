import mongoose from "mongoose";

const foodOrderSchema = new mongoose.Schema(
  {
    userDetail: {
      name: String,
      seat: String, // Optional for pre-order
      block: String,
      action: String,
    },
    theaterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    foodCourtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodCourt",
    },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
        allergyNote: { type: String, default: "" }, // ✅ NEW
      },
    ],
    totalAmount: Number,
    paymentType: { type: String, enum: ["cash", "online"], default: "cash" }, // ✅ OPTIONAL
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const FoodOrder =
  mongoose.models.FoodOrder || mongoose.model("FoodOrder", foodOrderSchema);
export default FoodOrder;
