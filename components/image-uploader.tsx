Nice
— we’ll ship a lean, production-ready Sasta Plot to Vercel today
using Next
.js 15 + TypeScript + Tailwind (frontend) and Supabase (lightweight backend & storage). Below is a focused, step-by-step delivery plan + the exact code, DB schema, env variables, and deploy commands you need to finish and go live right now. I assume you want the minimal, highest-impact set of features
for a client-ready release (fast, secure, SEO-friendly).
\
I. Priority MVP to deliver today (what to finish now)

Authentication (Supabase Auth) — register / login / session handling.
\
Public plots listing
with filters (location, price, size, facing, approval type) + pagination.
\
Plot details page
with gallery (Supabase Storage) + inquiry form. Inquiry
sends
email
via
a
small
Vercel
serverless
API (uses SMTP env vars).
\
Admin CRUD
for plots + image uploads (only for admin users). Admin is a
profile
flag in Supabase.
\
Blog (public list + single post) and a simple admin blog CRUD UI.

SEO-critical pages as server components (home, listing, plot details).

Light responsive UI + accessible components (Radix / Tailwind).
\
Deploy frontend to Vercel
backend
uses
Supabase (no long-lived server required).
\
If time is extremely short, release Items 1–3 first
admin
CRUD
and
blog
can
be
patched
after
initial
release.
\
II. High-level architecture & decisions
\
Auth & DB: Supabase (Postgres + Auth + Storage). No Express server required
for core features. Use Supabase row-level
security(RLS) + a
profiles
table
for roles.\
\
File
storage: Supabase
Storage(images).Serve
images
via
NEXT_PUBLIC_SUPABASE_URL + signed
URLs
or
public
bucket.
\
\
Email (contact/inquiry): Small Vercel serverless
function (API route)
that
uses
SMTP(Nodemailer).This
avoids
adding
another
backend
and
fits
“lightweight”.

Deploy flow: Deploy Supabase project first (create tables + storage). Then set all env vars in Vercel and deploy the Next.js project.

III. Exact Supabase DB schema (SQL) — paste into Supabase SQL editor
Run these SQL statements in Supabase SQL editor to create tables, indexes, and seed admin:

-- Enable uuid extension
create extension
if not exists
\"pgcrypto"
\
-- profiles are tied to auth.users via uid
create table profiles (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid references auth.users(id) on delete cascade,
  name text,
  email text,
  role text default 'user', -- 'user' or 'admin'
  favorites jsonb default '[]'::jsonb,
  created_at timestamptz default now()
)

--plots
table
\
create table plots (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  price numeric,
  size numeric,
  location text,
  facing text,
  approval_type text,
  images jsonb default '[]'::jsonb,
  featured boolean default false,
  specifications jsonb default '{}'::jsonb,
  contact_info jsonb default '{}'::jsonb,
  created_at timestamptz default now()
)
\
create index on plots (lower(title))
\
create index on plots (location)
\
create index on plots (price)

--blog
\
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text,
  excerpt text,
  author text,
  published boolean default false,
  created_at timestamptz default now()
)
\
-- Optional seed: mark a profile as admin (adjust auth_id after creating a user)
-- Example: insert admin profile (replace AUTH_USER_ID from Supabase auth)
-- insert into profiles (auth_id, name, email, role) values ('<AUTH_USER_ID>','Admin','admin@sastaplot.com','admin')

\
RLS policies (minimal) — enable row security and add basic policies:
\
-- Enable RLS on profiles and plots (
if you want
strict
control
)\
alter table profiles enable row level security
create
policy
\"profiles_owner" on profiles\
for select using (auth.uid() = auth_id::text);
\
-- Allow
public
read
on
plots
\
alter table plots enable row level security
create
policy
\"public_read\" on plots for select using (true);

-- For blog_posts (public read)
alter table blog_posts enable row level security
create
policy
;("blog_public_read")
on
blog_posts
for select using (true);


(You will
only
need
more
complex
RLS
if you want
DB - side
admin
inserts / updates
directly
from
client
otherwise
use
serverless
endpoints
with supabase service
key.
)

IV. Required environment variables (Vercel & local)
Supabase (in Vercel environment vars):

NEXT_PUBLIC_SUPABASE_URL = https://xyz.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY = <anon-public-key>

SUPABASE_SERVICE_ROLE_KEY = <service-role-key> (only
for server-side usage, store as SECRET, never expose)

Email (Vercel secrets)
for contact API
:

SMTP_HOST

SMTP_PORT

SMTP_USER

SMTP_PASS

CONTACT_TO_EMAIL = client email to receive inquiries

General:

NEXT_PUBLIC_SITE_URL = https://your-vercel-domain.vercel.app

Local .env.local (
for dev)
:

NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000


V. Core files & code snippets (copy these into your project)

lib/supabaseClient.ts (shared client
for browser + server)
:

// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }, // Next.js session handled manually as needed
})

Auth
hooks(simple)
:

// hooks/useAuth.tsx
"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    const s = supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription?.unsubscribe()
  }, [])

  async function signUp(email: string, password: string) {
    return supabase.auth.signUp({ email, password })
  }
  async function signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password })
  }
  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return { user, signUp, signIn, signOut }
}

Fetch
plots (server component example)
:

// lib/plots.ts
import { supabase } from "./supabaseClient"

export async function getPlots({ limit = 12, page = 1, filters = {} } = {}) {
  const from = (page - 1) * limit
  let query = supabase
    .from("plots")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1)

  // apply filters: example
  if (filters.location) query = query.eq("location", filters.location)
  if (filters.facing) query = query.eq("facing", filters.facing)
  if (filters.approvalType) query = query.eq("approval_type", filters.approvalType)
  // For price range:
  if (filters.minPrice) query = query.gte("price", filters.minPrice)
  if (filters.maxPrice) query = query.lte("price", filters.maxPrice)

  const { data, error } = await query
  if (error) throw error
  return data
}

