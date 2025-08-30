import { Router } from "express"
import { Plot } from "../models/Plot.js"

export const plotsRouter = Router()

// Public list with filters
plotsRouter.get("/", async (req, res) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      facing,
      approvalType,
      featured,
      limit = 24,
      page = 1,
    } = req.query

    const q = {}
    if (location) q.location = { $regex: String(location), $options: "i" }
    if (facing) q.facing = String(facing)
    if (approvalType) q.approvalType = String(approvalType)
    if (featured === "true") q.featured = true
    if (minPrice || maxPrice) {
      q.price = {}
      if (minPrice) q.price.$gte = Number(minPrice)
      if (maxPrice) q.price.$lte = Number(maxPrice)
    }
    if (minSize || maxSize) {
      q.sizeSqft = {}
      if (minSize) q.sizeSqft.$gte = Number(minSize)
      if (maxSize) q.sizeSqft.$lte = Number(maxSize)
    }

    const lim = Math.min(Number(limit) || 24, 100)
    const skip = (Number(page) - 1) * lim
    const [data, total] = await Promise.all([
      Plot.find(q).sort({ listedDate: -1 }).skip(skip).limit(lim).lean(),
      Plot.countDocuments(q),
    ])

    return res.json({ data, total })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
})

// Public detail
plotsRouter.get("/:id", async (req, res) => {
  try {
    const plot = await Plot.findById(req.params.id).lean()
    if (!plot) return res.status(404).json({ error: "Not found" })
    return res.json({ data: plot })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
})
