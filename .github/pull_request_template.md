## Summary

Describe what changed and why.

## Validation

- [ ] `npm run lint`
- [ ] `npm run test --if-present`
- [ ] `npm run test:e2e` (all E2E tests pass)
- [ ] `npm run build`
- [ ] Manual smoke test done in Preview deployment

## E2E Testing Checklist

- [ ] All buttons are clickable and functional
- [ ] Form fields have proper validation
- [ ] Navigation links work as expected
- [ ] If adding auth flow: register/login tested
- [ ] If database changes: data writes/reads verified
- [ ] Error states properly displayed

## Security Review

- [ ] No secrets or credentials added to tracked files
- [ ] Auth/session behavior reviewed for affected routes
- [ ] API inputs validated and error handling does not leak sensitive data
- [ ] New dependencies reviewed for risk and necessity

## Design And UX Review

- [ ] Mobile layout checked (small screen)
- [ ] Desktop layout checked
- [ ] Color contrast and readability checked
- [ ] Keyboard navigation and focus states checked
- [ ] Empty/error/loading states checked
- [ ] Test results from Playwright confirm UI accuracy

## Deployment Notes

- [ ] Required environment variables documented or updated
- [ ] Database migration impact reviewed (if any)
- [ ] Rollback plan noted for risky changes
