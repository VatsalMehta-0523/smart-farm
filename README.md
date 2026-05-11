# 🌿 Smart Farm Platform

A production-ready, mobile-first digital farm exploration platform. Visitors scan QR codes or browse plant cards to explore a real botanical farm. Admins manage all content through a sleek dashboard.

---

## 📁 Project Structure

```
smart-farm/
├── src/
│   ├── app/
│   │   ├── page.tsx                    ← Visitor home (plant grid, search, filters)
│   │   ├── layout.tsx                  ← Root layout (fonts, metadata)
│   │   ├── globals.css                 ← Design system, animations
│   │   ├── plant/[id]/page.tsx         ← Individual plant detail page
│   │   └── admin/
│   │       ├── layout.tsx              ← Admin layout (auth guard)
│   │       ├── page.tsx                ← Admin dashboard (plant table + stats)
│   │       └── login/page.tsx          ← Admin login
│   ├── components/
│   │   ├── visitor/
│   │   │   ├── TopBar.tsx              ← Search bar, QR button, translate, settings
│   │   │   ├── FilterStrip.tsx         ← Horizontal category chip filters
│   │   │   ├── PlantCard.tsx           ← Botanical plant card
│   │   │   ├── PlantGrid.tsx           ← Responsive 2-col grid with skeletons
│   │   │   ├── QRScanner.tsx           ← Camera-based QR scanner (html5-qrcode)
│   │   │   └── ChatBot.tsx             ← Floating AI chat widget
│   │   └── admin/
│   │       ├── PlantTable.tsx          ← Full plant management table
│   │       ├── AddPlantModal.tsx       ← 5-step add/edit guided modal
│   │       ├── PlantPreviewModal.tsx   ← Visitor-identical preview for admins
│   │       └── DeleteConfirmModal.tsx  ← Deletion confirmation
│   ├── lib/
│   │   ├── supabase.ts                 ← Browser Supabase client
│   │   ├── supabase-server.ts          ← Server-side Supabase client
│   │   ├── constants.ts                ← All UI strings, categories, config
│   │   ├── utils.ts                    ← Helper functions
│   │   └── pdf.tsx                     ← Client-side PDF generation
│   ├── types/index.ts                  ← All TypeScript types
│   └── middleware.ts                   ← Admin route protection
├── supabase/
│   ├── config.toml                     ← Supabase CLI config
│   ├── functions/
│   │   ├── chat/index.ts               ← Edge Function: Groq AI chatbot
│   │   └── generate-qr/index.ts        ← Edge Function: QR code generation
│   ├── migrations/
│   │   └── 001_schema.sql              ← Full DB schema + RLS policies
│   └── seeds/
│       └── seed.sql                    ← Categories + 3 sample plants
├── .env.example                        ← Environment variable template
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Setup Guide

Follow these steps **in order**. This takes about 20–30 minutes total.

---

### PART 1 — Supabase Setup

#### Step 1.1 — Create a Supabase Project

1. Go to **[https://supabase.com](https://supabase.com)** and sign up / log in
2. Click **"New Project"**
3. Fill in:
   - **Project name**: `smart-farm` (or anything you like)
   - **Database password**: Create a strong password and save it somewhere safe
   - **Region**: Choose the one closest to your users (e.g., Mumbai for India)
4. Click **"Create new project"**
5. Wait ~2 minutes for it to spin up

---

#### Step 1.2 — Run the Database Schema

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase/migrations/001_schema.sql` from this project
4. Copy its **entire contents** and paste into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see: `Success. No rows returned`

This creates all tables, indexes, RLS policies, and the storage bucket.

---

#### Step 1.3 — Run the Seed Data

1. In SQL Editor, click **"New query"** again
2. Open `supabase/seeds/seed.sql` from this project
3. Copy its entire contents and paste into the editor
4. Click **"Run"**

This adds the 6 default categories (Medicinal, Herbs, Flowers, etc.) and 3 sample plants.

---

#### Step 1.4 — Create Your Admin User

**Part A — Create the auth user:**
1. In Supabase dashboard, go to **Authentication → Users** (left sidebar)
2. Click **"Add user"** → **"Create new user"**
3. Enter your email and a strong password
4. Click **"Create user"**
5. **Copy the UUID** shown in the user list (looks like: `a1b2c3d4-e5f6-...`)

