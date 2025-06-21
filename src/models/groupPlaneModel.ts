import mongoose from "mongoose";

export const groupPlanSchema = new mongoose.Schema(
  {
    creator: { type: String, ref: "NewUsers", required: true },
    inviteLink: { type: String, required: true, unique: true }, // e.g. UUID
    theater: { type: mongoose.Schema.Types.ObjectId, ref: "Theater" },
    invitedUsers: [{ type: String, ref: "NewUsers" }],
    selectedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Show" }],
    votes: [
      {
        user: { type: String, ref: "User" },
        movie: { type: mongoose.Schema.Types.ObjectId, ref: "Show" },
      },
    ],
    finalMovie: { type: mongoose.Schema.Types.ObjectId, ref: "Show" }, // chosen after voting
    dateOfShow: Date,
    groupBooking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    paymentStatus: {
      type: String,
      enum: ["pending", "split", "singlePaid"],
      default: "pending",
    },
    splitDetails: [
      {
        user: { type: String, ref: "User" },
        amount: Number,
        paid: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);
