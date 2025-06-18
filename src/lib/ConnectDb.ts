import mongoose from "mongoose";

const ConnectDb = async () => {
  const mongoUrl = process.env.MONGODB_URL;

  if (!mongoUrl) {
    throw new Error("MONGODB_URL is not defined in environment variables");
  }

  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB is connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

export default ConnectDb;
