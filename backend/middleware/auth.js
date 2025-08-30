import jwt from "jsonwebtoken"
import { User } from "../models/User.js"

export function auth(req, res, next) {
  const header = req.headers.authorization || ""
  const token = header.startsWith("Bearer ") ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: "No token" })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" })
  }
}

export async function loadUser(req, res, next) {
  if (!req.user?.id) return res.status(401).json({ error: "Invalid token" })
  const user = await User.findById(req.user.id).lean()
  if (!user) return res.status(401).json({ error: "User not found" })
  req.dbUser = user
  next()
}

export function adminOnly(req, res, next) {
  if (!req.dbUser?.isAdmin) return res.status(403).json({ error: "Admin only" })
  next()
}
