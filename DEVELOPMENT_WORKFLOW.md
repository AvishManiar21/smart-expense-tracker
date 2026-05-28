# Development Workflow

## Git Workflow for Phase Development

### ⚠️ IMPORTANT: Do NOT merge to main automatically

**All PRs must go through multiple Copilot review cycles (4-5 times) before merge approval.**

### Phase Development Process

#### 1. Create Feature Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/phase-X-name
```

#### 2. Development with Multiple Commits
**Make frequent, granular commits during phase development:**

- ✅ Commit after completing each component
- ✅ Commit after completing each API endpoint
- ✅ Commit after fixing bugs or refactoring
- ✅ Use descriptive commit messages

**Example commit flow for Phase 6:**
```bash
# Component commits
git commit -m "feat: Add ReportSummary component"
git commit -m "feat: Add ExportButtons component with CSV/PDF"
git commit -m "feat: Add DateRangePicker component"

# API commits
git commit -m "feat: Add GET /api/reports/monthly endpoint"
git commit -m "feat: Add POST /api/reports/export/csv endpoint"
git commit -m "feat: Add POST /api/reports/export/pdf endpoint"

# Service commits
git commit -m "feat: Add PDF generation service with PDFKit"
git commit -m "feat: Add CSV generation service"

# Bug fixes and refinements
git commit -m "fix: Handle empty date ranges in reports"
git commit -m "refactor: Optimize report data aggregation"
```

#### 3. Final Phase Commit
After completing all features in the phase:
```bash
git commit -m "feat: Complete Phase X - [Phase Name]

Complete implementation of Phase X with all deliverables:
- [List major features]
- [List API endpoints]
- [List components]

Closes #[issue-number]"
```

#### 4. Push and Create PR
```bash
git push -u origin feature/phase-X-name
gh pr create --title "Phase X: [Name]" --body "[Description]"
```

#### 5. Copilot Review Cycles
**Wait for Copilot to review 4-5 times:**

1. **First Review** - Copilot identifies issues
2. **Fix Issues** - Make changes based on review
3. **Second Review** - Copilot re-reviews
4. **More Fixes** - Address remaining issues
5. **Third Review** - Continue until Copilot approves
6. **Fourth Review** - Final validation
7. **Fifth Review** - Last check before merge

**Commands during review cycles:**
```bash
# After each Copilot review, make fixes
git add .
git commit -m "fix: Address Copilot review feedback - [specific issue]"
git push

# Request re-review
gh pr comment [PR-number] --body "@copilot Please review the latest changes"
```

#### 6. Wait for Merge Approval
❌ **DO NOT MERGE** until user explicitly says "merge to main"
✅ Wait for user approval after all Copilot reviews are complete

#### 7. Merge After Approval
Only when user says to merge:
```bash
gh pr merge [PR-number] --squash
```

### PR Size Guidelines

**Keep PRs under 20,000 lines of changes for Copilot review:**
- If a phase exceeds 20k lines, split into multiple PRs
- Each PR should be a logical subset of the phase
- Use base branches if needed (PR1 → main, PR2 → PR1 branch)

### Example: Phase 5 Workflow (Completed)

```
✅ Phase 5: Analytics & Dashboard

Commits made during development:
1. feat: Add analytics service layer (analytics.ts)
2. feat: Add SummaryCards component
3. feat: Add ExpensePieChart component
4. feat: Add SpendingTrendChart component
5. feat: Add InsightsPanel component
6. feat: Add RecentTransactions component
7. feat: Add MonthlyComparisonChart component
8. feat: Add IncomeExpenseChart component
9. feat: Add CategoryBreakdownTable component
10. feat: Add complete Dashboard page
11. feat: Add complete Analytics page with tabs
12. feat: Install shadcn/ui tabs and progress components
13. fix: Update dashboard data fetching
14. refactor: Optimize chart data formatting
15. feat: Complete Phase 5 - Analytics & Dashboard (FINAL COMMIT)

PR Created: #17
Copilot Reviews: [Would have been 4-5 cycles]
Status: MERGED (after approval)
```

### Current Status

**Completed Phases:**
- ✅ Phase 1: Foundation & Project Setup
- ✅ Phase 2: Database Schema & Migration
- ✅ Phase 3: Expense Management
- ✅ Phase 4: Income & Budget Management
- ✅ Phase 5: Analytics & Dashboard

**Next Phase:**
- 📋 Phase 6: Reports & Export (Issue #5)

### Phase 6 Planning

**Branch:** `feature/phase-6-reports-export`

**Expected Commits:**
1. Setup PDF/CSV libraries
2. Add report service layer
3. Add monthly report endpoint
4. Add yearly report endpoint
5. Add custom date range endpoint
6. Add CSV export endpoint
7. Add PDF export endpoint
8. Add ReportSummary component
9. Add ReportCategoryTable component
10. Add DailyBreakdownChart component
11. Add ExportButtons component
12. Add DateRangePicker component
13. Add Reports page
14. Fix edge cases and errors
15. Final Phase 6 commit

**PR:** Will be created after all commits
**Review:** Will wait for 4-5 Copilot review cycles
**Merge:** Will wait for explicit user approval
