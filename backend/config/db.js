import mongoose from "mongoose"

export async function connectDB(uri) {
  if (!uri) throw new Error("MONGODB_URI is not set")
  await mongoose.connect(uri, {})
  mongoose.connection.on("connected", () => console.log("[backend] Mongo connected"))
  mongoose.connection.on("error", (e) => console.error("[backend] Mongo error:", e.message))
}
