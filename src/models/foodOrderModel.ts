import mongoose from "mongoose";

export const foodOrderSchema = new mongoose.Schema(
  {
    userDetail: { name: String, seat: String, block: String },
    theaterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    foodCourtId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodCourt" },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: Number,
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
