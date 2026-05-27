# GitHub Project Board Setup Guide

This guide will help you set up a GitHub Project (v2) board for the SmartExpense Tracker project.

## Quick Setup Steps

### 1. Create a New Project

1. Go to your repository: https://github.com/AvishManiar21/smart-expense-tracker
2. Click on the **Projects** tab
3. Click **Link a project** → **New project**
4. Choose **Board** as the template
5. Name it: **SmartExpense Tracker Development**
6. Click **Create**

### 2. Configure Project Columns

The project should have these columns (rename or add as needed):

| Column | Purpose | Status Mapping |
|--------|---------|----------------|
| 📋 Backlog | Future features and ideas | - |
| 📝 To Do | Ready to start | Todo |
| 🚧 In Progress | Currently being worked on | In Progress |
| 👀 In Review | PR open, awaiting review | In Review |
| ✅ Done | Completed | Done |

### 3. Add Development Phase Issues

Create issues for each phase to track progress:

#### Phase 1: Foundation ✅ (Completed)
- [x] Project scaffolding
- [x] Database setup with Prisma
- [x] Basic Express server
- [x] Frontend with React + Vite

#### Phase 2: Authentication ✅ (Completed)
- [x] User registration
- [x] Login with JWT
- [x] Password reset
- [x] Protected routes

#### Phase 3: Expense Management ✅ (Completed)
- [x] Expense CRUD operations
- [x] Category management
- [x] Filtering and pagination
- [x] Receipt upload

#### Phase 4: Income & Budget Management 🚧 (In Progress - PR #12)
- [x] Income tracking
- [x] Budget creation and monitoring
- [x] Recurring expenses
- [x] Budget alerts
- [ ] Testing and bug fixes

#### Phase 5: Analytics & Reporting 📝 (To Do)
- [ ] Dashboard with charts
- [ ] Spending trends analysis
- [ ] Category-wise breakdown
- [ ] Export to CSV/PDF
- [ ] Date range filtering

#### Phase 6: Advanced Features 📋 (Backlog)
- [ ] Multi-currency support
- [ ] Bill reminders
- [ ] Savings goals
- [ ] Family/shared expenses
- [ ] Mobile responsive improvements

#### Phase 7: Deployment & Polish 📋 (Backlog)
- [ ] Production deployment
- [ ] Performance optimization
- [ ] Security audit
- [ ] User documentation
- [ ] Monitoring and logging

## Automation Workflows

### Automatic Status Updates

The project includes GitHub Actions workflows that automatically:

1. **Move items to "In Progress"** when:
   - A PR is opened
   - An issue is assigned

2. **Move items to "In Review"** when:
   - A PR is ready for review
   - A PR passes CI checks

3. **Move items to "Done"** when:
   - A PR is merged
   - An issue is closed as completed

### Setting Up Automation

1. In your Project board, click the **⚙️ (Settings)** icon
2. Go to **Workflows**
3. Enable these built-in workflows:
   - **Auto-add to project**: Add new issues and PRs automatically
   - **Item closed**: Move to "Done" when closed
   - **Pull request merged**: Move to "Done" when PR merged
   - **Auto-archive items**: Archive items after 30 days in "Done"

## Custom Automation (Optional)

For advanced automation, you can use the GitHub Actions workflow already created:

### `.github/workflows/project-automation.yml`

This workflow automatically updates project cards based on PR and issue events.

## Project Fields (Optional Custom Fields)

You can add custom fields to track additional information:

1. **Priority**: Single select (High, Medium, Low)
2. **Phase**: Single select (Phase 1-7)
3. **Story Points**: Number (1, 2, 3, 5, 8, 13)
4. **Due Date**: Date field
5. **Assignee**: Person field

## Tips for Effective Project Management

1. **Link PRs to Issues**: Use "Closes #123" in PR descriptions
2. **Use Labels**: Create labels like `bug`, `feature`, `enhancement`, `phase-4`, etc.
3. **Regular Updates**: Update issue status and comments regularly
4. **Milestones**: Create milestones for each phase
5. **Reviews**: Use project views to filter and review progress

## Project Views

Create multiple views for different perspectives:

### 1. Board View (Default)
- Shows all items in columns
- Drag and drop to update status

### 2. Phase View
- Group by: Phase
- Filter: Status != Done
- Shows active work by phase

### 3. Priority View
- Group by: Priority
- Sort by: Due Date
- Shows high-priority items first

### 4. Completion View
- Filter: Status = Done
- Sort by: Closed Date (newest first)
- Shows recent completions

## Need Help?

- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [Project Automation Guide](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project)
- [GraphQL API for Projects](https://docs.github.com/en/graphql/guides/managing-projects)

---

**Last Updated**: 2026-05-26
**Current Phase**: Phase 4 - Income & Budget Management
**Active PR**: #12
