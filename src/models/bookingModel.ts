import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: String, ref: "User", required: true }, 

    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },

    seats: [
      {
        type: String, // e.g. "A1", "B2"
        required: true,
      },
    ],

    totalPrice: { type: Number, required: true }, // ticket total
    foodOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodOrder",
      default: null, // 👈 means no food ordered initially
    },

    groupPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupPlan",
    }, // optional - only if part of group

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;
