import mongoose from "mongoose"

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String },
    content: { type: String },
    coverImage: { type: String },
    publishedAt: { type: Date },
  },
  { timestamps: true },
)

export const BlogPost = mongoose.model("BlogPost", blogSchema)
