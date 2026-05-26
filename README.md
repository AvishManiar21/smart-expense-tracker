# 💰 SmartExpense Tracker

> A comprehensive full-stack expense tracking application with budgeting, analytics, and AI-powered insights.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Coverage](https://img.shields.io/badge/coverage-70%25-green)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

## 📸 Screenshots

_Coming soon..._

## ✨ Features

### ✅ Core Features
- 🔐 **Secure Authentication** - JWT-based auth with refresh tokens
- 💸 **Expense Management** - Track expenses with categories, tags, and receipts
- 💰 **Income Tracking** - Monitor income from multiple sources
- 📊 **Budget Management** - Set and track budgets by category
- 🔄 **Recurring Expenses** - Automate recurring transactions
- 📈 **Analytics Dashboard** - Visual insights with charts and graphs
- 📄 **Report Generation** - Export reports as PDF or CSV
- 🎯 **Smart Insights** - AI-powered spending pattern analysis
- 📱 **Responsive Design** - Works seamlessly on all devices

### 🚀 Advanced Features
- Real-time budget alerts
- Category-wise spending breakdown
- Month-over-month comparisons
- Custom date range reports
- CSV bulk import
- Dark mode support (coming soon)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **React Router v6** - Client-side routing
- **TanStack Query** - Data fetching & caching
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **date-fns** - Date manipulation
- **Lucide React** - Icon library

### Backend
- **Node.js 20** - Runtime environment
- **Express.js** - Web framework
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Primary database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **Morgan** - HTTP logging

### DevOps & Testing
- **Docker** - Containerization
- **Jest** - Testing framework
- **Supertest** - API testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v20 or higher)
- **npm** (v9 or higher)
- **Docker** and **Docker Compose**
- **PostgreSQL** (if not using Docker)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/smart-expense-tracker.git
cd smart-expense-tracker
\`\`\`

### 2. Set Up Environment Variables

**Backend:**
\`\`\`bash
cd backend
cp .env.example .env
# Edit .env with your configuration
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
cp .env.example .env
# Edit .env with your configuration
\`\`\`

### 3. Start PostgreSQL with Docker

\`\`\`bash
docker-compose up -d postgres
\`\`\`

Wait for PostgreSQL to be healthy:
\`\`\`bash
docker-compose ps
\`\`\`

### 4. Install Dependencies

**Backend:**
\`\`\`bash
cd backend
npm install
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm install
\`\`\`

### 5. Set Up Database

\`\`\`bash
cd backend

# Run migrations
npm run db:migrate

# Seed default categories
npm run db:seed
\`\`\`

### 6. Start Development Servers

**Backend (Terminal 1):**
\`\`\`bash
cd backend
npm run dev
# Server runs on http://localhost:5000
\`\`\`

**Frontend (Terminal 2):**
\`\`\`bash
cd frontend
npm run dev
# App runs on http://localhost:3000
\`\`\`

### 7. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Available Scripts

### Backend Scripts

\`\`\`bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run tests with coverage
npm run test:watch   # Run tests in watch mode
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed database with default data
npm run db:studio    # Open Prisma Studio (GUI)
npm run db:reset     # Reset database
npm run lint         # Lint code
npm run format       # Format code with Prettier
\`\`\`

### Frontend Scripts

\`\`\`bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run lint         # Lint code
npm run format       # Format code with Prettier
\`\`\`

## 🗄️ Database Schema

The application uses 6 main tables:
- **users** - User accounts
- **expenses** - Expense transactions
- **income** - Income entries
- **categories** - Expense categories (system + custom)
- **budgets** - Budget limits per category
- **recurring_expenses** - Recurring expense templates

## 🔐 Authentication Flow

1. User registers with email/password
2. Password is hashed with bcrypt (12 rounds)
3. JWT access token (7d) and refresh token (30d) are generated
4. Refresh token stored in httpOnly cookie
5. Access token sent in Authorization header for API requests
6. Auto-refresh when access token expires

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Expenses
- `GET /api/expenses` - List expenses (with filters)
- `POST /api/expenses` - Create expense
- `GET /api/expenses/:id` - Get single expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense (soft)
- `POST /api/expenses/bulk` - Import CSV

_Full API documentation coming soon..._

## 🧪 Running Tests

\`\`\`bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run with coverage
npm run test:coverage
\`\`\`

## 🚀 Deployment

### Backend (Railway)
1. Push code to GitHub
2. Connect Railway to your repo
3. Set environment variables
4. Deploy automatically on push to main

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy automatically on push to main

Detailed deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md) _(coming in Phase 9)_

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow ESLint rules
- Use Prettier for formatting
- Add JSDoc comments for functions
- Include PropTypes for React components
- Write tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Built with Claude Code
- Icons by [Lucide](https://lucide.dev)
- Charts by [Recharts](https://recharts.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ using React, Node.js, and PostgreSQL**
