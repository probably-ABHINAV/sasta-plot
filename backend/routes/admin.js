import { Router } from "express"
import { Plot } from "../models/Plot.js"
import { BlogPost } from "../models/BlogPost.js"
import { auth, loadUser, adminOnly } from "../middleware/auth.js"

export const adminRouter = Router()

adminRouter.use(auth, loadUser, adminOnly)

// Plots CRUD
adminRouter.get("/plots", async (req, res) => {
  const data = await Plot.find({}).sort({ createdAt: -1 }).lean()
  res.json({ data })
})
adminRouter.get("/plots/:id", async (req, res) => {
  const data = await Plot.findById(req.params.id).lean()
  if (!data) return res.status(404).json({ error: "Not found" })
  res.json({ data })
})
adminRouter.post("/plots", async (req, res) => {
  const created = await Plot.create(req.body)
  res.json({ data: created })
})
adminRouter.put("/plots/:id", async (req, res) => {
  const updated = await Plot.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!updated) return res.status(404).json({ error: "Not found" })
  res.json({ data: updated })
})
adminRouter.delete("/plots/:id", async (req, res) => {
  await Plot.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

// Blog CRUD
adminRouter.get("/blog", async (_req, res) => {
  const data = await BlogPost.find({}).sort({ createdAt: -1 }).lean()
  res.json({ data })
})
adminRouter.get("/blog/:id", async (req, res) => {
  const data = await BlogPost.findById(req.params.id).lean()
  if (!data) return res.status(404).json({ error: "Not found" })
  res.json({ data })
})
adminRouter.post("/blog", async (req, res) => {
  const payload = { ...req.body }
  if (!payload.slug && payload.title) {
    payload.slug = payload.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
  const created = await BlogPost.create(payload)
  res.json({ data: created })
})
adminRouter.put("/blog/:id", async (req, res) => {
  const updated = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!updated) return res.status(404).json({ error: "Not found" })
  res.json({ data: updated })
})
adminRouter.delete("/blog/:id", async (req, res) => {
  await BlogPost.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})
