import mongoose from "mongoose"

const plotSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true, index: true },
    price: { type: Number, required: true, index: true },
    sizeSqft: { type: Number, required: true, index: true },
    facing: {
      type: String,
      enum: ["East", "West", "North", "South", "Northeast", "Northwest", "Southeast", "Southwest"],
      default: undefined,
    },
    approvalType: { type: String, enum: ["DTCP", "Panchayat", "CMDA", "Other"], default: undefined },
    isCornerPlot: { type: Boolean, default: false },
    description: { type: String },
    images: [{ type: String }],
    mapEmbedUrl: { type: String },
    featured: { type: Boolean, default: false },
    listedDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export const Plot = mongoose.model("Plot", plotSchema)
