# 🔄 GitHub Workflow Guide

## 📋 Project Organization

### Repository
**URL:** https://github.com/AvishManiar21/smart-expense-tracker

### Issues Created
- ✅ **Issue #1:** Phase 2: Authentication System
- ✅ **Issue #2:** Phase 3: Expense Management
- ✅ **Issue #3:** Phase 4: Income & Budget Management
- ✅ **Issue #4:** Phase 5: Analytics & Dashboard
- ✅ **Issue #5:** Phase 6: Reports & Export
- ✅ **Issue #6:** Phase 7: Settings & User Profile
- ✅ **Issue #7:** Phase 8: Testing & Quality Assurance
- ✅ **Issue #8:** Phase 9: CI/CD & Deployment
- ✅ **Issue #9:** Phase 10: Final Polish & Optimization

### Labels
- 🏷️ **phase** - Phase-related issues
- 🏷️ **backend** - Backend development
- 🏷️ **frontend** - Frontend development
- 🏷️ **testing** - Testing and QA
- 🏷️ **devops** - DevOps and deployment
- 🏷️ **documentation** - Documentation

---

## 🌿 Branch Strategy

### Main Branches
- **`main`** - Production-ready code only (protected)
- **`develop`** - Integration branch (optional, can use feature branches directly)

### Feature Branches
Each phase will be developed in its own branch:
- `feature/phase-2-authentication`
- `feature/phase-3-expenses`
- `feature/phase-4-income-budget`
- `feature/phase-5-analytics`
- `feature/phase-6-reports`
- `feature/phase-7-settings`
- `feature/phase-8-testing`
- `feature/phase-9-cicd`
- `feature/phase-10-polish`

---

## 🔄 Development Workflow

### For Each Phase:

#### 1. Create Feature Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/phase-X-name
```

#### 2. Development
- Make multiple commits as you work
- Commit frequently with descriptive messages
- Follow conventional commit format:
  ```
  feat: add user authentication endpoint
  fix: resolve JWT token expiration issue
  refactor: improve error handling middleware
  test: add auth controller tests
  docs: update API documentation
  ```

#### 3. Before Creating PR
```bash
# Ensure all changes are committed
git status

# Push branch to GitHub
git push origin feature/phase-X-name
```

#### 4. Create Pull Request
```bash
# Using GitHub CLI
gh pr create --title "Phase X: Feature Name" \
  --body "Closes #X

## Changes
- Feature 1
- Feature 2

## Testing
- [ ] Manual testing completed
- [ ] All tests pass

## Screenshots
(if applicable)

Ready for review by GitHub Copilot"
```

#### 5. GitHub Copilot Review
- **IMPORTANT:** After PR is created, wait for GitHub Copilot to review
- Review the suggestions
- Make necessary improvements
- Push updates to the same branch
- Request re-review if needed

#### 6. Merge PR
Once GitHub Copilot approves (or no improvements needed):
```bash
# If no conflicts, merge via GitHub CLI
gh pr merge --squash --delete-branch

# Or use GitHub UI
```

---

## 📝 Commit Guidelines

### Commit Messages
- Use present tense: "Add feature" not "Added feature"
- Be descriptive but concise
- Reference issue numbers when applicable
- **NEVER include:** "Co-Authored-By: Claude" or similar

### Good Examples
```
feat: implement JWT authentication with refresh tokens

Closes #1

- Add JWT utility functions for token generation
- Create auth middleware for route protection
- Implement refresh token rotation
- Add password hashing with bcryptjs
```

```
fix: resolve database connection timeout on Windows

- Change PostgreSQL port from 5432 to 5433
- Add connection retry logic
- Update environment configuration
```

### Bad Examples
❌ `update files`
❌ `fix bug`
❌ `wip`
❌ `Co-Authored-By: Claude <noreply@anthropic.com>`

---

## 🔍 Code Review Process

### Before Submitting PR
- [ ] Code follows project style guide
- [ ] All tests pass locally
- [ ] No console.logs in production code
- [ ] PropTypes added for React components
- [ ] JSDoc comments added for functions
- [ ] No sensitive data (API keys, passwords) committed
- [ ] .env files not committed

### GitHub Copilot Review Checklist
When GitHub Copilot reviews your PR, check for:
- [ ] Code quality suggestions
- [ ] Security vulnerabilities
- [ ] Performance improvements
- [ ] Best practice violations
- [ ] Test coverage gaps

### Making Improvements
If GitHub Copilot suggests changes:
```bash
# Make the changes locally
# Commit with descriptive message
git add .
git commit -m "refactor: apply GitHub Copilot suggestions"
git push origin feature/phase-X-name

# PR will auto-update
```

---

## 🚫 Branch Protection Rules

### Main Branch Protection (to be configured)
- [ ] Require pull request reviews before merging
- [ ] Require status checks to pass (CI)
- [ ] Require branches to be up to date before merging
- [ ] Include administrators (optional)
- [ ] Restrict who can push to matching branches

---

## 📊 Project Board Setup

### Manual Setup (GitHub Web UI)
Since we need additional auth scopes for CLI project creation:

1. Go to: https://github.com/AvishManiar21/smart-expense-tracker/projects
2. Click "New project"
3. Choose "Board" template
4. Name: "SmartExpense Tracker Development"
5. Add columns:
   - 📋 **To Do** (linked to open issues)
   - 🏗️ **In Progress** (linked to PRs)
   - 👀 **In Review** (linked to PR reviews)
   - ✅ **Done** (linked to closed issues)

6. Add all phase issues (#1-#9) to the board

---

## 🎯 Current Status

### Completed
- ✅ Git repository initialized
- ✅ Initial commit created
- ✅ GitHub repository created
- ✅ Code pushed to GitHub
- ✅ 9 phase issues created
- ✅ Labels added to all issues

### Next Steps
1. **Manual:** Create GitHub Project Board (web UI)
2. **Manual:** Configure branch protection rules (web UI)
3. **Manual:** Set up GitHub Copilot for PR reviews
4. **Ready:** Start Phase 2 in feature branch

---

## 🚀 Starting Phase 2

Once everything is set up:

```bash
# Create Phase 2 branch
git checkout -b feature/phase-2-authentication

# Start development
# Make commits as you work

# When ready for review
git push origin feature/phase-2-authentication
gh pr create --title "Phase 2: Authentication System" --body "Closes #1"

# Wait for GitHub Copilot review
# Make improvements if needed
# Merge when approved
```

---

**Repository:** https://github.com/AvishManiar21/smart-expense-tracker
**Issues:** https://github.com/AvishManiar21/smart-expense-tracker/issues
