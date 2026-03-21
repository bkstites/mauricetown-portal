## Summary

Describe what changed and why.

## Validation

- [ ] `npm run lint`
- [ ] `npm run test --if-present`
- [ ] `npm run build`
- [ ] Manual smoke test done in Preview deployment

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

## Deployment Notes

- [ ] Required environment variables documented or updated
- [ ] Database migration impact reviewed (if any)
- [ ] Rollback plan noted for risky changes
