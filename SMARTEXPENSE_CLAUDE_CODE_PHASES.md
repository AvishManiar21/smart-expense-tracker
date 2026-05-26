# 🚀 SmartExpense Tracker — Claude Code Phase Instructions

> **How to use:** Open your project in Claude Code and say **"Execute Phase 1"**, **"Execute Phase 2"**, etc.
> Claude Code will use the appropriate agents and follow the instructions for that phase automatically.

---

## 📋 MASTER CONFIGURATION
> **Paste this at the very top of your Claude Code session before starting any phase.**

```
PROJECT: SmartExpense Tracker
STACK:
  - Frontend: React 18 + JavaScript + Vite + Tailwind CSS + Recharts
  - Backend: Node.js 20 + Express.js + Prisma ORM
  - Database: PostgreSQL
  - Auth: JWT + Refresh Tokens
  - Testing: Jest + React Testing Library + Supertest

AGENTS AVAILABLE:
  - Web Development Agent   → src/agents/web-dev-agent/index.js
  - Data Analysis Agent     → src/agents/data-analysis-agent/index.js
  - DevOps Agent            → src/agents/devops-agent/index.js
  - General Purpose Agent   → src/agents/general-purpose-agent/index.js

RULES:
  - Always use JavaScript (no TypeScript)
  - Always add PropTypes for React components
  - Always add JSDoc comments
  - Always include error handling
  - Always follow RESTful conventions
  - Always validate inputs on both frontend and backend
  - File structure must match the project plan exactly
```

---

## 🗂️ PROJECT STRUCTURE REFERENCE
```
smart-expense-tracker/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Expenses/
│   │   │   ├── Income/
│   │   │   ├── Budget/
│   │   │   ├── Analytics/
│   │   │   ├── Reports/
│   │   │   └── Common/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── docker-compose.yml
├── .github/workflows/
└── README.md
```

---

## 🗺️ ALL PHASES AT A GLANCE

| # | Phase Name | Agent(s) Used | Day | Key Deliverables |
|---|-----------|---------------|-----|-----------------|
| **1** | Foundation & Project Setup | General Purpose + DevOps | 1-2 | Folder structure, Docker, Prisma schema, env config, seed data |
| **2** | Authentication System | Web Dev | 3-4 | Register, login, JWT, password reset, protected routes, auth UI |
| **3** | Expense Management | Web Dev | 5-7 | Expense CRUD, categories, filters, pagination, CSV import |
| **4** | Income & Budget Management | Web Dev | 8-9 | Income tracking, budgets, recurring expenses, alerts, layout |
| **5** | Analytics & Dashboard | Data Analysis + Web Dev | 10-12 | Dashboard, pie/line/bar charts, AI insights, spending trends |
| **6** | Reports & Export | Data Analysis + Web Dev | 13-14 | Monthly/yearly reports, PDF export, CSV export, date ranges |
| **7** | Settings & User Profile | Web Dev | 15 | Profile editing, password change, category manager, account stats |
| **8** | Testing & Quality Assurance | Web Dev + General Purpose | 16-17 | Jest tests, ESLint, Prettier, security audit, performance check |
| **9** | CI/CD & Deployment | DevOps | 18-19 | GitHub Actions, Railway backend, Vercel frontend, Sentry monitoring |
| **10** | Final Polish & Optimization | General Purpose + Web Dev | 20 | Lazy loading, error boundaries, accessibility, docs, launch checklist |

---

## ⚡ PHASE EXECUTION COMMANDS

```bash
# How to run each phase — just say this in Claude Code:

"Execute Phase 1"    →  Project setup, Docker, database schema
"Execute Phase 2"    →  Authentication (register, login, JWT)
"Execute Phase 3"    →  Expense CRUD, categories, CSV import
"Execute Phase 4"    →  Income, budgets, recurring, layout
"Execute Phase 5"    →  Dashboard, charts, analytics, insights
"Execute Phase 6"    →  Reports, PDF/CSV export
"Execute Phase 7"    →  Settings, profile, categories
"Execute Phase 8"    →  Tests, linting, security audit
"Execute Phase 9"    →  CI/CD, deploy to Railway + Vercel
"Execute Phase 10"   →  Polish, optimize, document, launch

# Other useful commands:
"Run the Phase X verification checklist"
"Phase X Task Y failed with error: [error]. Fix it."
"Re-run Phase X Task Y"
"What is the current status of Phase X?"
"Execute Phase X but skip tasks Y and Z"
```

---

## 📊 PHASE METRICS OVERVIEW

| Phase | Files Created | API Endpoints | Components | Tests |
|-------|:------------:|:-------------:|:----------:|:-----:|
| Phase 1 | ~25 | 0 | 0 | 0 |
| Phase 2 | ~20 | 6 | 4 | ✅ |
| Phase 3 | ~25 | 10 | 8 | ✅ |
| Phase 4 | ~30 | 15 | 12 | ✅ |
| Phase 5 | ~20 | 6 | 8 | ✅ |
| Phase 6 | ~15 | 5 | 6 | ✅ |
| Phase 7 | ~10 | 5 | 5 | ✅ |
| Phase 8 | ~20 | 0 | 0 | ✅ |
| Phase 9 | ~15 | 2 | 0 | ✅ |
| Phase 10 | ~10 | 0 | 5 | ✅ |
| **TOTAL** | **~190** | **~49** | **~48** | **All** |

---

## 🤖 AGENT USAGE MAP

```
┌─────────────────────────────────────────────────────────┐
│                    AGENT ASSIGNMENT                      │
├─────────────────────────┬───────────────────────────────┤
│ General Purpose Agent   │ Phase 1, 8, 10                │
│ Web Development Agent   │ Phase 2, 3, 4, 7, 8, 10       │
│ Data Analysis Agent     │ Phase 5, 6                    │
│ DevOps Agent            │ Phase 1, 9                    │
└─────────────────────────┴───────────────────────────────┘

Detailed breakdown:

General Purpose Agent → Phase 1 (project init, structure)
                     → Phase 8  (quality checks, code review)
                     → Phase 10 (optimization, documentation)

Web Development Agent → Phase 2  (authentication API + UI)
                     → Phase 3  (expenses API + UI)
                     → Phase 4  (income + budget API + UI)
                     → Phase 7  (settings + profile)
                     → Phase 8  (testing)
                     → Phase 10 (UI polish)

Data Analysis Agent  → Phase 5  (analytics engine + insights)
                     → Phase 6  (reports + CSV generation)

DevOps Agent         → Phase 1  (Docker + environment setup)
                     → Phase 9  (CI/CD + deployment)
```

---

## 🔗 TECH STACK QUICK REFERENCE

```
FRONTEND                          BACKEND
─────────────────────             ──────────────────────
React 18 (JavaScript)             Node.js 20
Vite (build tool)                 Express.js
React Router v6                   Prisma ORM
TanStack Query                    PostgreSQL
Recharts (charts)                 JWT Auth
Tailwind CSS                      bcryptjs
React Hook Form                   express-validator
lucide-react (icons)              multer (uploads)
PropTypes (validation)            PDFKit (PDF export)
Jest + RTL (testing)              csv-parser
                                  Jest + Supertest
                                  
DEVOPS                            MONITORING
─────────────────────             ──────────────────────
Docker + Docker Compose           Sentry (errors)
GitHub Actions (CI/CD)            Morgan (HTTP logs)
Railway (backend host)            Winston (app logs)
Vercel (frontend host)            Health check endpoint
```

---

---

# ═══════════════════════════════════════
# PHASE 1: FOUNDATION & PROJECT SETUP
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 1"` in Claude Code
> **Agent:** General Purpose Agent (Primary) + DevOps Agent (Secondary)
> **Duration:** Day 1-2
> **Goal:** Complete project scaffolding, database schema, Docker setup, environment configuration

---

## PHASE 1 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 1: Foundation & Project Setup
AGENTS: General Purpose Agent + DevOps Agent

=== TASK 1: Initialize Project Structure ===

Using the General Purpose Agent, create the complete SmartExpense Tracker project structure:

1. Create root directory: smart-expense-tracker/

2. Initialize FRONTEND (React + Vite):
   cd frontend
   - Run: npm create vite@latest . -- --template react
   - Install dependencies:
     npm install react-router-dom axios recharts tailwindcss
     autoprefixer postcss react-hook-form prop-types
     @tanstack/react-query date-fns lucide-react
   - Install dev dependencies:
     npm install -D @testing-library/react @testing-library/jest-dom
     @testing-library/user-event jest jest-environment-jsdom
     eslint eslint-plugin-react prettier
   - Initialize Tailwind: npx tailwindcss init -p
   - Create folder structure:
     src/components/Auth/
     src/components/Dashboard/
     src/components/Expenses/
     src/components/Income/
     src/components/Budget/
     src/components/Analytics/
     src/components/Reports/
     src/components/Common/
     src/pages/
     src/services/
     src/hooks/
     src/context/
     src/utils/
     src/styles/

3. Initialize BACKEND (Node.js + Express):
   cd backend
   - Run: npm init -y
   - Install dependencies:
     npm install express prisma @prisma/client bcryptjs jsonwebtoken
     express-validator express-rate-limit cors helmet morgan
     dotenv multer csv-parser pdfkit nodemailer uuid
   - Install dev dependencies:
     npm install -D jest supertest nodemon eslint prettier
   - Initialize Prisma: npx prisma init
   - Create folder structure:
     src/routes/
     src/controllers/
     src/middleware/
     src/services/
     src/utils/
     src/config/

=== TASK 2: Environment Configuration ===

Create the following files:

FILE: backend/.env.example
---
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/expense_tracker"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_REFRESH_EXPIRES_IN="30d"

# Server
NODE_ENV="development"
PORT=5000
FRONTEND_URL="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=5

# File Upload (Cloudinary - optional)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Email (for password reset)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER=""
SMTP_PASSWORD=""
EMAIL_FROM="noreply@smartexpense.com"
---

FILE: frontend/.env.example
---
VITE_API_URL="http://localhost:5000/api"
VITE_APP_NAME="SmartExpense Tracker"
---

=== TASK 3: Database Schema (Prisma) ===

Create FILE: backend/prisma/schema.prisma
---
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String    @map("password_hash")
  name         String
  currency     String    @default("USD")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  expenses     Expense[]
  income       Income[]
  categories   Category[]
  budgets      Budget[]
  recurring    RecurringExpense[]

  @@map("users")
}

