# Kontri 🎁

Group gifting made ridiculously easy. Create a room, share the link, and watch the contributions roll in.

## What it does

- Create a fundraiser room with a title, target amount, and deadline
- Share an invite link — members join and wait for the host to lock the split
- Host locks the room → equal split calculated automatically → host's share auto-confirmed
- Members mark their payments → live progress bar fills up
- Goal reached → celebration page with confetti 🎉

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4**
- **Prisma 6** + SQLite
- **NextAuth v5** (JWT sessions, Credentials provider)
- **Framer Motion** — animated progress bar
- **Lucide React** — icons
- **React Hot Toast** — notifications

## Getting Started

```bash
# 1. Clone
git clone https://github.com/5cxr/kontri.git
cd kontri

# 2. Install
npm install

# 3. Environment — create .env
DATABASE_URL="file:/absolute/path/to/prisma/dev.db"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# 4. Database
npx prisma migrate dev --name init
npx prisma generate

# 5. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── (auth)/            # Login & Register
│   ├── dashboard/         # Room cards grid
│   ├── room/
│   │   ├── create/        # Create room form
│   │   └── [id]/          # Room detail + celebrate
│   └── api/               # REST API routes
├── components/            # Reusable UI components
└── lib/                   # Auth, Prisma client, hooks
```
