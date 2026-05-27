#!/bin/bash

# Script to create GitHub issues for all development phases
# Run this script to populate your project board with phase tracking issues

echo "🚀 Creating GitHub issues for SmartExpense Tracker phases..."

# Phase 1: Foundation (Already completed)
gh issue create \
  --title "[Phase 1] Foundation & Project Setup" \
  --label "phase,phase-1,completed" \
  --body "## Phase 1: Foundation & Project Setup

**Status**: ✅ Complete

## Completed Tasks

### Backend
- [x] Express.js server setup with middleware
- [x] PostgreSQL database with Docker
- [x] Prisma ORM configuration
- [x] Environment configuration
- [x] Error handling middleware

### Frontend
- [x] React 18 + Vite setup
- [x] Tailwind CSS configuration
- [x] Routing with React Router v6
- [x] Project folder structure

### Database
- [x] 6 Prisma models (User, Expense, Income, Category, Budget, RecurringExpense)
- [x] Database migrations
- [x] Seed data for categories

### Documentation
- [x] README with setup instructions
- [x] Environment configuration guide

## Merged PRs
- Commit: 918379a - Initial commit

---
**Completed**: Phase 1 ✅"

# Phase 2: Authentication (Already completed)
gh issue create \
  --title "[Phase 2] Authentication System" \
  --label "phase,phase-2,completed" \
  --body "## Phase 2: Authentication System

**Status**: ✅ Complete

## Completed Tasks

### Backend
- [x] User registration with validation
- [x] Login with JWT tokens
- [x] Password hashing with bcrypt
- [x] Protected route middleware
- [x] Token refresh mechanism
- [x] Password reset flow

### Frontend
- [x] Registration form with validation
- [x] Login form
- [x] Auth context and state management
- [x] Protected routes
- [x] Token storage and refresh
- [x] Logout functionality

### Security
- [x] Rate limiting on auth endpoints
- [x] Input validation and sanitization
- [x] Secure password storage
- [x] JWT secret management

## Merged PRs
- Commit: 6763d6a - Phase 2: Authentication System

---
**Completed**: Phase 2 ✅"

# Phase 3: Expense Management (Already completed)
gh issue create \
  --title "[Phase 3] Expense Management System" \
  --label "phase,phase-3,completed" \
  --body "## Phase 3: Expense Management System

**Status**: ✅ Complete

## Completed Tasks

### Backend
- [x] Expense CRUD API endpoints
- [x] Category management
- [x] Filtering by category, date range, payment method
- [x] Pagination support
- [x] Soft delete functionality
- [x] Receipt upload to Cloudinary

### Frontend
- [x] Expense list with filters
- [x] Add/Edit expense forms
- [x] Category selection
- [x] Date picker integration
- [x] Receipt upload UI
- [x] Delete with confirmation
- [x] Summary statistics

### Database
- [x] Expense model with all fields
- [x] Category relationships
- [x] Soft delete support

## Merged PRs
- Commit: 62de204 - Phase 3: Expense Management System

---
**Completed**: Phase 3 ✅"

# Phase 4: Income & Budget (In Progress)
gh issue create \
  --title "[Phase 4] Income & Budget Management" \
  --label "phase,phase-4,in-progress" \
  --body "## Phase 4: Income & Budget Management

**Status**: 🚧 In Progress

## Tasks

### Backend
- [x] Income CRUD API
- [x] Budget CRUD API
- [x] Recurring expenses API
- [x] Budget status calculation
- [x] Budget alerts endpoint
- [x] Process recurring expenses
- [x] Fix budget alert thresholds
- [x] Fix recurring catch-up logic
- [x] Fix unique constraint handling

### Frontend
- [x] Income page with list and forms
- [x] Budget page with status cards
- [x] Budget alerts display
- [x] Recurring expenses management
- [x] Budget progress bars
- [x] Fix React key issues
- [x] Fix date field inconsistencies
- [x] Fix data extraction bugs

### Testing
- [ ] Unit tests for controllers
- [ ] Integration tests for APIs
- [ ] E2E tests for UI flows

### Bug Fixes
- [x] Multi-port CORS support
- [x] Copilot code review fixes
- [x] Recurring page data extraction
- [x] Budget update conflict prevention

## Related PRs
- PR #12 - Phase 4: Income & Budget Management (Open)

## Notes
- All Copilot critical and warning issues resolved
- Ready for testing and final review

---
**Target Completion**: Current sprint"

# Phase 5: Analytics & Reporting (To Do)
gh issue create \
  --title "[Phase 5] Analytics & Reporting" \
  --label "phase,phase-5,to-do" \
  --body "## Phase 5: Analytics & Reporting

**Status**: 📝 To Do

## Objectives
Build comprehensive analytics dashboard with charts, trends, and export capabilities.

## Planned Tasks

### Backend
- [ ] Analytics API endpoints
- [ ] Spending trends calculation
- [ ] Category breakdown aggregation
- [ ] Monthly/yearly comparisons
- [ ] CSV export functionality
- [ ] PDF report generation

