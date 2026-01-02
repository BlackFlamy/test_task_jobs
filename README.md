# Employers / Jobs / Workers API

REST API for managing employers, jobs, and workers.

Built with **NestJS**, **Prisma**, and **PostgreSQL**.

---

## Setup

```bash
cp .env.example .env
npm install
docker compose up -d
npx prisma generate
npx prisma migrate dev
```
## Run
```bash
npm run dev
```

## Prisma Studio:

```bash
npx prisma studio
```

## API Documentation
Swagger UI:
http://localhost:8001/docs
