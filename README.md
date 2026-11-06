# Zabanbuzz

سکوی آزمون و آموزش برای داوطلبان کنکور، با Next.js، Prisma و PostgreSQL که با داکر اجرا می‌شود.

## اجرا با داکر

```bash
cp .env.example .env
```

در `.env` مقدار `POSTGRES_PASSWORD` را عوض کنید و همان رمز را در `DATABASE_URL` هم بگذارید. سپس:

```bash
docker compose up --build
```

برنامه روی http://localhost:3000 بالا می‌آید و migrationها خودکار اجرا می‌شوند.

## توسعه روی خود سیستم

پایگاه داده در داکر و Next.js روی سیستم اجرا می‌شود:

```bash
docker compose up -d db
```

```bash
npm install
```

```bash
npm run db:deploy
```

```bash
npm run dev
```

پیش از هر کامیت:

```bash
npm run check
```

## ساخت اولین ادمین

در سایت ثبت‌نام کنید و بعد با همان ایمیل یا موبایل این دستور را بزنید:

```bash
npm run admin:make -- 09120000000
```

در داکر:

```bash
docker compose run --rm migrate npx tsx scripts/make-admin.mts 09120000000
```

بقیه نقش‌ها را ادمین از صفحه `/admin` تعیین می‌کند.

## تغییر مدل داده

`prisma/schema.prisma` را ویرایش کنید و بعد migration بسازید:

```bash
npm run db:migrate
```

## داکیومنت‌ها

- [محصول](docs/product.md)
- [معماری](docs/architecture.md)
- [دفتر تصمیم‌ها](docs/decisions/README.md)
- [قوانین کار برای ایجنت‌ها](CLAUDE.md)
