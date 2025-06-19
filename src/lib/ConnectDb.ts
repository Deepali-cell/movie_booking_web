import mongoose from "mongoose";

const ConnectDb = async () => {
  const mongoUrl = process.env.MONGODB_URL;

  if (!mongoUrl) {
    throw new Error("MONGODB_URL is not defined in environment variables");
  }

  if (mongoose.connection.readyState >= 1) {
    // 1 = connected, 2 = connecting
    return;
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
};

export default ConnectDb;
