import { Router } from "express"
import { auth, loadUser } from "../middleware/auth.js"
import { User } from "../models/User.js"
import { Plot } from "../models/Plot.js"

export const favoritesRouter = Router()

// GET /favorites - list current user's favorites
favoritesRouter.get("/", auth, loadUser, async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId).populate("favorites")
    return res.json({ favorites: user?.favorites || [] })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
})

// POST /favorites/:plotId - toggle favorite
favoritesRouter.post("/:plotId", auth, loadUser, async (req, res) => {
  try {
    const userId = req.user.id
    const { plotId } = req.params
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: "User not found" })

    const idx = user.favorites.findIndex((id) => id.toString() === plotId)
    if (idx >= 0) {
      user.favorites.splice(idx, 1)
      await user.save()
      return res.json({ favorited: false })
    } else {
      const plot = await Plot.findById(plotId).lean()
      if (!plot) return res.status(404).json({ error: "Plot not found" })
      user.favorites.push(plotId)
      await user.save()
      return res.json({ favorited: true })
    }
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
})
