# GitHub Copilot Custom Instructions
# SmartExpense Tracker - Code Review Guidelines

## Project Context
This is a full-stack expense tracking web application.
- Frontend: React 18 (JavaScript), Vite, Tailwind CSS, Recharts
- Backend: Node.js 20, Express.js, Prisma ORM
- Database: PostgreSQL
- Auth: JWT with refresh tokens
- Testing: Jest, React Testing Library, Supertest

---

## CRITICAL ISSUES (Always flag as errors - block merge)

### Security
- Flag hardcoded secrets, API keys, passwords, tokens
- Flag SQL queries not using Prisma (raw SQL injection risk)
- Flag missing authentication middleware on protected routes
- Flag missing input validation on POST/PUT endpoints
- Flag passwords not hashed with bcrypt
- Flag JWT tokens stored in localStorage (must be httpOnly cookie)
- Flag missing rate limiting on auth endpoints
- Flag user data returned with passwordHash field
- Flag CORS configured with wildcard (*) in production
- Flag missing helmet middleware
- Flag file uploads without type/size validation
- Flag any route missing ownership check (req.user.id)

### Data Integrity
- Flag database operations without error handling
- Flag missing transactions for multi-step database operations
- Flag direct user ID from request body (must come from req.user.id)

---

## CODE QUALITY ISSUES (Flag as warnings)

### JavaScript
- Flag var usage → suggest const or let
- Flag == instead of ===
- Flag console.log in production code
- Flag missing PropTypes in React components
- Flag missing JSDoc on all functions
- Flag functions longer than 50 lines
- Flag nesting deeper than 3 levels
- Flag duplicate code blocks
- Flag unused variables and imports
- Flag magic numbers without named constants

### React
- Flag class components → suggest functional + hooks
- Flag missing keys in list renders
- Flag missing useEffect dependency arrays
- Flag prop drilling more than 2 levels → suggest Context
- Flag missing error boundaries
- Flag missing loading states for async operations
- Flag missing empty states for lists
- Flag direct DOM manipulation

### Express/Node
- Flag missing asyncHandler on async route handlers
- Flag missing next(error) in catch blocks
- Flag missing input validation with express-validator
- Flag synchronous file operations

### Prisma/Database
- Flag SELECT * queries → specific fields only
- Flag missing pagination on list endpoints
- Flag N+1 query problems → suggest include/join
- Flag missing soft delete (deletedAt) for important records

---

## IMPROVEMENTS (Suggest as enhancements)

### Performance
- Suggest caching for analytics and categories
- Suggest lazy loading for heavy React components
- Suggest debouncing for search inputs
- Suggest memoization for expensive calculations
- Suggest indexes on frequently queried fields

### Testing
- Suggest tests when new functions have no test file
- Suggest edge case tests (empty arrays, null values, 0 amounts)
- Suggest integration tests for new API endpoints
- Suggest error state tests for React components

### Error Handling
- Suggest specific error types instead of generic Error
- Suggest user-friendly error messages
- Suggest logging for caught errors

### Code Organization
- Suggest moving business logic from controllers to services
- Suggest moving reusable UI logic to custom hooks
- Suggest constants file for magic strings and numbers

---

## PROJECT SPECIFIC RULES

### File Naming Conventions
- React components: PascalCase (UserProfileCard.jsx)
- Hooks: camelCase starting with use (useExpenses.js)
- Services: camelCase ending in .service.js (expense.service.js)
- Controllers: camelCase ending in .controller.js
- Routes: camelCase ending in .routes.js
- Tests: same name + .test.js (expense.service.test.js)

### API Response Format (Flag any deviation)
Success: { success: true, data: {}, message: "" }
Error:   { success: false, message: "", errors: [] }

### Authentication Rules
- All routes except /api/auth/* must have authenticate middleware
- All expense/income/budget operations must verify req.user.id ownership
- Flag any route that skips ownership verification

### Amount Handling
- All monetary amounts must use Decimal type not float
- Flag arithmetic on money using regular JS numbers

### Environment Variables
- Flag hardcoded URLs (use process.env)
- Flag hardcoded port numbers (use process.env.PORT)
- Flag missing .env.example updates when new env vars added

---

## REVIEW FORMAT

When reviewing Pull Requests use this structure:

### Summary
2-3 sentence overview of what the PR does and overall quality.

### Critical Issues (Must fix before merge)
[FILE:LINE] Issue → Suggested fix

### Warnings (Should fix)
[FILE:LINE] Issue → Suggested fix

### Suggestions (Nice to have)
[FILE:LINE] Suggestion → Why it helps

### What is Done Well
2-3 positive observations to encourage good practices.

---

## NEVER APPROVE PRs THAT HAVE

1. Hardcoded passwords, secrets, or API keys
2. Missing authentication on protected routes
3. User data accessible without ownership check
4. Raw SQL queries bypassing Prisma
5. Passwords stored in plain text
6. Sensitive data logged to console
7. Real credentials in test files
8. node_modules committed
9. .env files committed (not .env.example)
10. Breaking changes without documentation

---

## AUTO APPROVE FRIENDLY PRs THAT HAVE

1. All tests passing
2. No security vulnerabilities
3. Proper error handling throughout
4. JSDoc on all public functions
5. PropTypes on all React components
6. Clean code following project conventions
7. Updated tests for changed functionality
8. No console.log in production code
