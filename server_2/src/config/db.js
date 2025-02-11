import mongoose from "mongoose";

const connectDB = async (mongoUrl) => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