**Part B — Register as admin in the database:**
1. Go back to **SQL Editor → New query**
2. Run this query (replace with your actual UUID):

```sql
INSERT INTO admins (id) VALUES ('PASTE-YOUR-UUID-HERE');
```

Example:
```sql
INSERT INTO admins (id) VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
```

3. Click **"Run"**

You can now log in at `/admin/login` with the email and password you set.

---

#### Step 1.5 — Get Your API Keys

1. In Supabase dashboard, click **"Project Settings"** (gear icon, bottom of left sidebar)
2. Click **"API"** in the settings menu
3. You need **two values**:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon / public key** — the long string under "Project API keys"

Keep this tab open — you'll need these in Part 2.

---

#### Step 1.6 — Deploy the Edge Functions

Edge Functions power the AI chatbot and QR code generation.

**Option A — Using Supabase Dashboard (easiest, no CLI needed):**

1. Go to **Edge Functions** in the left sidebar
2. Click **"Deploy a new function"**

**For the `chat` function:**
- Function name: `chat`
- Copy the contents of `supabase/functions/chat/index.ts`
- Paste and deploy

**For the `generate-qr` function:**
- Function name: `generate-qr`
- Copy the contents of `supabase/functions/generate-qr/index.ts`
- Paste and deploy

**Option B — Using Supabase CLI:**

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link to your project (get project ref from dashboard URL)
supabase link --project-ref YOUR_PROJECT_REF

# Deploy both functions
supabase functions deploy chat
supabase functions deploy generate-qr
```

---

#### Step 1.7 — Set Edge Function Secrets

The AI chatbot needs a Groq API key, and the QR function needs the service role key.

**Get a free Groq API key:**
1. Go to **[https://console.groq.com](https://console.groq.com)**
2. Sign up (free) → Go to **API Keys** → **Create API Key**
3. Copy the key

**Get your Supabase Service Role key:**
1. In Supabase → Project Settings → API
2. Under "Project API keys", copy the **service_role** key (NOT the anon key)
   ⚠️ This key is powerful — never put it in frontend code

**Set the secrets:**

Go to **Edge Functions** → **Manage secrets** and add:

| Secret Name               | Value                          |
|---------------------------|--------------------------------|
| `GROQ_API_KEY`            | Your Groq API key              |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |

Or via CLI:
```bash
supabase secrets set GROQ_API_KEY=your_groq_key_here
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

#### Step 1.8 — Verify Storage Bucket

1. In Supabase dashboard, click **"Storage"** in the left sidebar
2. You should see a bucket called **`plant-images`** (created by the schema SQL)
3. If it's not there: click **"New bucket"**, name it `plant-images`, check **"Public bucket"**, click Save

---

### PART 2 — Frontend Setup

#### Step 2.1 — Install Dependencies

```bash
# Navigate to the project folder
cd smart-farm

# Install all packages
npm install
```

---

#### Step 2.2 — Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_FARM_NAME="Your Farm Name"
```

- `NEXT_PUBLIC_SUPABASE_URL` — from Step 1.5 (Project URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Step 1.5 (anon / public key)
- `NEXT_PUBLIC_FARM_NAME` — your farm's display name (e.g., "Green Valley Farm")

---

#### Step 2.3 — Run Locally

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

- Visitor view: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

---

### PART 3 — Deploy to Vercel

#### Step 3.1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial Smart Farm Platform"
git remote add origin https://github.com/YOUR_USERNAME/smart-farm.git
git push -u origin main
```

#### Step 3.2 — Deploy on Vercel

