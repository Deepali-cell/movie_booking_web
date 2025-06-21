import mongoose from "mongoose";

export const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["snack", "beverage", "meal"], required: true },
  price: { type: Number, required: true },
  isVegetarian: { type: Boolean, default: true },
  isVegan: { type: Boolean, default: false },
});
