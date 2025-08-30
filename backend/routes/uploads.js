import { Router } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { auth, loadUser, adminOnly } from "../middleware/auth.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadsDir = path.join(__dirname, "..", "uploads")
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, name)
  },
})
const upload = multer({ storage })

export const uploadsRouter = Router()

uploadsRouter.post("/upload", auth, loadUser, adminOnly, upload.array("files", 10), (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`
  const files = (req.files || []).map((f) => `${baseUrl}/uploads/${f.filename}`)
  res.json({ files })
})
