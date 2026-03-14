<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Fitness Backend 🏋️

REST API built with NestJS for tracking daily workout logs submitted via Google Forms, designed to serve fitness data to a WhatsApp bot.

## How it works

```
Google Forms
     ↓ (Apps Script onSubmit)
POST /api/workout-logs
     ↓
MongoDB (Docker)
     ↓
GET /api/workout-logs/stats
     ↓
WhatsApp Bot
```

## Requirements

- Node.js 18+
- Docker & Docker Compose

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/matiasncatala/fitness-backend.git
cd fitness-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.template .env
```

Fill in the values in `.env`:

| Variable         | Description                       |
| ---------------- | --------------------------------- |
| `PORT`           | Server port (default: `3000`)     |
| `MONGODB_URI`    | MongoDB connection string         |
| `JWT_SEED`       | Secret key for signing JWT tokens |
| `ADMIN_USERNAME` | Admin username for the seed       |
| `ADMIN_PASSWORD` | Admin password for the seed       |

### 4. Start the database

```bash
docker-compose up -d
```

### 5. Run the server

```bash
# Development
npm run start:dev

# Production
npm run start
```

### 6. Seed the admin user

Once the server is running, call the seed endpoint **once** to create the admin user:

```
GET http://localhost:3000/api/seed
```

This creates an admin user using the `ADMIN_USERNAME` and `ADMIN_PASSWORD` values from your `.env`. It is safe to call multiple times as it will not create duplicates.

## Authentication

The API uses JWT Bearer tokens. To generate a token:

```
POST /api/auth/getToken
```

```json
{
  "username": "ADMIN",
  "password": "PA$$wORd."
}
```

Response:

```json
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Use this token in the `Authorization` header for all protected endpoints:

```
Authorization: Bearer <token>
```

## Endpoints

| Method  | Route                                    | Auth | Description                             |
| ------- | ---------------------------------------- | ---- | --------------------------------------- |
| `GET`   | `/api/seed`                              | ❌   | Creates the admin user                  |
| `POST`  | `/api/auth/getToken`                     | ❌   | Returns a JWT token                     |
| `POST`  | `/api/workout-logs`                      | ✅   | Creates a new workout log               |
| `GET`   | `/api/workout-logs`                      | ✅   | Lists all logs                          |
| `GET`   | `/api/workout-logs/stats`                | ✅   | Returns today's stats grouped by person |
| `GET`   | `/api/workout-logs/pending-notification` | ✅   | Lists logs not yet notified             |
| `GET`   | `/api/workout-logs/:id`                  | ✅   | Returns a single log                    |
| `PATCH` | `/api/workout-logs/:id/mark-notified`    | ✅   | Marks a log as notified                 |

## Related projects

- [fitness-bot](https://github.com/maticatala/fitness-bot) — WhatsApp bot that consumes this API