Upload
image (client side, admin)
:

// components/uploadImage.tsx (simplified)
"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ImageUploader({ onDone }: { onDone: (url: string) => void }) {
  const [loading, setLoading] = useState(false)
  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    const filePath = `plots/${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage.from("plots").upload(filePath, file, { upsert: false })
    if (error) {
      console.error(error)
      setLoading(false)
      return
    }
    // make public URL (if bucket public)
    const { publicURL } = supabase.storage.from("plots").getPublicUrl(data.path)
    onDone(publicURL)
    setLoading(false)
  }
  return <input type="file" onChange={uploadFile} disabled={loading} />
}

Contact
API (Vercel Serverless)
— app/api/contact/route.ts:

// app/api/contact/route.ts (Edgeless Vercel Serverless using Node)
import nodemailer from "nodemailer"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, message, plotId } = body

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  const to = process.env.CONTACT_TO_EMAIL
  const subject = `Sasta Plot Inquiry from ${name}${plotId ? " (plot: " + plotId + ")" : ""}`
  const html = `<p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Message:</b><br/>${message}</p>`

  try {
    await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, html })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, error: "Failed to send" }, { status: 500 })
  }
}

Admin
guard
HOC / client
check(simple)
:

// hooks/useIsAdmin.tsx
"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    async function check() {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) {
        setIsAdmin(false)
        return
      }
      // fetch profile
      const { data, error } = await supabase.from("profiles").select("role").eq("auth_id", user.id).single()
      if (error) {
        setIsAdmin(false)
        return
      }
      setIsAdmin(data?.role === "admin")
    }
    check()
  }, [])
  return isAdmin
}

VI.Minimal
UI
routing
structure (app/)

app / page.tsx
— server component — homepage
with featured fetch.

app/plots/page.tsx
— server component — listing
with filters.

app/plots/[slug]/page.tsx
— server component — plot details.

app/auth/login/page.tsx, app/auth/register/page.tsx — client components.

app/admin/ — client-side admin dashboard (protected
with useIsAdmin)
.

app/api/contact/route.ts — serverless email route (already shown).

Use React Hook Form + Zod
for forms. Keep server components for data fetching and SEO
meta.VII.Supabase
Storage & CORS
notes

Create
a
bucket
plots
— set public
if you want
images
public(faster), or
private + generate
signed
URLs
server - side.If
using public
bucket, use
getPublicUrl.For
file
uploads
from
client, CORS
is
handled
by
Supabase.VIII.Quick
Vercel
deployment
checklist(do these last)

In
your
Git
repo
ensure
package.json
at
project
root (it is in sasta-plot-main/sasta-plot-main). Create
package - lock.json
by
running
npm
i
locally
and
commit
it.Remove
the
old
Express
backend in repo
or
move
it
to / legacy - backend
to
avoid
confusion. (You are now using Supabase.)

In
Vercel, create
a
new project()
→ Import from Git → Set Root Directory to sasta-plot-main/sasta-plot-main.

Add Environment Variables in Vercel (under Project Settings → Environment Variables):

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

NEXT_PUBLIC_SITE_URL

SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL

(Optionally) SUPABASE_SERVICE_ROLE_KEY (
for server-side only; mark as secret)

Build & Output
settings: Next.js(auto).Build
command
npm
run
build.Deploy
— click Deploy (or run vercel --prod
if using CLI
).

Test flows: register/login, view listings, open plot page, upload image as admin (
if uploaded directly
via
UI
), send contact form. Check logs in Vercel
for any runtime errors.

IX. Final
“quick fixes” (common gotchas I saw from your repo & how to solve them)

If your repo still contains backend/server.js (Express), remove it or move it out. Vercel might
try
to
detect
multiple
roots.We
already
identified
that
earlier in the
repo
scan
—set the Root Directory properly.

Add .gitignore
with
: node_modules, .next, .env*.

Ensure next.config.mjs has images.unoptimized = false
if you want
Next
image
optimization (but using external Supabase URLs may require adding domains to config).

Ensure
Node
engine in Vercel
is
18+ (set in project
settings
or
package.json
engines
).

X. Commands to run locally now (
do these now)

# in repo
root
where
frontend
package.json
is
located
cd
sasta - plot - main / sasta - plot - main

#
install
deps
and
create
lockfile
npm
ci || npm
install

#
run
dev
locally
npm
run
dev

#
build
for production (locally test)
npm run build
npm
run
start

Deploy
via
CLI(optional)
:

# install vercel CLI (
if you want
to
push
directly
)
npm i -g vercel
vercel login
vercel --prod --cwd ./sasta-plot-main/sasta-plot-main


XI. Risk mitigation / fallback
if something breaks
during
deploy

If
contact
emails
fail: they
’ll show in Vercel logs — temporarily replace
with console.log() of
request
to
accept
submissions
and
follow
up
manually.If
Supabase
anon
key
is
leaking: rotate
keys in Supabase
and
update
Vercel
secrets.If
image
uploading
fails: fallback
to
accepting
image
URLs
from
admins
rather
than
direct
uploads
for first release.

XII. Post-deploy items (do after release)

Add
analytics & error
tracking (Sentry / Vercel analytics).

Convert
admin
pages
to
use
server - side - only
service
role
for secure admin writes. Use edge
functions
for heavy processing.

Harden RLS policies
and
audit
logs.
