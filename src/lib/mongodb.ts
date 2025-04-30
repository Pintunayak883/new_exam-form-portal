import mongoose from "mongoose";

let isConnected = false;

export async function connectToDatabase() {
  // Agar pehle se hi connected hai, toh nikal lo
  if (isConnected) return;

  // Hum environment variable ko pehle check karenge
  const mongoURI = process.env.MONGODB_URI;

  // Agar woh undefined nikla, toh error maar do properly
  if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    // Ab TypeScript bhi khush aur mongoose bhi khush
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