model Expense {
  id            String    @id @default(uuid())
  userId        String    @map("user_id")
  amount        Decimal   @db.Decimal(10, 2)
  categoryId    String    @map("category_id")
  description   String
  date          DateTime  @db.Date
  paymentMethod String    @default("card") @map("payment_method")
  receiptUrl    String?   @map("receipt_url")
  isRecurring   Boolean   @default(false) @map("is_recurring")
  recurringId   String?   @map("recurring_id")
  createdAt     DateTime  @default(now()) @map("created_at")
  deletedAt     DateTime? @map("deleted_at")

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  category      Category  @relation(fields: [categoryId], references: [id])
  recurring     RecurringExpense? @relation(fields: [recurringId], references: [id])

  @@index([userId, date(sort: Desc)])
  @@index([categoryId])
  @@map("expenses")
}

model Income {
  id          String    @id @default(uuid())
  userId      String    @map("user_id")
  amount      Decimal   @db.Decimal(10, 2)
  source      String
  description String?
  date        DateTime  @db.Date
  isRecurring Boolean   @default(false) @map("is_recurring")
  createdAt   DateTime  @default(now()) @map("created_at")
  deletedAt   DateTime? @map("deleted_at")

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, date(sort: Desc)])
  @@map("income")
}

model Category {
  id          String    @id @default(uuid())
  userId      String?   @map("user_id")
  name        String
  icon        String
  color       String
  budgetLimit Decimal?  @db.Decimal(10, 2) @map("budget_limit")
  isDefault   Boolean   @default(false) @map("is_default")
  createdAt   DateTime  @default(now()) @map("created_at")

  user        User?     @relation(fields: [userId], references: [id])
  expenses    Expense[]
  budgets     Budget[]
  recurring   RecurringExpense[]

  @@unique([userId, name])
  @@map("categories")
}

model Budget {
  id          String    @id @default(uuid())
  userId      String    @map("user_id")
  categoryId  String    @map("category_id")
  amount      Decimal   @db.Decimal(10, 2)
  period      String    @default("monthly")
  startDate   DateTime  @db.Date @map("start_date")
  endDate     DateTime? @db.Date @map("end_date")
  createdAt   DateTime  @default(now()) @map("created_at")

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  category    Category  @relation(fields: [categoryId], references: [id])

  @@unique([userId, categoryId, period])
  @@map("budgets")
}

model RecurringExpense {
  id            String    @id @default(uuid())
  userId        String    @map("user_id")
  amount        Decimal   @db.Decimal(10, 2)
  categoryId    String    @map("category_id")
  description   String
  frequency     String
  nextOccurrence DateTime @db.Date @map("next_occurrence")
  isActive      Boolean   @default(true) @map("is_active")
  createdAt     DateTime  @default(now()) @map("created_at")

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  category      Category  @relation(fields: [categoryId], references: [id])
  expenses      Expense[]

  @@map("recurring_expenses")
}
---

=== TASK 4: Database Seed File ===