1. Go to **[https://vercel.com](https://vercel.com)** and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `smart-farm` repository
4. In **"Environment Variables"**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your anon key
   - `NEXT_PUBLIC_FARM_NAME` → your farm name
5. Click **"Deploy"**

Your farm is live! 🎉

---

#### Step 3.3 — Update QR Code Base URL (Important!)

After deploying, QR codes should point to your live domain, not localhost.

In your Edge Function `generate-qr/index.ts`, the `origin` is read from the request headers automatically, so it should work. But double-check by:
1. Adding a plant via the admin panel on your live domain
2. Scanning its QR code and confirming it opens the correct URL

---

## 🔐 Security Checklist

Before going live, verify all of these:

- [ ] RLS is enabled on all tables (done by schema SQL)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the **anon** key, NOT the service role key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is ONLY in Edge Function secrets, never in `.env.local`
- [ ] `GROQ_API_KEY` is ONLY in Edge Function secrets
- [ ] `.env.local` is in `.gitignore` (it is — don't change this)
- [ ] Storage bucket `plant-images` is set to public read, authenticated write
- [ ] Admin user exists in the `admins` table (Step 1.4)

---

## 📱 How It Works — Visitor Flow

1. Visitor opens the farm URL on their phone
2. They see a botanical card grid of all published plants
3. They can:
   - **Scroll** to browse (core experience)
   - **Search** by name, scientific name, keywords
   - **Filter** by category chip (Medicinal, Herbs, Flowers, etc.)
   - **Scan QR** from the button in the top bar — camera opens, scans plant QR → lands on that plant's page
4. On the plant page they see gallery, medicinal info, folklore, scientific data
5. **AI Chatbot** floating button opens a chat — powered by Groq's Llama 3

---

## 🛠️ Admin Flow

1. Settings icon (top-right of visitor view) → Admin panel → `/admin/login`
2. Log in with the credentials created in Step 1.4
3. Dashboard shows total / published / draft / hidden plant counts
4. Plant table lists all plants with thumbnails, status, category
5. **Click any row** → Preview exactly what visitors see
6. **Edit button** → 5-step guided modal (pre-filled with existing data)
7. **QR icon** → Download the plant's QR code PNG
8. **PDF button** → Generates and downloads a PDF plant profile (client-side, no server needed)
9. **Delete** → Confirmation dialog before permanent removal

---

## 🗺️ Future Roadmap

### Phase 2 — AI & Search
- [ ] Plant-context chatbot — inject current plant UUID + data into Groq prompt
- [ ] Fuzzy search using `pg_trgm` (extension already enabled)
- [ ] pgvector semantic search for natural language discovery
- [ ] Swap Groq for Gemini — clean provider interface already in architecture

### Phase 3 — Localization
- [ ] Hindi and Gujarati language support
- [ ] `next-i18next` or Next.js i18n routing
- [ ] Translation files to replace the constants file (architecture already prevents hardcoded strings)

### Phase 4 — Fauna Expansion
- [ ] Animals and Birds section
- [ ] Separate Fauna category, cards, detail pages
- [ ] Fauna-specific filter chips

### Phase 5 — Multi-Farm
- [ ] Activate `farm_id` across `plants` and `admins` tables (columns exist, just unpopulated)
- [ ] Farm-specific branding and subdomains
- [ ] Admin role scoping per farm

### Phase 6 — Advanced
- [ ] AI plant disease detection (image upload → analysis)
- [ ] Analytics dashboard — QR scan counts, search analytics
- [ ] IoT integration — soil sensors, weather data per plant
- [ ] Chatbot conversation history per session

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 + TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Auth | Supabase Auth |
| Database | Supabase PostgreSQL + RLS |
| Storage | Supabase Storage |
| Edge Functions | Supabase (Deno runtime) |
| QR Scanning | html5-qrcode |
| PDF Generation | @react-pdf/renderer (client-side) |
| AI Chatbot | Groq API (llama3-8b-8192) |
| Deployment | Vercel (frontend) + Supabase (backend) |

---

## 🐛 Troubleshooting

**"No plants showing" on visitor page**
→ Check that plants in the DB have `status = 'published'`
→ Check RLS policies are enabled (run schema SQL again if unsure)

**Admin login not working**
→ Confirm the user exists in Authentication → Users
→ Confirm their UUID is in the `admins` table

**QR codes not generating**
→ Check Edge Function is deployed (Supabase → Edge Functions)
→ Check `GROQ_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` secrets are set
→ Check storage bucket `plant-images` exists and is public

**Camera not opening for QR scan**
→ Browser requires HTTPS for camera access
→ On localhost this works fine; on production ensure Vercel HTTPS is enabled (it is by default)

**Images not uploading**
→ Check storage bucket exists
→ Confirm admin user is in `admins` table (needed for storage RLS write access)

---

## 📞 Support

For Supabase issues: [https://supabase.com/docs](https://supabase.com/docs)
For Groq API: [https://console.groq.com/docs](https://console.groq.com/docs)
For Vercel: [https://vercel.com/docs](https://vercel.com/docs)
