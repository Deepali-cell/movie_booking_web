import { foodItemSchema } from "@/schemas/foodItemSchema";
import mongoose from "mongoose";

const foodCourtSchema = new mongoose.Schema(
  {
    theater: { type: mongoose.Schema.Types.ObjectId, ref: "Theater" },
    name: { type: String, required: true },
    location: {
      block: { type: String },
      floor: { type: String },
    },
    foodMenu: [foodItemSchema],
    foodService: {
      deliveryType: {
        type: String,
        enum: ["in-seat", "self-service"],
        default: "self-service",
      },
      allowsAllergyNote: { type: Boolean, default: true },
      orderReviews: {
        type: [
          {
            userName: String,
            comment: String,
            rating: Number,
            createdAt: { type: Date, default: Date.now },
          },
        ],
        default: [],
      },
    },
  },
  { timestamps: true }
);
const foodCourtModel =
  mongoose.models.FoodCourt || mongoose.model("FoodCourt", foodCourtSchema);
export default foodCourtModel;
