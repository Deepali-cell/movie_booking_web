import mongoose from "mongoose";

export const showSchema = new mongoose.Schema(
  {
    blockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    showDate: {
      type: String, // Example: "2025-09-19"
      required: true,
    },
    showTime: {
      type: String, // Example: "15:00" (24-hour format)
      required: true,
    },
    showPrice: {
      type: Number,
      required: true,
    },
    occupiedSeats: {
      type: Map,
      of: Boolean, // e.g., { A1: true, B2: true }
      default: {},
    },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },

    showReview: [{ userName: String, comment: String, rating: Number }],
  },
  { minimize: false, timestamps: true }
);

const Show = mongoose.models.Show || mongoose.model("Show", showSchema);

export default Show;
