// models/TheaterOwner.ts
import mongoose from "mongoose";

const theaterOwnerSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: "NewUsers", required: true },

    theaters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theater",
      },
    ],

    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const TheaterOwner =
  mongoose.models.TheaterOwner ||
  mongoose.model("TheaterOwner", theaterOwnerSchema);

export default TheaterOwner;
