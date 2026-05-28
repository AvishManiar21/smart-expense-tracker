# GitHub Copilot Custom Instructions
# SmartExpense Tracker - Code Review Guidelines

## Project Context
This is a full-stack expense tracking web application built with modern TypeScript stack.
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS, Shadcn/ui, Recharts
- **Backend**: Next.js 14 API Routes (App Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: NextAuth.js v5 (beta) with JWT
- **Validation**: Zod schemas
- **Testing**: Vitest, React Testing Library, Playwright

---

## CRITICAL ISSUES (Always flag as errors - block merge)

### Security
- Flag hardcoded secrets, API keys, passwords, tokens
- Flag SQL queries not using Drizzle ORM (SQL injection risk)
- Flag missing authentication middleware on protected API routes
- Flag missing input validation with Zod on POST/PUT endpoints
- Flag passwords not hashed with bcryptjs (12 salt rounds minimum)
- Flag user data returned with passwordHash field
- Flag file uploads without type/size validation
- Flag any route missing ownership check (session?.user?.id)
- Flag environment variables not validated with Zod

### Data Integrity
- Flag database operations without error handling
- Flag missing transactions for multi-step database operations
- Flag direct user ID from request body (must come from session.user.id)
- Flag operations without soft delete for important records (use deletedAt)

### TypeScript
- Flag usage of any type without justification
- Flag missing return types on functions
- Flag type assertions (as) without explanation

---

## CODE QUALITY ISSUES (Flag as warnings)

### TypeScript/Next.js
- Flag console.log in production code
- Flag missing JSDoc on exported functions
- Flag functions longer than 50 lines
- Flag duplicate code blocks
- Flag unused variables and imports
- Flag magic numbers without named constants

### API Routes (Next.js App Router)
- Flag async route handlers without try-catch
- Flag missing Zod validation on request body
- Flag missing proper HTTP status codes
- Flag unhandled errors not using NextResponse.json

### Drizzle ORM/Database
- Flag SELECT * queries → specific fields only
- Flag missing pagination on list endpoints
- Flag N+1 query problems
- Flag missing soft delete (deletedAt) for important records

---

## PROJECT SPECIFIC RULES

### API Response Format
Success: { success: true, data: T, message?: string }
Error:   { success: false, message: string, errors?: ZodError[] }

### Authentication Rules
- All API routes except /api/auth/* must call requireAuth() or check session
- All operations must verify session.user.id ownership

### Amount Handling
- All monetary amounts must use Decimal type from Drizzle
- Always convert Decimal to string for JSON responses
