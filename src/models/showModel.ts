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
      of: Boolean,
      default: {},
    },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },
    showReview: {
      type: [
        {
          userId: String,
          userName: String,
          comment: String,
          rating: Number,
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { minimize: false, timestamps: true }
);

const Show = mongoose.models.Show || mongoose.model("Show", showSchema);
export default Show;
