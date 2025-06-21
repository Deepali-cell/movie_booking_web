import mongoose from "mongoose";

export const facilitySchema = new mongoose.Schema(
  {
    type: {
      type: [String],
      required: true,
      enum: [
        "wheelchair",
        "ramp",
        "restroom",
        "child-seat",
        "emergency-exit",
        "parking",
        "medical-support",
        "food-court",
        "washroom",
        "wifi",
        "subtitle-screen",
        "heated-hall",
        "ac-hall",
        "charging-point",
        "security",
      ],
    },
    forCategory: {
      type: [String],
      enum: ["all", "elders", "disabled", "kids", "sensitive", "female-only"],
      default: ["all"],
    },
    location: {
      block: { type: String },
      screen: { type: String },
      floor: { type: String },
      near: { type: String },
    },
    description: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);
