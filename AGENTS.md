<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Project Overview

A full-featured **Twitch clone** built with **Next.js 16** (App Router), **React 19**, **TypeScript**, and **Tailwind CSS v4**. The application supports live streaming via **LiveKit**, authentication via **Clerk**, file uploads via **UploadThing**, and persistent data via **PostgreSQL** + **Prisma ORM v7**.

### Key Technologies

| Layer            | Technology                                              |
| ---------------- | ------------------------------------------------------- |
| Framework        | Next.js 16.3.0 (App Router)                             |
| UI               | React 19.2.8, Tailwind CSS v4, shadcn/ui (radix-vega)   |
| Auth             | Clerk (`@clerk/nextjs` v7)                              |
| Database         | PostgreSQL via Prisma v7 (`@prisma/adapter-pg`)         |
| Live Streaming   | LiveKit (client + server SDK)                           |
| File Uploads     | UploadThing                                             |
| State Management | Zustand v5                                              |
| Icons            | Lucide React                                            |
| Package Manager  | npm                                                     |

### Architecture

```
app/
├── (auth)/           # Clerk sign-in / sign-up pages
├── (browse)/         # Public-facing: home feed, user profiles, search
├── (dashboard)/u/    # Creator dashboard (stream settings, chat, community)
├── api/
│   ├── uploadthing/  # UploadThing file router
│   └── webhooks/
│       ├── clerk/    # Clerk webhook (user sync)
│       └── livekit/  # LiveKit webhook (stream status)
actions/              # Next.js Server Actions (follow, block, stream, ingress, etc.)
components/
├── stream-player/    # LiveKit-powered stream player (23 components)
├── ui/               # shadcn/ui primitives
├── seo/              # JSON-LD structured data
lib/                  # Service layer (db, auth, follow, block, feed, search, etc.)
hooks/                # React hooks (viewer token, sidebar state)
store/                # Zustand stores (sidebar, chat sidebar, creator sidebar)
prisma/               # Schema + migrations
generated/prisma/     # Auto-generated Prisma client (gitignored)
```

### Data Models

Four core Prisma models: **User**, **Stream**, **Follow**, **Block**. Users are synced from Clerk via the `externalUserId` field. Each user may own one Stream (1:1). Follow and Block are explicit many-to-many join tables with cascade deletion.

## Setup Commands

```bash
# Install all dependencies (also triggers `prisma generate` via postinstall)
npm install

# Set up environment variables (copy and fill in values)
cp .env.example .env

# Generate the Prisma client (to generated/prisma/)
npm run db:generate

# Run database migrations
npm run db:migrate

# Or push schema directly (no migration file)
npm run db:push

# Open Prisma Studio for visual DB inspection
npm run db:studio
```

### Required Environment Variables

The `.env` file must include:

- `DATABASE_URL` — PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — Clerk auth
- `CLERK_WEBHOOK_SECRET` — Clerk webhook verification
- `LIVEKIT_API_URL` / `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET` — LiveKit
- `LIVEKIT_WEBHOOK_SECRET` — LiveKit webhook verification
- `UPLOADTHING_TOKEN` — UploadThing file uploads
- `NEXT_PUBLIC_APP_URL` — Public app URL (used in SEO sitemaps, webhooks)

## Development Workflow

```bash
# Start the development server (http://localhost:3000)
npm run dev

# Expose local server for webhooks (Clerk / LiveKit)
npm run ngrok
```

- Hot reload is automatic via Next.js dev server.
- The Prisma client is cached on `globalThis` in development to survive HMR without exhausting DB connections (see `lib/db.ts`).
- The generated Prisma client lives at `generated/prisma/` and is **gitignored**. Always run `npm run db:generate` after pulling schema changes.

## Testing Instructions

```bash
# Run all tests
npm test

# Run a specific test file
npx tsx --test "lib/db.test.ts"
```

- Test runner: Node.js built-in test runner via `tsx`.
- Test files use the `*.test.ts` naming convention and live alongside source files.
- Current test coverage: `lib/db.test.ts`, `lib/utils.test.ts`, `proxy.test.ts`.

