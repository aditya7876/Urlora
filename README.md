# 🔗 Urlora - URL Shortener API

A fast, secure, and lightweight URL Shortener REST API built with **Bun**, **Express**, **Drizzle ORM**, and **PostgreSQL**.

---

## ⚡ Tech Stack

- **Runtime & Package Manager:** [Bun](https://bun.sh/)
- **Backend Framework:** Express.js
- **Database & ORM:** PostgreSQL 16 (Docker) + [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication & Security:** JWT (Bearer) + HMAC SHA-256 with unique random salt
- **Validation & IDs:** [Zod 4](https://zod.dev/) + [nanoid](https://github.com/ai/nanoid)

---

## 📁 Project Structure

```text
urlora/
├── db/
│   └── index.js              # PostgreSQL client & Drizzle ORM instance
├── middlewares/
│   └── auth.middleware.js    # JWT Bearer extraction & route protection guards
├── models/
│   ├── index.js              # Central database schema exports
│   ├── user.model.js         # Users table schema (id, email, password, salt)
│   └── url.model.js          # URLs table schema (id, code, targetUrl, userId)
├── routes/
│   ├── user.routes.js        # Auth routes (/user/signup, /user/login)
│   └── url.routes.js         # URL routes (/url/shorten, /url/codes, /:shortCode)
├── services/
│   └── user.service.js       # Database access & business logic for users
├── utils/
│   ├── hash.js               # Password hashing with crypto HMAC SHA-256 & salts
│   └── token.js              # JWT creation & verification helpers
├── validation/
│   ├── request.validation.js # Zod schemas for request payloads (signup, login, shorten)
│   └── token.validation.js   # Zod schema for JWT payload structure
├── docker-compose.yml        # PostgreSQL 16 service container config
├── drizzle.config.js         # Drizzle Kit schema push & studio configuration
├── index.js                  # Express app entry point & middleware mounting
├── package.json              # Project scripts & dependencies
└── .env                      # Environment variables (PORT, DATABASE_URL, JWT_SECRET)
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment (`.env`)

```env
PORT=8000
DATABASE_URL=postgres://postgres:admin@localhost:5432/postgres
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Start Database & Sync Schema

```bash
# Start PostgreSQL container
docker compose up -d

# Push schema to database
bun run db:push
```

### 4. Run Development Server

```bash
bun run dev
```

> Server running on: **`http://localhost:8000`**

---

## API Endpoints

### 👤 Authentication (`/user`)

| Method | Endpoint       | Description                 | Auth |
| :----- | :------------- | :-------------------------- | :--: |
| `POST` | `/user/signup` | Register new user account   |  ❌  |
| `POST` | `/user/login`  | Login and receive JWT token |  ❌  |

### 🔗 URL Management (`/url`)

| Method   | Endpoint       | Description                             | Auth |
| :------- | :------------- | :-------------------------------------- | :--: |
| `POST`   | `/url/shorten` | Shorten a URL (optional custom `code`)  |  ✅  |
| `GET`    | `/url/codes`   | List all URLs created by logged-in user |  ✅  |
| `DELETE` | `/url/:id`     | Delete a shortened URL by ID            |  ✅  |
| `GET`    | `/:shortCode`  | Redirect to destination URL (`302`)     |  ❌  |
| `GET`    | `/`            | Health check / server status            |  ❌  |

> **Note:** For protected endpoints (✅), include:  
> `Authorization: Bearer <your_jwt_token>`

---

## 🛠️ Scripts

| Command             | Description                                 |
| :------------------ | :------------------------------------------ |
| `bun run dev`       | Start development server with file watching |
| `bun run db:push`   | Sync Drizzle schema with database           |
| `bun run db:studio` | Open Drizzle Studio visual web GUI          |

---

## 📄 License

MIT
