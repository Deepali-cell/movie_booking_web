import { facilitySchema } from "@/schemas/facilitySchema";
import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema(
  {
    theaterOwner: { type: String, ref: "User" },
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
      landmarks: { type: [String], default: [] },
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
      default: [],
    },

    // 🛋️ Screens
    screens: {
      type: [
        {
          name: { type: String, required: true },
          capacity: { type: Number, required: true },
          type: {
            type: String,
            enum: ["Normal", "3D", "IMAX"],
            default: "Normal",
          },
        },
      ],
      default: [],
    },
    // block
    blocks: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Block" }],
      default: [],
    },

    // 🎬 all Movies Currently Playing in theater
    moviesPlaying: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Show" }],
      default: [],
    },
    allMovies: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
      default: [],
    },
    // 🎭 Supported Genres & Languages
    supportedGenres: {
      type: [String],
      default: [],
    },
    supportedLanguages: {
      type: [String],
      default: ["Hindi", "English"],
    },

    // 🧩 Facilities (Structured with location & category info)
    facilities: {
      type: [facilitySchema],
      default: [],
    },

    // 🍟 Food & Service
    foodCourts: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodCourt" }],
      default: [],
    },

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
      totalRatings: { type: Number, default: 4 },
    },
    reviews: {
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
