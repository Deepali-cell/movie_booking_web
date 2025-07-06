import mongoose from "mongoose";

const groupPlanSchema = new mongoose.Schema(
  {
    creator: { type: String, ref: "User", required: true },
    inviteLink: { type: String, required: true, unique: true },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: "Theater" },
    invitedUsers: [{ type: String, ref: "User" }],

    // ✅ New: user selections for theaters & shows
    userSelections: [
      {
        user: { type: String, ref: "User" },
        theaters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Theater" }],
        shows: [{ type: mongoose.Schema.Types.ObjectId, ref: "Show" }],
        completed: { type: Boolean, default: false },
        voted: { type: Boolean, default: false },
      },
    ],

    // ✅ Existing votes + final movie
    votes: [
      {
        user: { type: String, ref: "User" },
        movie: { type: mongoose.Schema.Types.ObjectId, ref: "Show" },
      },
    ],
    finalMovie: { type: mongoose.Schema.Types.ObjectId, ref: "Show" },

    // ✅ Voting state
    votingStarted: { type: Boolean, default: false },
    votingEndsAt: Date,

    dateOfShow: Date,
    groupBooking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    paymentStatus: {
      type: String,
      enum: ["pending", "split", "singlePaid", "completed"],
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

const groupPlane =
  mongoose.models.GroupPlan || mongoose.model("GroupPlan", groupPlanSchema);
export default groupPlane;
