# Zabanbuzz

A platform for Iranian konkur students: exams and teaching. Next.js (App Router) + Prisma + PostgreSQL, run with Docker. The UI is Persian and RTL.

## Read first

- `docs/product.md`: what we are building and the open product questions. Don't invent answers to them; ask.
- `docs/architecture.md`: how the pieces fit together.
- `docs/decisions/README.md`: decision log. Check it before changing anything a decision covers.

## Commands

- `npm run dev`: dev server. Needs the database: `docker compose up -d db`
- `npm run check`: lint and typecheck. Run before calling work done.
- `npm run build`: production build
- `npm run db:migrate`: create and apply a migration after editing `prisma/schema.prisma`
- `npm run admin:make -- <email-or-phone>`: promote an existing user to admin
- `docker compose up --build`: run the whole stack

## Rules

- Never commit `.env`. New env vars go in `.env.example` too.
- Schema changes always go through a migration. Don't use `prisma db push`, and don't edit a migration that has been committed.
- Import the database client from `@/lib/prisma`. Don't create another `PrismaClient`.
- `src/generated/` is generated and ignored by git. Don't edit it.
- Keep `prisma` and `@prisma/client` on the same exact version (ADR 0003). Don't run `npm i prisma@latest`.
- Cache Components is on: anything reading cookies or the database at request time must render inside `<Suspense>`, and must `await connection()` if it reads neither cookies nor headers first (ADR 0005). See `src/app/(panel)/admin/page.tsx`.
- Every page and server action that needs access control calls `requireRole` or `requireUser` from `@/lib/auth/session` itself. A check in a layout doesn't protect a page.
- Never select `passwordHash` into anything sent to the client.
- User-facing text is Persian. Use logical Tailwind classes (`ms-*`, `text-start`), not `ml-*` or `text-left`. Don't load fonts from Google (ADR 0010).
- UI components come from HeroUI v3 (ADR 0011). Don't hand-build a button, card, field or select. Read its API from `node_modules/@heroui/react/dist`; v3 differs a lot from v2. In Server Components use the named parts (`CardRoot`, `CardHeader`), not `Card.Header`. For a link styled as a button, put `buttonVariants` from `@heroui/styles` on `next/link`.
- Light and dark themes both must work. Use HeroUI's color tokens (`bg-surface`, `text-muted`, `border-border`, `text-link`), not raw colors.
- The product brief arrives task by task. Don't build features ahead of it, and don't put invented stats or testimonials on the site.
- `AUTH_OTP_ENABLED` stays off until ADR 0008's checklist is done.
- Next.js 16 and Prisma 7 differ from older versions. If unsure about an API, check `node_modules/next/dist/docs/` or the Prisma docs rather than relying on memory.

## Decisions

When a change involves a real choice (a new dependency, a data model shape, a change of approach), add an ADR in `docs/decisions/` from `template.md` and add it to the index, in the same commit. To reverse a decision, write a new ADR and mark the old one superseded; don't rewrite history.
