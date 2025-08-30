import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models/User.js"
import { auth, loadUser } from "../middleware/auth.js"

export const authRouter = Router()

authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: "Email and password required" })
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: "Email already in use" })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash, isAdmin: false })
    return res.json({ data: { id: user._id } })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
})

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {}
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: "Invalid credentials" })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: "Invalid credentials" })
    const token = jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRES_IN || "7d",
    })
    return res.json({ token })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
})

authRouter.get("/me", auth, loadUser, async (req, res) => {
  const u = req.dbUser
  return res.json({ _id: u._id, name: u.name, email: u.email, favorites: u.favorites || [] })
})