## Code Style

### Formatting & Linting

```bash
# Lint the entire project
npm run lint

# Lint and auto-fix
npm run lint:fix
```

- **ESLint**: Flat config (`eslint.config.mjs`) extending `next/core-web-vitals` and `next/typescript`.
- **Prettier**: Uses `prettier-plugin-tailwindcss` with the stylesheet at `app/globals.css`.

### Import Ordering (enforced by ESLint — `simple-import-sort`)

Imports must follow this exact group order, separated by blank lines:

1. Side-effect imports (`import "..."`)
2. React / Next.js (`import ... from "react"`, `import ... from "next/..."`)
3. Third-party packages (`@clerk/...`, `clsx`, etc.)
4. Internal aliases (`@/components/...`, `@/lib/...`)
5. Parent directory imports (`../`)
6. Sibling imports (`./`)

### JSX Prop Ordering (enforced by ESLint — `react/jsx-sort-props`)

- `key` and `ref` always first (reserved props).
- All other props sorted alphabetically (case-insensitive).
- Callback props (`onClick`, `onChange`, etc.) always last.

### Path Aliases

The project uses `@/*` mapped to the repository root (configured in `tsconfig.json`). Always use `@/` for imports instead of relative paths when crossing directory boundaries.

### Naming Conventions

- Components: PascalCase (`UserAvatar.tsx` → component file, `user-avatar.tsx` → kebab-case filename).
- Server Actions: camelCase functions in `actions/` directory.
- Service functions: camelCase in `lib/*-service.ts` files.
- Zustand stores: `use-*.ts` in `store/` directory.
- Hooks: `use-*.ts` in `hooks/` directory.
- Route groups use parenthesized names: `(auth)`, `(browse)`, `(dashboard)`.
- Co-located route components live in `_components/` directories.

## Code Quality & Coding Standards

### Code Quality: No Magic Values

- **No Magic Numbers:** Replace unexplained numeric literals with named `const` variables, enums, or config parameters (e.g., timeouts, retry counts, HTTP status codes, pagination limits).
- **No Magic Strings:** Extract hardcoded string literals (e.g., status keys, localStorage keys, URL paths, role names) into localized or shared constants/enums.
- **Exceptions:** Standard initializers like `0`, `1`, or `-1` in loops/arrays are allowed. If a literal's meaning is 100% obvious from context, extraction is optional.
- **Action:** When modifying or writing new code, actively refactor any nearby magic values into appropriately named constants.

### Naming Conventions & Structure

1. **Function Declarations:**
   - Convert ALL arrow functions (`const A = () => {...}`) to standard function declarations (`function A() {...}`).
   - Applies to default exports, named exports, React components, and utility functions.
2. **Prop Interface Naming:**
   - Interfaces/types for component props MUST follow `[ComponentName]Props` (e.g., `SidebarNavProps`, `RootLayoutProps`).
3. **Path-Based Component & Layout Naming:**
   - Name Page and Layout components based on their file path for global uniqueness.
   - Ignore route groups wrapped in parentheses `(...)` and convert remaining path segments to PascalCase.
   - _Examples:_
     - `app/layout.tsx` -> `RootLayout`
     - `app/not-found.tsx` -> `NotFoundPage`
     - `app/(browse)/layout.tsx` -> `BrowseLayout`
     - `app/(browse)/error.tsx` -> `BrowseErrorPage`
     - `app/(browse)/(home)/page.tsx` -> `HomePage`
     - `app/(browse)/search/page.tsx` -> `SearchPage`
     - `app/(browse)/[username]/page.tsx` -> `UsernamePage`
     - `app/(browse)/[username]/loading.tsx` -> `UsernameLoading`
     - `app/(browse)/[username]/error.tsx` -> `UsernameErrorPage`
     - `app/(browse)/[username]/not-found.tsx` -> `UsernameNotFoundPage`
     - `app/(auth)/layout.tsx` -> `AuthLayout`
     - `app/(auth)/sign-in/[[...sign-in]]/page.tsx` -> `SignInPage`
     - `app/(auth)/sign-up/[[...sign-up]]/page.tsx` -> `SignUpPage`
     - `app/(dashboard)/u/[username]/layout.tsx` -> `UUsernameLayout`
     - `app/(dashboard)/u/[username]/(home)/page.tsx` -> `UUsernamePage`
     - `app/(dashboard)/u/[username]/(home)/loading.tsx` -> `UUsernameLoading`
     - `app/(dashboard)/u/[username]/keys/page.tsx` -> `UUsernameKeysPage`
     - `app/(dashboard)/u/[username]/chat/page.tsx` -> `UUsernameChatPage`
     - `app/(dashboard)/u/[username]/chat/loading.tsx` -> `UUsernameChatLoading`
     - `app/(dashboard)/u/[username]/community/page.tsx` -> `UUsernameCommunityPage`
