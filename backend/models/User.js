import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Plot" }],
  },
  { timestamps: true },
)

export const User = mongoose.model("User", userSchema)
