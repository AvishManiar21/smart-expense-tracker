## Description
<!-- What does this PR do? -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Tests
- [ ] Documentation
- [ ] Performance improvement

## Files Changed
<!-- List main files and why they changed -->

## Self Review Checklist
- [ ] No hardcoded secrets or API keys
- [ ] Authentication middleware on all protected routes
- [ ] Input validation on all POST/PUT endpoints
- [ ] Ownership checks using req.user.id
- [ ] All async functions have try/catch
- [ ] PropTypes on all React components
- [ ] JSDoc comments on all functions
- [ ] Tests written for new functionality
- [ ] No console.log in production code
- [ ] API responses follow { success, data, message } format
- [ ] No var usage (const/let only)
- [ ] No N+1 database queries
- [ ] Pagination on all list endpoints

## Testing Done
<!-- How was this tested? -->

## Screenshots
<!-- Add screenshots for UI changes -->

## Related Issues
<!-- Closes #issue_number -->

---
<!--
@github-copilot Please review this PR focusing on:
1. Security: auth middleware, input validation, ownership checks
2. Code quality: React patterns, Express patterns, Prisma usage
3. Performance: N+1 queries, missing indexes, pagination
4. Tests: missing coverage for new code
5. Conventions: naming, response format, error handling, JSDoc, PropTypes
-->
