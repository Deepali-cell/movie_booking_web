import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    screen: {
      type: String,
      required: true,
      default: "Normal",
    },
    theaterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Show" }],
  },
  { timestamps: true }
);

const Block = mongoose.models.Block || mongoose.model("Block", blockSchema);

export default Block;
