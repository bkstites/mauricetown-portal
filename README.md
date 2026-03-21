This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Delivery Pipeline

This repo now includes a multi-lane PR pipeline:

- Development and test lane: `.github/workflows/ci.yml`
- Security lane: `.github/workflows/security.yml`
- E2E / UI testing lane: `.github/workflows/e2e-tests.yml`
- Design and release checklist: `.github/pull_request_template.md`

### How to use it

1. Open a pull request from a feature branch.
2. Wait for `CI`, `Security`, and `E2E Tests` checks to complete.
3. View E2E test results in the PR (Playwright report).
4. Complete the design, security, E2E, and deployment checklist in the PR template.
5. Merge only after all checks are green.

### Running tests locally

```bash
npm run test:e2e              # Run all E2E tests headlessly
npm run test:e2e:ui          # Run E2E tests in UI mode (interactive)
npm run lint                  # Lint code
npm run build                 # Build for production
```

Initial status-check bootstrap completed for branch-protection setup.

### Recommended branch protection

In GitHub repository settings, add branch protection on `main` and require these status checks:

- `CI / quality`
- `Security / dependency-audit`
- `Security / secret-scan`
- `E2E Tests / ui-tests`

In Vercel, keep production deploys limited to merges into `main`.
