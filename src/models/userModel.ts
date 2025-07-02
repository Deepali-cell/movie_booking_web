// models/User.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Clerk user ID
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "owner", "admin"],
    },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }], // <-- Add this
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
