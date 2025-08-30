# Plots Backend (Express + MongoDB)

Production-ready Node backend for the plots-only real estate site.

## Endpoints (selected)

Public:
- GET /plots?location=&minPrice=&maxPrice=&minSize=&maxSize=&facing=&approvalType=&featured=true&limit=&page=
- GET /plots/:id
- GET /blog?limit=&page=
- GET /blog/:slug

Auth:
- POST /auth/register { name, email, password }
- POST /auth/login { email, password } -> { token }
- GET /auth/me (Bearer token) -> user

Admin (Bearer token, admin only):
- GET /admin/plots, GET /admin/plots/:id, POST /admin/plots, PUT /admin/plots/:id, DELETE /admin/plots/:id
- GET /admin/blog, GET /admin/blog/:id, POST /admin/blog, PUT /admin/blog/:id, DELETE /admin/blog/:id
- POST /admin/upload (form-data, files[]) -> { files: [url] }

## Quick start
1. Copy .env.example to .env and fill values (MONGODB_URI, JWT_SECRET, ALLOWED_ORIGIN, optional mail + admin seed).
2. Deploy on Railway/Render/Heroku. Expose PORT (default 4000).
3. Point the frontend env:
   - NEXT_PUBLIC_BACKEND_URL = https://your-deployed-backend
   - BACKEND_URL = https://your-deployed-backend (server-side fetches)
4. Optional: set ADMIN_EMAIL/ADMIN_PASSWORD to seed an initial admin.

Security notes:
- Use long random JWT_SECRET.
- Prefer httpOnly cookies if you later move auth to cookies; current frontend uses localStorage tokens.
- Restrict CORS to your frontend origin in production.