4. **Skeleton Component Naming:**
   - Any component designed as a Suspense fallback (skeleton) MUST have `Skeleton` appended to the end of its name (e.g., `SidebarSkeleton`, `ResultsSkeleton`, `UserAvatarSkeleton`, `StreamPlayerSkeleton`).
5. **Lucide React Icon Imports (`Icon` Suffix):**
   - Always import and use Lucide icons with their explicit `Icon` suffix (e.g., `UserIcon`, `CheckIcon`, `SearchIcon`, `XIcon`, `LoaderIcon`, `ChevronDownIcon` instead of `User`, `Check`, `Search`, `X`, `Loader`, `ChevronDown`).
   - _Rationale:_ Importing icon names without the `Icon` suffix frequently causes naming collisions or ambiguity with local variable names, models/entities (such as Prisma/Clerk `User`), HTML/SVG attributes, and helper components. Using the `Icon` suffix makes the symbol's intent immediately clear and prevents namespace collisions.

## Environment Variables

All required environment variables should be validated using `requireEnvVar` from `lib/utils.ts`.

## Build and Deployment

```bash
# Production build
npm run build

# Start production server
npm start
```

- Remote images are allowed from `utfs.io`, `ufs.sh`, and `*.ufs.sh` (UploadThing CDN) — configured in `next.config.ts`.
- SEO: The app includes `robots.ts`, `sitemap.ts`, and JSON-LD structured data components under `components/seo/`.
- The `generated/` directory is gitignored — CI must run `prisma generate` before building (handled by `postinstall`).

## Database

- **Provider**: PostgreSQL
- **ORM**: Prisma v7 with the `@prisma/adapter-pg` driver adapter
- **Config**: `prisma.config.ts` (loads `DATABASE_URL` from `.env` via `dotenv`)
- **Schema**: `prisma/schema.prisma`
- **Output**: `generated/prisma/` (gitignored)
- **Preview features**: `fullTextSearchPostgres` (native PostgreSQL full-text search on `Stream.name`)
- The `lib/db.ts` module normalizes the connection string (upgrades `sslmode=require` → `sslmode=verify-full` when `uselibpqcompat` is not set).

## Webhook Endpoints

| Endpoint                  | Source   | Purpose                                    |
| ------------------------- | -------- | ------------------------------------------ |
| `/api/webhooks/clerk`     | Clerk    | Syncs user create/update/delete to the DB  |
| `/api/webhooks/livekit`   | LiveKit  | Updates `Stream.isLive` on ingress events  |

## Additional Notes

- **shadcn/ui**: Configured in `components.json` with `radix-vega` style, RSC enabled, Lucide icons, and aliases under `@/components/ui`.
- **Server Actions** in `actions/` handle mutations (follow/unfollow, block/unblock, stream settings, ingress creation, search, user updates, token generation).
- **Zustand stores** in `store/` manage sidebar collapse state and chat sidebar variant (chat vs. community).
- The stream player (`components/stream-player/`) is a complex component tree of 23 files handling video, chat, community, controls, and modals.
- `proxy.ts` at root provides an HTTP proxy utility — it has its own tests in `proxy.test.ts`.