### Frontend
- [ ] Dashboard with charts (Chart.js or Recharts)
- [ ] Spending trends visualization
- [ ] Category pie/donut charts
- [ ] Income vs Expense comparison
- [ ] Date range selectors
- [ ] Export buttons (CSV/PDF)
- [ ] Responsive chart layouts

### Charts & Visualizations
- [ ] Line chart for spending over time
- [ ] Bar chart for category comparison
- [ ] Pie chart for category distribution
- [ ] Trend indicators (up/down arrows)
- [ ] Summary statistics cards

### Performance
- [ ] Query optimization for large datasets
- [ ] Caching for frequently accessed analytics
- [ ] Lazy loading for chart data

## Dependencies
- Requires Phase 4 completion
- Chart library selection needed

---
**Priority**: High
**Estimated Effort**: 2 weeks"

# Phase 6: Advanced Features (Backlog)
gh issue create \
  --title "[Phase 6] Advanced Features" \
  --label "phase,phase-6,backlog,enhancement" \
  --body "## Phase 6: Advanced Features

**Status**: 📋 Backlog

## Objectives
Add advanced features to enhance user experience and functionality.

## Planned Features

### Multi-Currency Support
- [ ] Currency selection per expense/income
- [ ] Exchange rate API integration
- [ ] Currency conversion in reports
- [ ] Base currency setting

### Bill Reminders
- [ ] Reminder creation UI
- [ ] Email/notification service
- [ ] Recurring reminder support
- [ ] Snooze functionality

### Savings Goals
- [ ] Goal creation and tracking
- [ ] Progress visualization
- [ ] Goal achievement notifications
- [ ] Multiple goals support

### Family/Shared Expenses
- [ ] User groups/families
- [ ] Shared expense tracking
- [ ] Split expense functionality
- [ ] Member contribution tracking

### Mobile Improvements
- [ ] Progressive Web App (PWA)
- [ ] Offline support
- [ ] Touch-optimized UI
- [ ] Mobile-specific layouts

### Other Enhancements
- [ ] Dark mode toggle
- [ ] Custom category creation
- [ ] Bulk operations
- [ ] Search functionality
- [ ] Notifications system

## Dependencies
- Requires Phase 5 completion
- Requires third-party API evaluation

---
**Priority**: Medium
**Estimated Effort**: 3-4 weeks"

# Phase 7: Deployment & Polish (Backlog)
gh issue create \
  --title "[Phase 7] Deployment & Production Ready" \
  --label "phase,phase-7,backlog,deployment" \
  --body "## Phase 7: Deployment & Production Ready

**Status**: 📋 Backlog

## Objectives
Prepare application for production deployment and ensure production-grade quality.

## Deployment Tasks

### Infrastructure
- [ ] Choose hosting provider (Vercel, Netlify, AWS, etc.)
- [ ] Set up production database (managed PostgreSQL)
- [ ] Configure Redis for caching
- [ ] Set up CDN for static assets
- [ ] SSL certificate setup

### CI/CD Pipeline
- [ ] GitHub Actions for automated testing
- [ ] Automated deployments on merge
- [ ] Staging environment setup
- [ ] Production deployment workflow
- [ ] Rollback procedures

### Performance Optimization
- [ ] Frontend bundle optimization
- [ ] Code splitting and lazy loading
- [ ] Image optimization
- [ ] Database query optimization
- [ ] API response caching
- [ ] Lighthouse score optimization (>90)

### Security Hardening
- [ ] Security audit and penetration testing
- [ ] Environment secrets management
- [ ] Rate limiting configuration
- [ ] CORS policy review
- [ ] Input sanitization audit
- [ ] Dependency vulnerability scan

### Monitoring & Logging
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic/DataDog)
- [ ] Log aggregation (CloudWatch/Papertrail)
- [ ] Uptime monitoring
- [ ] Database monitoring
- [ ] Alert configuration

### Documentation
- [ ] User documentation/help center
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Deployment guide
- [ ] Contribution guidelines
- [ ] Architecture documentation

### Testing
- [ ] Full test coverage (>80%)
- [ ] Load testing
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Accessibility testing (WCAG 2.1)

### Legal & Compliance
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Cookie consent
- [ ] GDPR compliance (if applicable)
- [ ] Data backup strategy

## Success Criteria
- [ ] 99.9% uptime
- [ ] <2s page load time
- [ ] Zero critical security vulnerabilities
- [ ] All tests passing
- [ ] Complete documentation

---
**Priority**: High (before public launch)
**Estimated Effort**: 2-3 weeks"

echo "✅ All phase tracking issues created!"
echo ""
echo "Next steps:"
echo "1. Go to your repository: https://github.com/AvishManiar21/smart-expense-tracker"
echo "2. Click on 'Projects' tab"
echo "3. Create a new project board"
echo "4. Add the created issues to your project"
echo "5. Configure automation in project settings"