Create FILE: backend/prisma/seed.js with default categories:
- Food & Dining (🍔, #FF6B6B)
- Transport (🚗, #4ECDC4)
- Entertainment (🎬, #45B7D1)
- Bills & Utilities (💡, #96CEB4)
- Shopping (🛍️, #FFEAA7)
- Health & Medical (🏥, #DDA0DD)
- Education (📚, #98D8C8)
- Travel (✈️, #F7DC6F)
- Personal Care (💅, #BB8FCE)
- Other (📦, #AEB6BF)

=== TASK 5: Docker Setup ===

Using the DevOps Agent, create:

FILE: docker-compose.yml
---
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: expense_tracker_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: expense_tracker
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: expense_tracker_redis
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
---

FILE: Dockerfile (Backend)
---
FROM node:20-alpine AS base
RUN apk add --no-cache dumb-init
WORKDIR /app
COPY package*.json ./

FROM base AS dependencies
RUN npm ci

FROM base AS production
RUN npm ci --only=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]
---

=== TASK 6: Backend Entry Point ===

Create FILE: backend/src/server.js
- Express app setup with all middleware
- CORS configuration
- Helmet for security headers
- Morgan for logging
- Rate limiting
- Route mounting
- Error handler
- Prisma connection
- Server startup with proper logging

Create FILE: backend/src/config/env.js
- Validate all required env vars on startup
- Export organized config object
- Throw clear errors for missing required vars

Create FILE: backend/src/utils/errors.js
- AppError class (base)
- ValidationError (400)
- UnauthorizedError (401)
- ForbiddenError (403)
- NotFoundError (404)
- ConflictError (409)

Create FILE: backend/src/middleware/errorHandler.js
- Global error handler middleware
- Handle Prisma errors
- Handle JWT errors
- Handle validation errors
- Different responses for dev vs production

Create FILE: backend/src/middleware/asyncHandler.js
- Wrapper to avoid try/catch in every controller

=== TASK 7: Tailwind Configuration ===

Update FILE: frontend/tailwind.config.js
- Add custom colors for expense categories
- Add custom fonts
- Configure content paths for purging
- Add expense-specific theme extensions

=== TASK 8: Vite Configuration ===

Update FILE: frontend/vite.config.js
- Add path aliases (@/components, @/services, etc.)
- Configure proxy for API calls to backend
- Optimize build settings

=== TASK 9: Package.json Scripts ===

Update FILE: backend/package.json scripts:
- "dev": "nodemon src/server.js"
- "start": "node src/server.js"
- "test": "jest --coverage"
- "test:watch": "jest --watch"
- "db:migrate": "prisma migrate dev"
- "db:seed": "node prisma/seed.js"
- "db:studio": "prisma studio"
- "db:reset": "prisma migrate reset"
- "lint": "eslint src/"
- "format": "prettier --write src/"

Update FILE: frontend/package.json scripts:
- "dev": "vite"
- "build": "vite build"
- "preview": "vite preview"
- "test": "jest"
- "test:watch": "jest --watch"
- "test:coverage": "jest --coverage"
- "lint": "eslint src/"
- "format": "prettier --write src/"

=== TASK 10: README ===

Create FILE: README.md with:
- Project overview and features
- Tech stack
- Prerequisites
- Step-by-step setup instructions
- How to run development environment
- How to run tests
- API documentation link
- Screenshots placeholder
- Contributing guidelines

=== VERIFICATION CHECKLIST ===
After completing Phase 1, verify:
[ ] Frontend runs: cd frontend && npm run dev (port 3000)
[ ] Backend runs: cd backend && npm run dev (port 5000)
[ ] PostgreSQL running in Docker: docker-compose up -d postgres
[ ] Prisma connected: cd backend && npx prisma db push
[ ] Seed data applied: npm run db:seed
[ ] .env files created from examples
```

---
## ✅ PHASE 1 EXPECTED OUTPUT
```
Files Created: ~25 files
Directories: ~30 folders
Docker: PostgreSQL + Redis containers ready
Database: Schema applied with 6 tables + seed data
Both servers: Running without errors
```

---

---

# ═══════════════════════════════════════
# PHASE 2: AUTHENTICATION SYSTEM
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 2"` in Claude Code
> **Agent:** Web Development Agent (Primary)
> **Duration:** Day 3-4
> **Goal:** Complete JWT authentication with register, login, logout, password reset

---

## PHASE 2 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 2: Authentication System
AGENT: Web Development Agent

=== BACKEND: Authentication API ===

TASK 1: Auth Routes
Create FILE: backend/src/routes/auth.routes.js
Endpoints:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh-token
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- GET  /api/auth/me (get current user)

TASK 2: Auth Controller
Create FILE: backend/src/controllers/auth.controller.js

register():
- Validate: name (2-100 chars), email (valid format), password (min 8, uppercase, lowercase, number, special char)
- Check if email already exists → throw ConflictError
- Hash password with bcrypt (saltRounds: 12)
- Create user in database
- Generate JWT access token (7d) and refresh token (30d)
- Return user data (exclude password) + tokens
- Set refresh token in httpOnly cookie

login():
- Validate email and password
- Find user by email
- Compare password with bcrypt
- If invalid → throw UnauthorizedError (do NOT say which field is wrong - security)
- Rate limit: max 5 attempts per 15 min
- Generate new access + refresh tokens
- Return user data + tokens
- Set refresh token in httpOnly cookie

logout():
- Clear refresh token cookie
- Return success message

refreshToken():
- Read refresh token from cookie
- Verify refresh token JWT
- Find user by ID from token
- Generate new access token
- Return new access token

forgotPassword():
- Find user by email
- Generate password reset token (crypto.randomBytes)
- Store hashed token + expiry (1 hour) in database
- Send email with reset link
- Always return same message (security - don't reveal if email exists)

resetPassword():
- Validate token and new password
- Find user by hashed token (not expired)
- Hash new password
- Update user
- Clear reset token
- Return success

getMe():
- Protected route (auth middleware required)
- Return current user data (exclude password)

TASK 3: Auth Middleware
Create FILE: backend/src/middleware/auth.middleware.js

authenticate():
- Extract Bearer token from Authorization header
- Verify JWT signature and expiry
- Find user in database
- Attach user to req.user
- Handle: missing token, invalid token, expired token, user not found

authorize(...roles):
- Check if req.user.role is in allowed roles
- For future role-based access

TASK 4: Auth Validation
Create FILE: backend/src/middleware/validation.middleware.js
Using express-validator:
- validateRegister: name, email, password strength rules
- validateLogin: email, password required
- validateForgotPassword: email required
- validateResetPassword: token, password, confirmPassword match
- checkValidation: middleware to handle validation errors

TASK 5: Token Utilities
Create FILE: backend/src/utils/jwt.js
- generateAccessToken(userId): returns JWT (7d)
- generateRefreshToken(userId): returns JWT (30d)
- verifyAccessToken(token): returns decoded payload
- verifyRefreshToken(token): returns decoded payload

Create FILE: backend/src/utils/password.js
- hashPassword(password): bcrypt hash
- comparePassword(password, hash): bcrypt compare
- validatePasswordStrength(password): returns errors array
  Rules: min 8 chars, uppercase, lowercase, number, special char

=== FRONTEND: Authentication UI ===

TASK 6: Auth Context
Create FILE: frontend/src/context/AuthContext.jsx
- user state
- isAuthenticated
- isLoading
- login(email, password) function
- register(name, email, password) function
- logout() function
- refreshToken() function
- Persist auth state in localStorage
- Auto-refresh token before expiry
- Provider component

TASK 7: Auth Service
Create FILE: frontend/src/services/auth.service.js
- register(name, email, password): POST /api/auth/register
- login(email, password): POST /api/auth/login
- logout(): POST /api/auth/logout
- refreshToken(): POST /api/auth/refresh-token
- forgotPassword(email): POST /api/auth/forgot-password
- resetPassword(token, password): POST /api/auth/reset-password
- getMe(): GET /api/auth/me

TASK 8: API Instance
Create FILE: frontend/src/services/api.js
- Create axios instance with base URL from env
- Request interceptor: attach JWT token to all requests
- Response interceptor: handle 401 → auto-refresh token → retry request
- Handle refresh token failure → logout user
- Standardize error format

TASK 9: Login Component
Create FILE: frontend/src/components/Auth/LoginForm.jsx
- Email and password fields
- Form validation (react-hook-form)
- Show/hide password toggle
- "Remember me" checkbox
- Forgot password link
- Submit button with loading state
- Error display
- Link to register
- PropTypes validation
- Full JSDoc comments

Create FILE: frontend/src/components/Auth/LoginForm.test.jsx
Tests:
- Renders correctly
- Validates required fields
- Validates email format
- Submits with correct data
- Shows loading state
- Displays error on failure
- Navigates on success

TASK 10: Register Component
Create FILE: frontend/src/components/Auth/RegisterForm.jsx
- Name, email, password, confirm password fields
- Real-time password strength indicator
- Password match validation
- Terms acceptance checkbox
- Submit with loading state
- Error display
- Link to login
- PropTypes validation

TASK 11: Forgot Password Component
Create FILE: frontend/src/components/Auth/ForgotPasswordForm.jsx
- Email field
- Submit sends reset link
- Success state (email sent message)
- Back to login link

TASK 12: Reset Password Component
Create FILE: frontend/src/components/Auth/ResetPasswordForm.jsx
- New password + confirm password fields
- Password strength indicator
- Token validation (from URL params)
- Success state → redirect to login

TASK 13: Protected Route
Create FILE: frontend/src/components/Common/ProtectedRoute.jsx
- Check if user is authenticated
- If not → redirect to /login
- If yes → render children
- Show loading spinner while checking auth

TASK 14: Auth Pages
Create FILE: frontend/src/pages/LoginPage.jsx
Create FILE: frontend/src/pages/RegisterPage.jsx
Create FILE: frontend/src/pages/ForgotPasswordPage.jsx
Create FILE: frontend/src/pages/ResetPasswordPage.jsx

Each page:
- Centered layout with card
- App logo/branding
- Form component
- Responsive design
- Tailwind CSS styling

TASK 15: App Router
Update FILE: frontend/src/App.jsx
- Setup React Router v6 routes
- Public routes: /login, /register, /forgot-password, /reset-password
- Protected routes: /dashboard, /expenses, /income, /budget, /analytics, /reports, /settings
- Wrap protected routes with ProtectedRoute
- Default redirect: / → /dashboard
- 404 page

TASK 16: Auth Tests (Backend)
Create FILE: backend/src/__tests__/auth.test.js
Integration tests using supertest:
- POST /api/auth/register: success, duplicate email, invalid data
- POST /api/auth/login: success, wrong password, wrong email
- GET /api/auth/me: with valid token, without token, with invalid token
- POST /api/auth/refresh-token: valid, expired, invalid
- POST /api/auth/logout: success

=== VERIFICATION CHECKLIST ===
[ ] Register: creates user, returns token
[ ] Login: returns token + user data
[ ] Protected routes: reject without token
[ ] Token refresh: works automatically
[ ] Password reset: email sent (check console in dev)
[ ] Frontend: register → login → dashboard flow works
[ ] All auth tests pass: npm test (backend)
```

---
## ✅ PHASE 2 EXPECTED OUTPUT
```
Files Created: ~20 files
API Endpoints: 6 auth endpoints fully working
Frontend: Login, Register, Forgot Password pages
Security: Rate limiting, password hashing, JWT
Tests: Auth integration tests passing
```

---

---

# ═══════════════════════════════════════
# PHASE 3: EXPENSE MANAGEMENT (CORE)
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 3"` in Claude Code
> **Agent:** Web Development Agent (Primary)
> **Duration:** Day 5-7
> **Goal:** Complete expense CRUD, categories, filtering, pagination

---

## PHASE 3 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 3: Expense Management System
AGENT: Web Development Agent

=== BACKEND: Expenses API ===

TASK 1: Category Routes & Controller
Create FILE: backend/src/routes/category.routes.js
Endpoints:
- GET  /api/categories         (get all: system + user custom)
- POST /api/categories         (create custom category)
- PUT  /api/categories/:id     (update - only own categories)
- DELETE /api/categories/:id   (delete - only own, not if has expenses)

Create FILE: backend/src/controllers/category.controller.js
getCategories():
- Return system defaults (userId = null) + user's custom categories
- Include expense count per category
- Include budget amount if budget exists

createCategory():
- Validate: name, icon, color required
- Check duplicate name for this user
- Create with userId from req.user.id

updateCategory():
- Only allow updating own categories (not system defaults)
- Validate ownership
- Update name, icon, color, budgetLimit

deleteCategory():
- Only allow deleting own categories
- Check if category has expenses → throw error with count
- Soft protection: suggest migration

TASK 2: Expense Routes & Controller
Create FILE: backend/src/routes/expense.routes.js
Endpoints:
- GET    /api/expenses          (list with filters + pagination)
- POST   /api/expenses          (create expense)
- GET    /api/expenses/:id      (get single)
- PUT    /api/expenses/:id      (update)
- DELETE /api/expenses/:id      (delete - soft delete)
- POST   /api/expenses/bulk     (bulk import from CSV)

Create FILE: backend/src/controllers/expense.controller.js

getExpenses():
Query parameters:
- page (default: 1)
- limit (default: 20, max: 100)
- startDate (ISO date)
- endDate (ISO date)
- categoryId (UUID)
- paymentMethod (cash/card/bank)
- minAmount (decimal)
- maxAmount (decimal)
- search (description search)
- sortBy (date/amount/description, default: date)
- sortOrder (asc/desc, default: desc)

Response format:
{
  success: true,
  data: expenses[],
  pagination: { page, limit, total, pages },
  summary: { totalAmount, count }
}

createExpense():
- Validate: amount (positive number), categoryId (valid UUID, exists, belongs to user or system), description (max 500 chars), date (valid date, not future by more than 1 day), paymentMethod (cash/card/bank)
- Verify category belongs to user or is system default
- Create expense
- If isRecurring → link to recurringId

getExpenseById():
- Find expense by ID
- Verify ownership (userId = req.user.id)
- Include category details

updateExpense():
- Find expense, verify ownership
- Validate updated fields
- Update expense

deleteExpense():
- Find expense, verify ownership
- Soft delete: set deletedAt = NOW()
- NOT a hard delete

bulkImport():
- Accept CSV file (multer)
- Parse CSV: date, amount, description, category (name match)
- Validate each row
- Skip invalid rows (collect errors)
- Insert valid rows in batch
- Return: { imported: N, failed: M, errors: [] }

TASK 3: Expense Validation
Create FILE: backend/src/middleware/expense.validation.js
- validateCreateExpense: all required fields
- validateUpdateExpense: at least one field
- validateBulkImport: file present, correct type

TASK 4: CSV Parser Service
Create FILE: backend/src/services/csvParser.service.js
- parseExpenseCSV(filePath): reads CSV file
- Expected columns: date, amount, description, category
- Maps category names to category IDs
- Returns array of valid expenses + array of errors
- Sample CSV template generation

=== FRONTEND: Expense Management UI ===

TASK 5: Expense Service
Create FILE: frontend/src/services/expense.service.js
- getExpenses(params): GET /api/expenses with query params
- createExpense(data): POST /api/expenses
- getExpense(id): GET /api/expenses/:id
- updateExpense(id, data): PUT /api/expenses/:id
- deleteExpense(id): DELETE /api/expenses/:id
- bulkImport(csvFile): POST /api/expenses/bulk (FormData)

Create FILE: frontend/src/services/category.service.js
- getCategories(): GET /api/categories
- createCategory(data): POST /api/categories
- updateCategory(id, data): PUT /api/categories/:id
- deleteCategory(id): DELETE /api/categories/:id

TASK 6: Custom Hooks
Create FILE: frontend/src/hooks/useExpenses.js
- useExpenses(filters): fetch + paginate expenses
- useExpense(id): fetch single expense
- useCreateExpense(): mutation + invalidate query
- useUpdateExpense(): mutation + invalidate query
- useDeleteExpense(): mutation + confirmation
- Use TanStack Query for caching

Create FILE: frontend/src/hooks/useCategories.js
- useCategories(): fetch all categories
- useCreateCategory(): mutation
- useUpdateCategory(): mutation
- useDeleteCategory(): mutation

TASK 7: ExpenseList Component
Create FILE: frontend/src/components/Expenses/ExpenseList.jsx
Features:
- Table/list view of expenses
- Columns: Date | Category Icon | Description | Amount | Payment Method | Actions
- Pagination controls (prev/next + page numbers)
- Loading skeleton while fetching
- Empty state with illustration and "Add first expense" button
- Responsive: table on desktop, cards on mobile
- Row hover effects
- Sort by clicking column headers
- PropTypes validation

TASK 8: ExpenseFilters Component
Create FILE: frontend/src/components/Expenses/ExpenseFilters.jsx
Filters:
- Date range picker (start date, end date)
- Category dropdown (multi-select)
- Payment method (checkboxes: cash, card, bank)
- Amount range (min, max)
- Search input (description)
- Clear all filters button
- Active filter badges/chips
- Collapsible on mobile

TASK 9: ExpenseForm Component
Create FILE: frontend/src/components/Expenses/ExpenseForm.jsx
Fields:
- Amount (number input with currency symbol)
- Category (searchable dropdown with icons/colors)
- Description (text input, required)
- Date (date picker, default today)
- Payment method (radio: cash/card/bank)
- Is recurring toggle (shows frequency dropdown if yes)
- Notes/additional info (optional textarea)
- Submit + Cancel buttons
- Form validation with react-hook-form
- Loading state on submit
- Error display per field
- Works for both CREATE and EDIT (mode prop)
- PropTypes validation

TASK 10: CategoryPicker Component
Create FILE: frontend/src/components/Common/CategoryPicker.jsx
- Searchable dropdown
- Show category icon + color + name
- Group: System defaults | My custom categories
- Add new category option (opens modal)
- Keyboard navigation
- PropTypes validation

TASK 11: ExpenseCard Component
Create FILE: frontend/src/components/Expenses/ExpenseCard.jsx
Mobile card view:
- Category color bar on left
- Category icon + name
- Description (truncated)
- Amount (bold, right aligned)
- Date + payment method (small text)
- Edit + Delete actions (swipe or dots menu)
- PropTypes validation

TASK 12: DeleteConfirmation Component
Create FILE: frontend/src/components/Common/DeleteConfirmation.jsx
- Modal dialog
- Warning icon
- "Are you sure?" message
- What will be deleted
- Cancel and Confirm buttons
- Loading state on confirm
- PropTypes validation

TASK 13: BulkImportModal Component
Create FILE: frontend/src/components/Expenses/BulkImportModal.jsx
- File upload dropzone (drag & drop)
- CSV format guide + download template link
- Preview first 5 rows of uploaded CSV
- Import progress bar
- Results: X imported, Y failed
- Error details for failed rows
- PropTypes validation

TASK 14: Expenses Page
Create FILE: frontend/src/pages/ExpensesPage.jsx
Layout:
- Page header with title + "Add Expense" button
- Summary cards: This month total, Count, Largest expense
- Filters sidebar (collapsible on mobile)
- ExpenseList (main content)
- "Add Expense" floating button (mobile)
- "Import CSV" button
- Modal for add/edit form

TASK 15: Expense Tests (Frontend)
Create FILE: frontend/src/components/Expenses/ExpenseForm.test.jsx
Tests:
- Renders all fields
- Validates required fields
- Validates positive amount
- Submits correct data on create
- Populates fields on edit mode
- Shows loading on submit

Create FILE: backend/src/__tests__/expense.test.js
Integration tests:
- GET /api/expenses: list, filters, pagination
- POST /api/expenses: create valid, create invalid
- PUT /api/expenses/:id: update own, reject other's
- DELETE /api/expenses/:id: soft delete own
- Auth required for all routes

=== VERIFICATION CHECKLIST ===
[ ] Create expense → appears in list
[ ] Edit expense → changes saved
[ ] Delete expense → removed from list (soft)
[ ] Filters work: date range, category, amount
[ ] Pagination works
[ ] CSV import works with sample file
[ ] Category CRUD works
[ ] Auth protection works
[ ] All tests pass
```

---
## ✅ PHASE 3 EXPECTED OUTPUT
```
Files Created: ~25 files
API Endpoints: 10 endpoints (categories + expenses)
Frontend: Full expense management with CRUD
Features: Filtering, pagination, CSV import, categories
Tests: Frontend component + backend integration tests
```

---

---

# ═══════════════════════════════════════
# PHASE 4: INCOME & BUDGET MANAGEMENT
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 4"` in Claude Code
> **Agent:** Web Development Agent (Primary)
> **Duration:** Day 8-9
> **Goal:** Income tracking, budget creation, recurring expenses, budget alerts

---

## PHASE 4 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 4: Income Tracking & Budget Management
AGENT: Web Development Agent

=== BACKEND: Income API ===

TASK 1: Income Routes & Controller
Create FILE: backend/src/routes/income.routes.js
Endpoints:
- GET    /api/income        (list with filters + pagination)
- POST   /api/income        (create income entry)
- GET    /api/income/:id    (get single)
- PUT    /api/income/:id    (update)
- DELETE /api/income/:id    (soft delete)

Create FILE: backend/src/controllers/income.controller.js
getIncome():
- Filters: startDate, endDate, source, isRecurring
- Pagination: page, limit
- Summary: total for period

createIncome():
- Validate: amount (positive), source (salary/freelance/investment/other/rental/business), date, description (optional)
- Create income record

updateIncome(), deleteIncome(): same pattern as expenses

=== BACKEND: Budget API ===

TASK 2: Budget Routes & Controller
Create FILE: backend/src/routes/budget.routes.js
Endpoints:
- GET    /api/budgets         (get all budgets with current status)
- POST   /api/budgets         (create budget)
- PUT    /api/budgets/:id     (update budget)
- DELETE /api/budgets/:id     (delete budget)
- GET    /api/budgets/status  (get all budgets with spent amount + percentage)
- GET    /api/budgets/alerts  (get budgets over 80% or exceeded)

Create FILE: backend/src/controllers/budget.controller.js

getBudgets():
- Return all budgets for user
- Include category details
- Include spent amount for current period
- Calculate percentage used

getBudgetStatus():
- For each budget, calculate:
  - budgetAmount: the limit set
  - spentAmount: actual expenses in period
  - remainingAmount: budget - spent
  - percentageUsed: (spent/budget) * 100
  - status: 'good' (< 70%), 'warning' (70-99%), 'exceeded' (>= 100%)
- Sort by percentageUsed DESC

getBudgetAlerts():
- Return budgets where percentageUsed >= 80%
- Group by: warning (80-99%), exceeded (100%+)

createBudget():
- Validate: categoryId, amount (positive), period (monthly/yearly)
- Check: no duplicate budget for same user+category+period
- Set startDate to start of current period

updateBudget():
- Update amount, period
- Recalculate status

=== BACKEND: Recurring Expenses API ===

TASK 3: Recurring Expense Routes & Controller
Create FILE: backend/src/routes/recurring.routes.js
Endpoints:
- GET    /api/recurring        (list recurring templates)
- POST   /api/recurring        (create recurring template)
- PUT    /api/recurring/:id    (update template)
- DELETE /api/recurring/:id    (deactivate - not hard delete)
- POST   /api/recurring/process (process due recurring expenses - cron)

Create FILE: backend/src/controllers/recurring.controller.js

getRecurring():
- List all active recurring expenses
- Include next occurrence date
- Include category details

createRecurring():
- Validate: amount, categoryId, description, frequency (daily/weekly/monthly/yearly), startDate
- Calculate next occurrence
- Create template

processRecurring():
- Find all active recurring expenses where nextOccurrence <= TODAY
- Create actual expense records
- Update nextOccurrence based on frequency
- Return count of processed

Create FILE: backend/src/services/recurring.service.js
- calculateNextOccurrence(date, frequency): returns next date
- processAllDueRecurring(): runs all due expenses
- scheduleRecurring(): set up simple interval (no cron needed for now)

=== FRONTEND: Income UI ===

TASK 4: Income Service & Hooks
Create FILE: frontend/src/services/income.service.js
- getIncome(params)
- createIncome(data)
- updateIncome(id, data)
- deleteIncome(id)

Create FILE: frontend/src/hooks/useIncome.js
- useIncome(filters): with TanStack Query
- useCreateIncome(): mutation
- useUpdateIncome(): mutation
- useDeleteIncome(): mutation

TASK 5: Income Components
Create FILE: frontend/src/components/Income/IncomeForm.jsx
Fields:
- Amount (number input)
- Source (dropdown: Salary, Freelance, Investment, Rental, Business, Other)
- Description (optional text)
- Date (date picker)
- Is recurring toggle
- Frequency if recurring
- PropTypes validation

Create FILE: frontend/src/components/Income/IncomeList.jsx
- Table with: Date | Source | Description | Amount | Actions
- Monthly total at top
- Year-to-date total
- Pagination
- Loading skeleton
- Empty state
- PropTypes validation

Create FILE: frontend/src/components/Income/IncomeSummary.jsx
Summary cards:
- This month total
- Last month total
- Year-to-date total
- Average monthly income
- PropTypes validation

TASK 6: Income Page
Create FILE: frontend/src/pages/IncomePage.jsx
- Page header + "Add Income" button
- IncomeSummary cards
- IncomeList with filters
- Add/Edit modal

=== FRONTEND: Budget UI ===

TASK 7: Budget Service & Hooks
Create FILE: frontend/src/services/budget.service.js
- getBudgets()
- getBudgetStatus()
- getBudgetAlerts()
- createBudget(data)
- updateBudget(id, data)
- deleteBudget(id)

Create FILE: frontend/src/hooks/useBudgets.js
- useBudgets(): fetch all
- useBudgetStatus(): fetch with spending data
- useBudgetAlerts(): fetch alerts only

TASK 8: BudgetCard Component
Create FILE: frontend/src/components/Budget/BudgetCard.jsx
Display:
- Category icon + color + name
- Budget amount vs spent amount
- Progress bar (color: green < 70%, yellow 70-99%, red >= 100%)
- Remaining amount
- Days left in period
- Edit + Delete actions
- Alert badge if exceeded
- PropTypes validation

TASK 9: BudgetProgressBar Component
Create FILE: frontend/src/components/Budget/BudgetProgressBar.jsx
- Animated progress bar
- Color changes based on percentage
- Shows percentage label
- Tooltip with exact amounts
- PropTypes validation

TASK 10: BudgetForm Component
Create FILE: frontend/src/components/Budget/BudgetForm.jsx
Fields:
- Category picker (only categories without existing budget)
- Budget amount (with monthly/yearly toggle)
- Period selector (monthly/yearly)
- Optional: custom start date
- PropTypes validation

TASK 11: BudgetAlerts Component
Create FILE: frontend/src/components/Budget/BudgetAlerts.jsx
- Alert banner at top of budget page
- List of exceeded budgets
- List of warning budgets (>80%)
- Dismiss individual alerts
- Quick link to adjust budget
- PropTypes validation

TASK 12: Budget Page
Create FILE: frontend/src/pages/BudgetPage.jsx
Layout:
- BudgetAlerts (if any)
- Summary: Total budgeted | Total spent | On track | Over budget
- Budget cards grid (2 columns desktop, 1 mobile)
- "Add Budget" button
- Empty state with guide

TASK 13: Recurring Expenses Page
Create FILE: frontend/src/pages/RecurringPage.jsx
- List of recurring expense templates
- Show: amount, category, frequency, next date, status (active/inactive)
- Toggle active/inactive
- Edit and delete
- "Add Recurring" button

=== FRONTEND: Common Components ===

TASK 14: Common Components

Create FILE: frontend/src/components/Common/PageHeader.jsx
- Title
- Subtitle (optional)
- Action buttons slot
- Breadcrumb (optional)
- PropTypes validation

Create FILE: frontend/src/components/Common/SummaryCard.jsx
- Icon + color
- Title
- Value (large font)
- Subtitle/comparison (optional, with up/down arrow)
- Loading skeleton state
- PropTypes validation

Create FILE: frontend/src/components/Common/DataTable.jsx
- Headers with sort arrows
- Rows with hover
- Loading skeleton rows
- Empty state
- Responsive (horizontal scroll on mobile)
- PropTypes validation

Create FILE: frontend/src/components/Common/Pagination.jsx
- Previous + Next buttons
- Page numbers (show 5 max)
- Items per page selector
- Total count display
- PropTypes validation

Create FILE: frontend/src/components/Common/Modal.jsx
- Overlay + centered card
- Header with title + close button
- Body slot
- Footer slot
- Click outside to close
- Escape key to close
- Trap focus inside
- PropTypes validation

Create FILE: frontend/src/components/Common/LoadingSkeleton.jsx
- Multiple skeleton variants: text, card, table-row, chart
- Animated shimmer effect
- PropTypes validation

Create FILE: frontend/src/components/Common/EmptyState.jsx
- Illustration (simple SVG)
- Title
- Description
- Action button (optional)
- PropTypes validation

TASK 15: Layout Component
Create FILE: frontend/src/components/Common/Layout.jsx
- Sidebar navigation (desktop)
- Top navigation bar
- Mobile hamburger menu
- Navigation items:
  Dashboard | Expenses | Income | Budget | Analytics | Reports | Settings
- User avatar + name in sidebar bottom
- Logout button
- Active route highlighting
- PropTypes validation

Create FILE: frontend/src/components/Common/Sidebar.jsx
- Navigation links with icons (lucide-react)
- Active state styling
- Collapsed state (icon only) on small desktop
- PropTypes validation

Create FILE: frontend/src/components/Common/Navbar.jsx
- App name/logo
- Page title (from current route)
- Budget alerts badge (if any)
- User menu dropdown (profile, settings, logout)
- Mobile menu button
- PropTypes validation

=== VERIFICATION CHECKLIST ===
[ ] Add income → appears in list + total updates
[ ] Create budget → shows with progress bar
[ ] Spend near budget → progress bar turns yellow
[ ] Exceed budget → alert appears, bar turns red
[ ] Recurring expense → template created
[ ] Process recurring → expense auto-created
[ ] Layout: sidebar navigation works
[ ] All pages accessible and navigable
[ ] Responsive layout on mobile
```

---
## ✅ PHASE 4 EXPECTED OUTPUT
```
Files Created: ~30 files
API Endpoints: 15+ endpoints (income, budget, recurring)
Frontend: Income, Budget, Recurring pages
Features: Budget tracking, alerts, progress bars, recurring
Components: Complete UI component library
```

---

---

# ═══════════════════════════════════════
# PHASE 5: ANALYTICS & DASHBOARD
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 5"` in Claude Code
> **Agent:** Data Analysis Agent (Primary) + Web Development Agent (Secondary)
> **Duration:** Day 10-12
> **Goal:** Dashboard, charts, analytics, AI-powered insights

---

## PHASE 5 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 5: Analytics, Charts & Dashboard
AGENTS: Data Analysis Agent (Primary) + Web Development Agent (Secondary)

=== BACKEND: Analytics API ===

TASK 1: Analytics Routes
Create FILE: backend/src/routes/analytics.routes.js
Endpoints:
- GET /api/analytics/summary           (monthly overview)
- GET /api/analytics/trends            (spending over time)
- GET /api/analytics/category-breakdown (by category)
- GET /api/analytics/insights          (smart pattern insights)
- GET /api/analytics/comparison        (this month vs last month)
- GET /api/analytics/income-vs-expense (income vs expense over time)

TASK 2: Analytics Controller
Create FILE: backend/src/controllers/analytics.controller.js

getSummary():
Query: ?month=2024-01 (default: current month)
Return:
{
  period: { start, end },
  totalExpenses: decimal,
  totalIncome: decimal,
  netSavings: decimal,
  savingsRate: percentage,
  expenseCount: number,
  topCategory: { name, amount, percentage },
  budgetStatus: { onTrack, warning, exceeded },
  vsLastMonth: {
    expenseChange: percentage,
    incomeChange: percentage
  }
}

getTrends():
Query: ?period=6months or ?period=12months or ?startDate=&endDate=
Return: Array of { month, totalExpenses, totalIncome, netSavings }

getCategoryBreakdown():
Query: ?month=2024-01
Return: Array of {
  categoryId, categoryName, categoryColor, categoryIcon,
  amount, percentage, transactionCount,
  budgetAmount (if exists), budgetPercentageUsed
}

getInsights():
Using Data Analysis Agent logic, generate rule-based insights:

Rule 1: Weekend vs Weekday Spending
- Calculate avg daily spending: weekends vs weekdays
- If weekends > weekdays * 1.3 → "You spend X% more on weekends"

Rule 2: Category Month-over-Month
- Compare each category: this month vs last month
- If increase > $20 and > 20% → "Your [category] spending increased by $X"
- If decrease > $20 → "Great! You reduced [category] spending by $X"

Rule 3: Budget Performance
- Find categories exceeding budget → "You've exceeded your [category] budget by $X"
- Find categories well under budget → "You're saving well on [category]"

Rule 4: Savings Rate
- Calculate: (income - expenses) / income * 100
- < 0% → "You're spending more than you earn this month"
- 0-10% → "Try to save at least 20% of income"
- 10-20% → "Good savings rate! Try to reach 20%"
- > 20% → "Excellent! You're saving X% of your income"

Rule 5: Unusual Expenses
- Find expenses > 2x the average for that category → "Unusual expense detected in [category]"

Rule 6: Recurring Cost Reminder
- List active recurring expenses with next occurrence this week

Rule 7: Month Projection
- Based on spending in first N days → project full month spending
- "At this rate, you'll spend $X this month (X% of income)"

Return array of insight objects:
{
  type: 'pattern'|'alert'|'achievement'|'suggestion'|'projection',
  title: string,
  message: string,
  severity: 'info'|'warning'|'success'|'danger',
  icon: string,
  amount: decimal (optional),
  percentage: decimal (optional)
}

getComparison():
Return side-by-side: this month vs last month
By category: amount this month, amount last month, change

getIncomeVsExpense():
Last 12 months bar chart data

TASK 3: Analytics Service
Create FILE: backend/src/services/analytics.service.js
- getMonthExpenses(userId, year, month): helper
- getMonthIncome(userId, year, month): helper
- groupByCategory(expenses): helper
- groupByDay(expenses): helper
- groupByWeek(expenses): helper
- calculateTrends(months): helper
- generateInsights(userId, month): rule engine

=== FRONTEND: Analytics UI ===

TASK 4: Analytics Service
Create FILE: frontend/src/services/analytics.service.js
- getSummary(month)
- getTrends(period)
- getCategoryBreakdown(month)
- getInsights()
- getComparison()
- getIncomeVsExpense()

Create FILE: frontend/src/hooks/useAnalytics.js
- useSummary(month)
- useTrends(period)
- useCategoryBreakdown(month)
- useInsights()
- useComparison()

TASK 5: Dashboard Page
Create FILE: frontend/src/pages/DashboardPage.jsx
Layout (top to bottom):
1. Welcome header with current date
2. Month selector (prev/next month)
3. Summary cards row (4 cards)
4. Budget alerts (if any)
5. Charts row: Pie chart (left) + Line chart (right)
6. AI Insights cards
7. Recent transactions table (last 10)
8. Quick action buttons

TASK 6: Summary Cards
Create FILE: frontend/src/components/Dashboard/SummaryCards.jsx
4 cards:
- Total Expenses: amount + vs last month arrow
- Total Income: amount + vs last month arrow
- Net Savings: amount + positive/negative color
- Savings Rate: percentage + progress circle
- Loading skeleton state
- PropTypes validation

TASK 7: Pie Chart Component
Create FILE: frontend/src/components/Charts/ExpensePieChart.jsx
Using Recharts PieChart:
- Category breakdown as donut chart
- Custom legend with amounts + percentages
- Hover tooltip with details
- Click to filter (optional)
- Total in center
- Animate on load
- Responsive container
- Empty state
- PropTypes validation

TASK 8: Line Chart Component
Create FILE: frontend/src/components/Charts/SpendingTrendChart.jsx
Using Recharts LineChart:
- Multiple lines: Expenses + Income + Savings
- X axis: months
- Y axis: currency amounts
- Tooltip with all values
- Legend
- Period selector: 3M / 6M / 12M
- Responsive container
- Animate on load
- PropTypes validation

TASK 9: Bar Chart Component
Create FILE: frontend/src/components/Charts/MonthlyComparisonChart.jsx
Using Recharts BarChart:
- Grouped bars: This month vs Last month
- Per category
- Tooltip with difference
- Color coding
- Responsive container
- PropTypes validation

TASK 10: Income vs Expense Chart
Create FILE: frontend/src/components/Charts/IncomeVsExpenseChart.jsx
Using Recharts ComposedChart:
- Bars for income and expenses
- Line for net savings
- Last 12 months
- Responsive
- PropTypes validation

TASK 11: Category Breakdown Table
Create FILE: frontend/src/components/Analytics/CategoryBreakdown.jsx
- Table: Category | Amount | % of Total | Budget | Status
- Sort by amount desc
- Color-coded status indicators
- Mini progress bars
- Expandable rows (show top 3 expenses in category)
- PropTypes validation

TASK 12: InsightCard Component
Create FILE: frontend/src/components/Analytics/InsightCard.jsx
- Icon based on type (info, warning, success, danger)
- Title (bold)
- Message (description)
- Colored border/background based on severity
- Amount highlight if present
- PropTypes validation

TASK 13: InsightsPanel Component
Create FILE: frontend/src/components/Analytics/InsightsPanel.jsx
- Grid of InsightCards
- Group by severity (critical first)
- Empty state: "No insights yet. Add more expenses to see patterns"
- Loading skeleton
- Refresh button
- PropTypes validation

TASK 14: RecentTransactions Component
Create FILE: frontend/src/components/Dashboard/RecentTransactions.jsx
- Last 10 transactions
- Category icon + name
- Description
- Amount (expenses red, income green)
- Date
- "View all" link → expenses page
- Loading skeleton
- PropTypes validation

TASK 15: Analytics Page
Create FILE: frontend/src/pages/AnalyticsPage.jsx
Full analytics view:
- Month/Year selector
- Summary section
- Tab navigation: Overview | Trends | Categories | Insights
- Overview tab: charts grid
- Trends tab: SpendingTrendChart full width + period selector
- Categories tab: CategoryBreakdown full table
- Insights tab: InsightsPanel full width
- Export charts as PNG button

=== VERIFICATION CHECKLIST ===
[ ] Dashboard loads with real data from API
[ ] Pie chart shows category breakdown correctly
[ ] Line chart shows trends over 6 months
[ ] Insights generate based on spending patterns
[ ] Month selector changes all data
[ ] Budget alerts show on dashboard
[ ] Recent transactions link to expenses page
[ ] Analytics page tabs all work
[ ] Charts are responsive on mobile
[ ] All data loads with proper loading states
```

---
## ✅ PHASE 5 EXPECTED OUTPUT
```
Files Created: ~20 files
API Endpoints: 6 analytics endpoints
Frontend: Dashboard + Analytics pages
Charts: Pie, Line, Bar, Composed charts (Recharts)
Insights: 7 rule-based insight generators
Features: Monthly comparison, trends, projections
```

---

---

# ═══════════════════════════════════════
# PHASE 6: REPORTS & EXPORT
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 6"` in Claude Code
> **Agent:** Data Analysis Agent (Primary) + Web Development Agent (Secondary)
> **Duration:** Day 13-14
> **Goal:** Report generation, CSV/PDF export, custom date ranges

---

## PHASE 6 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 6: Reports & Export System
AGENTS: Data Analysis Agent (Primary) + Web Development Agent (Secondary)

=== BACKEND: Reports API ===

TASK 1: Reports Routes
Create FILE: backend/src/routes/reports.routes.js
Endpoints:
- GET  /api/reports/monthly     (?year=2024&month=1)
- GET  /api/reports/yearly      (?year=2024)
- GET  /api/reports/custom      (?startDate=&endDate=)
- POST /api/reports/export/csv  (export expenses as CSV)
- POST /api/reports/export/pdf  (generate PDF report)

TASK 2: Reports Controller
Create FILE: backend/src/controllers/reports.controller.js

getMonthlyReport():
Comprehensive monthly summary:
{
  period: { year, month, label: "January 2024" },
  summary: { totalExpenses, totalIncome, netSavings, savingsRate },
  categoryBreakdown: [...],
  dailyBreakdown: [...],  // day-by-day spending
  topExpenses: [...],     // top 5 largest
  budgetPerformance: [...], // budget vs actual
  incomeBySource: [...],
  insights: [...],
  previousMonthComparison: {...}
}

getYearlyReport():
{
  year: 2024,
  summary: { totalExpenses, totalIncome, netSavings, avgMonthlySpend },
  monthlyBreakdown: [...],  // Jan-Dec
  categoryBreakdown: [...],
  topMonths: { highest, lowest },
  trends: { ...}
}

getCustomReport():
Same as monthly but for any date range

exportCSV():
- Generate CSV with all expenses in date range
- Columns: Date, Category, Description, Amount, Payment Method
- Include totals row at bottom
- Return as file download (Content-Disposition: attachment)

exportPDF():
Using PDFKit:
Generate PDF with:
- Header: SmartExpense Tracker logo text, report title, period, generated date
- Summary section: key metrics in boxes
- Category breakdown table
- Monthly trend (text-based bar chart)
- Top expenses list
- Footer: page numbers
- Return as file download

TASK 3: PDF Service
Create FILE: backend/src/services/pdf.service.js
- generateMonthlyReport(data): creates PDF buffer
- generateYearlyReport(data): creates PDF buffer
- addHeader(doc, title, period): helper
- addSummarySection(doc, summary): helper
- addCategoryTable(doc, categories): helper
- addTopExpenses(doc, expenses): helper
- addFooter(doc): helper

TASK 4: CSV Service
Create FILE: backend/src/services/csv.service.js
- generateExpensesCSV(expenses): returns CSV string
- generateReportCSV(reportData): full report as CSV
- formatCurrency(amount, currency): helper
- parseIncomingCSV(fileBuffer): parse imported CSV

=== FRONTEND: Reports UI ===

TASK 5: Reports Service
Create FILE: frontend/src/services/reports.service.js
- getMonthlyReport(year, month)
- getYearlyReport(year)
- getCustomReport(startDate, endDate)
- exportCSV(params): triggers file download
- exportPDF(params): triggers file download

Create FILE: frontend/src/hooks/useReports.js
- useMonthlyReport(year, month)
- useYearlyReport(year)
- useCustomReport(dateRange)

TASK 6: ReportSummary Component
Create FILE: frontend/src/components/Reports/ReportSummary.jsx
- Key metrics in cards
- Period label
- Comparison indicators
- Print-friendly styling
- PropTypes validation

TASK 7: ReportCategoryTable Component
Create FILE: frontend/src/components/Reports/ReportCategoryTable.jsx
- Full category breakdown table
- Columns: Category | Transactions | Total | % of Spending | Budget | Status
- Sortable
- Totals row
- Color-coded status
- PropTypes validation

TASK 8: DailyBreakdownChart Component
Create FILE: frontend/src/components/Reports/DailyBreakdownChart.jsx
Using Recharts BarChart:
- Day-by-day spending for the month
- Highlight highest spending day
- Average line overlay
- Tooltip with date + amount
- PropTypes validation

TASK 9: ExportButtons Component
Create FILE: frontend/src/components/Reports/ExportButtons.jsx
- Export CSV button with download icon
- Export PDF button with download icon
- Loading state during export
- Success toast on completion
- Error handling
- PropTypes validation

TASK 10: DateRangePicker Component
Create FILE: frontend/src/components/Common/DateRangePicker.jsx
- Two date inputs (start, end)
- Preset ranges: This month, Last month, Last 3 months, Last 6 months, This year
- Custom range option
- Validation: end > start, not future dates
- PropTypes validation

TASK 11: Reports Page
Create FILE: frontend/src/pages/ReportsPage.jsx
Layout:
- Tab navigation: Monthly | Yearly | Custom
- Monthly tab:
  - Month/Year selector
  - Generate button
  - ReportSummary cards
  - DailyBreakdownChart
  - ReportCategoryTable
  - ExportButtons
- Yearly tab:
  - Year selector
  - Annual summary
  - Monthly trend chart (all 12 months)
  - Category totals for year
  - ExportButtons
- Custom tab:
  - DateRangePicker
  - Generate button
  - Report display
  - ExportButtons
- Print page button (window.print())
- Print CSS: hide navigation, show report full width

TASK 12: Toast Notification Component
Create FILE: frontend/src/components/Common/Toast.jsx
- Success, Error, Warning, Info variants
- Auto-dismiss after 3s
- Stack multiple toasts
- Close button
- Slide-in animation
- PropTypes validation

Create FILE: frontend/src/context/ToastContext.jsx
- showToast(message, type, duration) function
- Provider component
- Hook: useToast()

=== VERIFICATION CHECKLIST ===
[ ] Monthly report generates with all sections
[ ] Yearly report shows all 12 months
[ ] Custom date range report works
[ ] CSV downloads with correct data
[ ] PDF generates and downloads
[ ] PDF has proper formatting and all sections
[ ] Print mode hides navigation
[ ] Toast notifications appear correctly
[ ] Date range picker validates correctly
[ ] Reports page responsive on mobile
```

---
## ✅ PHASE 6 EXPECTED OUTPUT
```
Files Created: ~15 files
API Endpoints: 5 report endpoints
Frontend: Reports page with 3 report types
Export: CSV and PDF generation working
Features: Monthly, yearly, custom reports + export
```

---

---

# ═══════════════════════════════════════
# PHASE 7: SETTINGS & USER PROFILE
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 7"` in Claude Code
> **Agent:** Web Development Agent (Primary)
> **Duration:** Day 15
> **Goal:** User profile, app settings, category management

---

## PHASE 7 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 7: Settings & User Profile
AGENT: Web Development Agent

=== BACKEND: User Profile API ===

TASK 1: User Routes
Create FILE: backend/src/routes/user.routes.js
Endpoints:
- GET    /api/users/profile          (get profile)
- PUT    /api/users/profile          (update profile)
- PUT    /api/users/change-password  (change password)
- DELETE /api/users/account          (delete account)
- GET    /api/users/stats            (user statistics)

Create FILE: backend/src/controllers/user.controller.js

getProfile():
- Return user data (excluding passwordHash)
- Include: totalExpenses count, totalIncome count, accountAge

updateProfile():
- Validate: name (2-100 chars), currency (USD/EUR/GBP/etc.)
- Update user record
- Return updated profile

changePassword():
- Validate current password matches
- Validate new password strength
- Hash new password
- Update user record
- Invalidate all existing sessions (optional)

deleteAccount():
- Require password confirmation
- Soft delete: set deletedAt on user
- Schedule hard delete after 30 days (just set flag)
- Return confirmation

getUserStats():
{
  totalExpenses: count,
  totalExpensesAmount: decimal,
  totalIncome: count,
  totalIncomeAmount: decimal,
  topCategory: { name, amount },
  accountCreated: date,
  daysActive: number,
  budgetsCreated: count,
  categoriesCreated: count
}

=== FRONTEND: Settings UI ===

TASK 2: User Service
Create FILE: frontend/src/services/user.service.js
- getProfile()
- updateProfile(data)
- changePassword(currentPassword, newPassword)
- deleteAccount(password)
- getUserStats()

TASK 3: ProfileForm Component
Create FILE: frontend/src/components/Settings/ProfileForm.jsx
Fields:
- Name (text input)
- Email (display only, not editable)
- Currency preference (select: USD, EUR, GBP, INR, CAD, AUD)
- Save button
- Success/error messages
- PropTypes validation

TASK 4: ChangePasswordForm Component
Create FILE: frontend/src/components/Settings/ChangePasswordForm.jsx
Fields:
- Current password
- New password (with strength indicator)
- Confirm new password
- Submit button
- Loading state
- Clear on success
- PropTypes validation

TASK 5: DangerZone Component
Create FILE: frontend/src/components/Settings/DangerZone.jsx
- Delete account button (red, outlined)
- Confirmation modal: type "DELETE" to confirm + password
- Warning about data loss
- PropTypes validation

TASK 6: UserStats Component
Create FILE: frontend/src/components/Settings/UserStats.jsx
- Stat cards: Total Transactions, Total Tracked, Account Age, Categories
- Visual and informative
- PropTypes validation

TASK 7: CategoryManager Component
Create FILE: frontend/src/components/Settings/CategoryManager.jsx
- List all user custom categories
- Show: icon, color, name, expense count
- Edit button (inline edit)
- Delete button (disabled if has expenses)
- Add new category button
- Color picker for category color
- Emoji/icon picker for category icon
- PropTypes validation

TASK 8: Settings Page
Create FILE: frontend/src/pages/SettingsPage.jsx
Tab navigation:
- Profile: ProfileForm + UserStats
- Security: ChangePasswordForm
- Categories: CategoryManager
- Danger Zone: DangerZone

=== VERIFICATION CHECKLIST ===
[ ] Update name and currency → saves correctly
[ ] Change password → works with valid current password
[ ] Rejects wrong current password
[ ] Account stats load correctly
[ ] Category manager: add/edit/delete works
[ ] Delete account: requires "DELETE" confirmation
[ ] Settings page tabs work
[ ] Currency changes reflect in expense display
```

---

---

# ═══════════════════════════════════════
# PHASE 8: TESTING & QUALITY ASSURANCE
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 8"` in Claude Code
> **Agent:** Web Development Agent (Primary) + General Purpose Agent (Secondary)
> **Duration:** Day 16-17
> **Goal:** Comprehensive testing, bug fixes, code quality

---

## PHASE 8 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 8: Testing & Quality Assurance
AGENTS: Web Development Agent + General Purpose Agent

=== BACKEND TESTING ===

TASK 1: Test Setup
Create FILE: backend/jest.config.js
- Test environment: node
- Coverage thresholds: 70%
- Setup files
- Test database: separate test DB or SQLite

Create FILE: backend/src/__tests__/setup.js
- Connect to test database
- Run migrations
- Seed test data
- Cleanup after all tests

Create FILE: backend/src/__tests__/helpers.js
- createTestUser(): creates user + returns token
- createTestExpense(userId): creates expense
- createTestCategory(userId): creates category
- cleanupDatabase(): truncate all tables

TASK 2: Complete Auth Tests
Create FILE: backend/src/__tests__/auth.test.js (complete version)
Test all scenarios:
- Register: valid, duplicate email, weak password, missing fields
- Login: valid, wrong password, wrong email, rate limiting
- Refresh token: valid, expired, tampered
- Me endpoint: with/without auth
- Password reset flow: complete end-to-end

TASK 3: Expense Tests
Create FILE: backend/src/__tests__/expenses.test.js
- CRUD operations with valid data
- Authorization: can't access other users' expenses
- Filters: date range, category, amount range, search
- Pagination: correct page, limit, totals
- Soft delete: expense not returned after delete
- Validation: negative amount, future date, invalid category

TASK 4: Analytics Tests
Create FILE: backend/src/__tests__/analytics.test.js
- Summary: correct totals for period
- Category breakdown: correct percentages
- Insights: generated based on test data
- Comparison: correct month-over-month change

TASK 5: Budget Tests
Create FILE: backend/src/__tests__/budget.test.js
- Create budget
- Budget status calculation
- Alerts when >80%
- Duplicate budget prevention

=== FRONTEND TESTING ===

TASK 6: Component Tests
Create tests for key components:

backend/src/__tests__/components/ExpenseForm.test.jsx:
- Renders all fields
- Validates required fields
- Validates positive amount
- Submits correct data
- Edit mode populates fields
- Error display

frontend/src/__tests__/components/LoginForm.test.jsx:
- Renders correctly
- Email validation
- Password required
- Loading state
- Error display

frontend/src/__tests__/components/BudgetCard.test.jsx:
- Renders budget info
- Correct progress calculation
- Warning state at 80%
- Exceeded state at 100%
- Edit/delete actions

frontend/src/__tests__/components/InsightCard.test.jsx:
- Renders each severity type
- Correct icon for type
- Message display

TASK 7: Hook Tests
Create FILE: frontend/src/__tests__/hooks/useExpenses.test.js
- Fetches expenses on mount
- Refetches on filter change
- Creates expense and invalidates cache
- Delete expense removes from list

=== QUALITY CHECKS ===

TASK 8: ESLint Configuration
Create FILE: backend/.eslintrc.js
- Node.js environment
- Express best practices
- No console.log in production
- Unused variables as errors
- Consistent return

Create FILE: frontend/.eslintrc.js
- React rules
- Hooks rules
- PropTypes required
- No unused imports
- Accessibility (jsx-a11y)

TASK 9: Prettier Configuration
Create FILE: .prettierrc (root)
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}

TASK 10: Run All Checks
Execute and fix all issues:
1. cd backend && npm test (aim for 70%+ coverage)
2. cd frontend && npm test (all tests pass)
3. cd backend && npm run lint (zero errors)
4. cd frontend && npm run lint (zero errors)
5. cd backend && npm run format
6. cd frontend && npm run format

Fix any failing tests or linting errors found.

TASK 11: Performance Check
Create FILE: backend/src/middleware/performance.middleware.js
- Request timing middleware
- Log slow requests (>500ms)
- Add X-Response-Time header

Review and add missing indexes:
- expenses: (userId, date), (categoryId), (deletedAt)
- income: (userId, date)
- budgets: (userId, categoryId)

TASK 12: Security Audit
Check and implement:
- All routes have auth middleware where needed
- Input validation on all POST/PUT endpoints
- Parameterized queries (Prisma handles this)
- Rate limiting on auth endpoints
- CORS properly configured
- Helmet headers set
- No sensitive data in responses (no passwordHash in user objects)
- File upload validation (type + size)

=== VERIFICATION CHECKLIST ===
[ ] All backend tests pass: npm test
[ ] All frontend tests pass: npm test
[ ] Coverage > 70% backend
[ ] ESLint: zero errors (warnings OK)
[ ] Prettier: code formatted
[ ] No console.logs in production code
[ ] All API routes protected correctly
[ ] Performance middleware logging slow requests
[ ] Security headers present in responses
```

---

---

# ═══════════════════════════════════════
# PHASE 9: CI/CD & DEPLOYMENT
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 9"` in Claude Code
> **Agent:** DevOps Agent (Primary)
> **Duration:** Day 18-19
> **Goal:** GitHub Actions, deployment to Vercel + Railway, monitoring

---

## PHASE 9 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 9: CI/CD Pipeline & Deployment
AGENT: DevOps Agent

=== CI/CD PIPELINE ===

TASK 1: GitHub Actions - CI Pipeline
Create FILE: .github/workflows/ci.yml
Triggers: push to any branch, PR to main/develop

Jobs:
1. backend-test:
   - Setup Node.js 20
   - Start PostgreSQL service
   - Install dependencies
   - Run Prisma migrate
   - Run Jest tests with coverage
   - Upload coverage to Codecov

2. frontend-test:
   - Setup Node.js 20
   - Install dependencies
   - Run Jest tests
   - Upload coverage

3. lint:
   - Run ESLint on both backend and frontend
   - Run Prettier check
   - Fail on any errors

4. security-scan:
   - Run npm audit on both
   - Fail on high/critical vulnerabilities

TASK 2: GitHub Actions - CD Pipeline
Create FILE: .github/workflows/deploy.yml
Triggers: push to main only

Jobs:
1. deploy-backend:
   - Only if backend tests pass
   - Deploy to Railway (using Railway CLI or webhook)
   - Run database migrations on production
   - Health check after deployment

2. deploy-frontend:
   - Only if frontend tests pass
   - Deploy to Vercel (using Vercel CLI)
   - Set environment variables

3. notify:
   - Slack notification on success/failure
   - Include: branch, commit, author, environment URL

TASK 3: GitHub Actions - PR Checks
Create FILE: .github/workflows/pr-check.yml
Triggers: pull_request to main or develop

Checks:
- All tests pass
- Linting passes
- Build succeeds
- No security vulnerabilities
- Branch naming convention check
- PR title format check

=== DEPLOYMENT CONFIGURATION ===

TASK 4: Railway Configuration (Backend)
Create FILE: railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run db:migrate && node src/server.js",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 30
  }
}

Create FILE: backend/src/routes/health.routes.js
GET /api/health:
- Check database connection
- Check memory usage
- Return: { status: 'healthy', timestamp, uptime, database: 'connected' }

TASK 5: Vercel Configuration (Frontend)
Create FILE: vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "env": {
    "VITE_API_URL": "@api_url"
  }
}

TASK 6: Production Dockerfile
Create FILE: backend/Dockerfile.prod
Multi-stage build:
- Stage 1: Install dependencies
- Stage 2: Build/prepare
- Stage 3: Production runtime (minimal)
- Non-root user
- Health check
- Proper signal handling with dumb-init

Create FILE: docker-compose.prod.yml
- Production-ready configuration
- Environment variables from .env
- Nginx reverse proxy
- SSL termination
- Resource limits

=== MONITORING SETUP ===

TASK 7: Health Check Endpoints
Create FILE: backend/src/routes/health.routes.js
- GET /api/health (public)
- GET /api/health/detailed (protected, admin)
Check:
- Database connectivity
- Memory usage
- Response time
- Version info

TASK 8: Error Monitoring
Create FILE: backend/src/config/monitoring.js
Setup Sentry (free tier):
- sentry.init() with DSN from env
- Capture unhandled errors
- Capture unhandled promise rejections
- Add user context to errors
- Filter out expected errors (404, validation)
- Source map upload in CI/CD

Add to frontend:
- Sentry browser SDK
- Capture React errors (ErrorBoundary)
- Capture user context after login

TASK 9: Logging Configuration
Create FILE: backend/src/config/logger.js
Using morgan + winston:
- Development: colorized console output
- Production: JSON format to file
- Log rotation: daily files, keep 30 days
- Log levels: error, warn, info, http, debug
- Include: timestamp, level, message, correlationId

TASK 10: Environment Variables Documentation
Create FILE: DEPLOYMENT.md
Step-by-step deployment guide:
1. Prerequisites (Node.js, PostgreSQL, accounts)
2. Local development setup
3. Railway backend deployment
4. Vercel frontend deployment
5. Environment variables reference
6. Database migration instructions
7. Monitoring setup (Sentry)
8. Custom domain setup
9. SSL configuration
10. Troubleshooting common issues

TASK 11: Backup Strategy
Create FILE: scripts/backup.sh
- pg_dump to create database backup
- Compress backup file
- Timestamp in filename
- Upload to S3 (optional, if configured)
- Keep last 7 daily backups

TASK 12: Performance Monitoring
Create FILE: backend/src/middleware/metrics.middleware.js
Track:
- Request count by endpoint
- Response time percentiles
- Error rate by endpoint
- Database query time
Simple in-memory metrics (no external service needed)

Expose: GET /api/metrics (protected, admin only)

=== VERIFICATION CHECKLIST ===
[ ] CI pipeline runs on every push
[ ] All tests run in CI
[ ] CD deploys to Railway on main push
[ ] CD deploys to Vercel on main push
[ ] Health check endpoint returns 200
[ ] Sentry captures errors in production
[ ] Logs writing to files in production
[ ] Database migrations run on deployment
[ ] Environment variables set in Railway/Vercel
[ ] Custom domain configured (if applicable)
[ ] HTTPS working
```

---

---

# ═══════════════════════════════════════
# PHASE 10: FINAL POLISH & OPTIMIZATION
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 10"` in Claude Code
> **Agent:** General Purpose Agent (Primary) + Web Development Agent (Secondary)
> **Duration:** Day 20
> **Goal:** UI polish, performance optimization, documentation, launch ready

---

## PHASE 10 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 10: Final Polish & Launch Preparation
AGENTS: General Purpose Agent + Web Development Agent

=== UI/UX POLISH ===

TASK 1: Loading States
Review ALL components and ensure:
- Every data fetch has loading skeleton (not spinner only)
- Buttons show loading state during async operations
- Page transitions are smooth
- No layout shifts during loading

Create FILE: frontend/src/components/Common/PageLoader.jsx
- Full-page loading animation for initial auth check
- Smooth fade-out when loaded

TASK 2: Error Boundary
Create FILE: frontend/src/components/Common/ErrorBoundary.jsx
- Catch React rendering errors
- Display friendly error UI
- "Try again" and "Go home" buttons
- Log to Sentry
- Wrap entire app and individual pages

TASK 3: 404 Page
Create FILE: frontend/src/pages/NotFoundPage.jsx
- Friendly 404 message
- Illustration
- Go to Dashboard button
- Search functionality (optional)

TASK 4: Responsive Design Audit
Review every page on:
- Mobile (320px, 375px, 414px)
- Tablet (768px, 1024px)
- Desktop (1280px, 1440px)

Fix any overflow, layout, or usability issues.

TASK 5: Accessibility Audit
Check and fix:
- All images have alt text
- Form inputs have labels
- Buttons have descriptive text
- Color contrast meets WCAG AA
- Keyboard navigation works everywhere
- Focus indicators visible
- Screen reader friendly (aria-labels)

TASK 6: Empty States
Ensure ALL lists have proper empty states:
- Expenses: "No expenses found. Add your first expense!"
- Income: "No income tracked. Add income to calculate savings"
- Budget: "No budgets set. Create your first budget"
- Analytics: "Not enough data yet. Keep tracking to see insights"

=== PERFORMANCE OPTIMIZATION ===

TASK 7: Frontend Optimization
Run: cd frontend && npm run build
Check bundle size and optimize:
- Lazy load routes (React.lazy + Suspense for all pages)
- Lazy load heavy components (Charts)
- Optimize images
- Ensure tree-shaking works
- Add preconnect hints for API domain

Update FILE: frontend/src/App.jsx
- Use React.lazy for all pages
- Add Suspense with loading fallback
- Code split by route

TASK 8: API Response Optimization
Review all API endpoints:
- Add select() to Prisma queries (only fetch needed fields)
- Add proper pagination everywhere
- Cache frequent queries (analytics summary)
- Compress responses with compression middleware

Update FILE: backend/src/server.js
- Add compression middleware: npm install compression
- Add response caching headers for static data

TASK 9: Database Optimization
Review and verify all indexes are in place:
- Create missing indexes via Prisma migration
- Verify N+1 query issues (use include carefully)
- Add query analysis middleware in development

=== DOCUMENTATION ===

TASK 10: API Documentation
Create FILE: docs/API.md
Complete API reference with:
For each endpoint:
- Method + URL
- Description
- Auth required: Yes/No
- Request params/body (with types)
- Success response (with example)
- Error responses
- Example curl command

TASK 11: Architecture Documentation
Create FILE: docs/ARCHITECTURE.md
- System overview diagram (ASCII art)
- Component architecture explanation
- Database schema explanation
- Authentication flow
- Data flow diagrams
- Third-party integrations
- Security considerations

TASK 12: Update README
Update FILE: README.md with:
- Badges: Build Status, Coverage, License
- Screenshot placeholder (add instructions)
- Live demo link placeholder
- Complete feature list with checkmarks
- Clear installation instructions
- Contributing guide
- License section

=== FINAL CHECKS ===

TASK 13: Security Final Review
Check:
[ ] No API keys or secrets in code
[ ] .env files in .gitignore
[ ] All environment variables in .env.example
[ ] Rate limiting on sensitive endpoints
[ ] Input sanitization on all inputs
[ ] SQL injection impossible (Prisma)
[ ] XSS protection (Helmet)
[ ] CORS properly configured for production domain

TASK 14: Cross-Browser Testing
Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (if possible)
- Edge (latest)

Fix any browser-specific issues.

TASK 15: Final Integration Test
Manual test complete user journey:
1. Register new account
2. Login
3. Add 10 expenses across different categories
4. Add 2 income entries
5. Create 3 budgets
6. Check dashboard shows correct data
7. View analytics with charts
8. Generate monthly report
9. Export CSV
10. Change profile settings
11. Change password
12. View all pages on mobile
13. Logout

Fix any issues found.

TASK 16: Launch Checklist File
Create FILE: LAUNCH_CHECKLIST.md
Complete pre-launch verification:

INFRASTRUCTURE:
[ ] Backend deployed to Railway
[ ] Frontend deployed to Vercel
[ ] Database running in production
[ ] Environment variables set
[ ] Custom domain configured
[ ] SSL certificate active

FUNCTIONALITY:
[ ] Registration + login works
[ ] Expense CRUD works in production
[ ] Charts load correctly
[ ] Reports generate and download
[ ] Email password reset works
[ ] CSV import works

MONITORING:
[ ] Sentry capturing errors
[ ] Health check returning 200
[ ] Logs writing correctly
[ ] Database backups configured

PERFORMANCE:
[ ] Page load < 3 seconds
[ ] API responses < 500ms
[ ] Bundle size < 500KB gzipped
[ ] Lighthouse score > 80

SEO & SOCIAL:
[ ] Meta tags set
[ ] OG tags for social sharing
[ ] favicon.ico present

=== FINAL VERIFICATION ===
[ ] All 10 phases complete
[ ] All tests passing
[ ] Production deployment working
[ ] Documentation complete
[ ] Launch checklist verified
[ ] Ready to share/showcase! 🚀
```

---

---

# 📊 COMPLETE PROJECT SUMMARY

## Files Created Per Phase

| Phase | Files | Endpoints | Components |
|-------|-------|-----------|------------|
| Phase 1 | ~25 | 0 | 0 |
| Phase 2 | ~20 | 6 | 4 |
| Phase 3 | ~25 | 10 | 8 |
| Phase 4 | ~30 | 15 | 12 |
| Phase 5 | ~20 | 6 | 8 |
| Phase 6 | ~15 | 5 | 6 |
| Phase 7 | ~10 | 5 | 5 |
| Phase 8 | ~20 | 0 | 0 |
| Phase 9 | ~15 | 2 | 0 |
| Phase 10 | ~10 | 0 | 5 |
| **TOTAL** | **~190** | **~49** | **~48** |

---

## Agent Usage Map

```
General Purpose Agent:
  ├── Phase 1: Project initialization, structure
  ├── Phase 8: Quality checks, code review
  └── Phase 10: Final optimization, documentation

Web Development Agent:
  ├── Phase 2: Authentication (API + UI)
  ├── Phase 3: Expenses (API + UI)
  ├── Phase 4: Income + Budget (API + UI)
  ├── Phase 7: Settings + Profile
  ├── Phase 8: Testing
  └── Phase 10: UI polish

Data Analysis Agent:
  ├── Phase 5: Analytics engine + insights
  └── Phase 6: Reports + CSV generation

DevOps Agent:
  ├── Phase 1: Docker + environment setup
  └── Phase 9: CI/CD + deployment
```

---

## Quick Reference Commands

```bash
# Start development
docker-compose up -d postgres
cd backend && npm run dev
cd frontend && npm run dev

# Execute a phase
# In Claude Code, say: "Execute Phase X"

# Run tests
cd backend && npm test
cd frontend && npm test

# Database operations
cd backend && npm run db:migrate
cd backend && npm run db:seed
cd backend && npm run db:studio

# Build for production
cd frontend && npm run build
cd backend && npm start

# Deploy
git push origin main  # Triggers CD pipeline
```

---

## Phase Execution Tips

> 💡 **Tip 1:** Complete each phase fully before starting the next.

> 💡 **Tip 2:** After each phase, run the verification checklist by saying:
> `"Run the Phase X verification checklist"`

> 💡 **Tip 3:** If something fails, say:
> `"Phase X task Y failed with error: [error message]. Fix it."`

> 💡 **Tip 4:** To check progress, say:
> `"What is the current status of Phase X?"`

> 💡 **Tip 5:** To skip optional tasks, say:
> `"Execute Phase X but skip tasks Y and Z"`

> 💡 **Tip 6:** To re-run a specific task, say:
> `"Re-run Phase X Task Y"`

---

*Generated for SmartExpense Tracker Project | 10 Phases | ~190 Files | 20 Days*
