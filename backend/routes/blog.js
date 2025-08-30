import { Router } from "express"
import { BlogPost } from "../models/BlogPost.js"

export const blogRouter = Router()

// Public list
blogRouter.get("/", async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query
    const lim = Math.min(Number(limit) || 20, 100)
    const skip = (Number(page) - 1) * lim
    const [data, total] = await Promise.all([
      BlogPost.find({}).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(lim).lean(),
      BlogPost.countDocuments({}),
    ])
    return res.json({ data, total })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
})

blogRouter.get("/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug }).lean()
    if (!post) return res.status(404).json({ error: "Not found" })
    return res.json({ data: post })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
})
