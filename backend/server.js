import "dotenv/config"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import { connectDB } from "./config/db.js"
import { authRouter } from "./routes/auth.js"
import { plotsRouter } from "./routes/plots.js"
import { blogRouter } from "./routes/blog.js"
import { adminRouter } from "./routes/admin.js"
import { uploadsRouter } from "./routes/uploads.js"
import { User } from "./models/User.js"
import bcrypt from "bcryptjs"
import { favoritesRouter } from "./routes/favorites.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json({ limit: "2mb" }))
app.use(morgan("dev"))

const allowed = process.env.ALLOWED_ORIGIN || "*"
app.use(
  cors({
    origin: allowed === "*" ? true : [allowed],
    credentials: false,
  }),
)

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
app.get("/", (_req, res) => res.json({ ok: true, name: "plots-backend" }))
app.use("/auth", authRouter)
app.use("/plots", plotsRouter)
app.use("/blog", blogRouter)
app.use("/admin", adminRouter)
app.use("/admin", uploadsRouter)
app.use("/favorites", favoritesRouter)

// Boot
const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI

async function ensureAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return
  const existing = await User.findOne({ email: ADMIN_EMAIL })
  if (existing) return
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10)
  await User.create({ email: ADMIN_EMAIL, passwordHash, isAdmin: true, name: "Admin" })
  console.log(`[backend] Seeded admin: ${ADMIN_EMAIL}`)
}

connectDB(MONGODB_URI)
  .then(ensureAdmin)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[backend] listening on http://localhost:${PORT}`)
    })
  })
  .catch((e) => {
    console.error("[backend] failed to start:", e)
    process.exit(1)
  })
