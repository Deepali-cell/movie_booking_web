import { facilitySchema } from "@/schemas/facilitySchema";
import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema(
  {
    // owner
    theaterOwner: { type: mongoose.Schema.Types.ObjectId, ref: "TheaterOwner" },
    // 🏢 Basic Info
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },

    // 📍 Location
    location: {
      addressLine: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
      landmarks: [String], // ["Near Metro", "Opposite Mall"]
    },

    // ☎️ Contact
    contact: {
      phone: String,
      email: String,
      website: String,
    },

    // basic  services
    basicServices: {
      type: [String],
      required: true,
    },

    // 🛋️ Screens
    screens: [
      {
        name: { type: String, required: true }, // "Screen 1"
        capacity: { type: Number, required: true },
        type: {
          type: String,
          enum: ["Normal", "3D", "IMAX"],
          default: "Normal",
        },
      },
    ],
    // 🧱 Blocks inside Theater
    blocks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Block" }],

    // 🎬 all Movies Currently Playing in theater
    moviesPlaying: [{ type: mongoose.Schema.Types.ObjectId, ref: "Show" }],

    // 🎭 Supported Genres & Languages
    supportedGenres: [String],
    supportedLanguages: {
      type: [String],
      default: ["Hindi", "English"],
    },

    // 🧩 Facilities (Structured with location & category info)
    facilities: [facilitySchema],

    // 🍟 Food & Service
    foodCourts: [{ type: mongoose.Schema.Types.ObjectId, ref: "CourtModel" }],

    // ⏰ Hours & Off Days
    operatingHours: {
      open: { type: String, default: "09:00 AM" },
      close: { type: String, default: "11:00 PM" },
    },
    offDays: {
      type: [String], // ["Monday", "Thursday"]
      default: [],
    },

    // ⭐ Reviews & Ratings
    ratings: {
      cleaningRating: { type: Number, default: 4.5 },
      totalRatings: { type: Number, default: 0 },
    },
    reviews: [
      {
        userName: String,
        comment: String,
        rating: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // 🔒 Admin Controls
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    tier: {
      type: String,
      enum: ["normal", "premium", "luxury", "budget"],
      default: "normal",
    },

    // 🛡️ Safety Measures & Refund Policy
    cancellationPolicy: {
      refundable: { type: Boolean, default: false },
      refundWindowInHours: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Theater =
  mongoose.models.Theater || mongoose.model("Theater", theaterSchema);

export default Theater;
