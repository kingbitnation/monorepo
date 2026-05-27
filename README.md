# Frontend Migration Monorepo

This repository is structured to host multiple migrated frontend apps as independently runnable React + Vite projects.

## Structure

- `apps/project-1`
- `apps/project-2`
- `apps/project-3`
- `shared/components`
- `shared/hooks`
- `shared/utils`
- `shared/styles`
- `infrastructure/docker`
- `infrastructure/nginx`
- `infrastructure/github-actions`

## Local Setup

1. Install Node.js 20+ and npm 10+.
2. Install Git.
3. Run `npm install` at the repo root.
4. Start an app with one of:
   - `npm run dev:project-1`
   - `npm run dev:project-2`
   - `npm run dev:project-3`

## Quality Gates

- Lint: `npm run lint`
- Tests: `npm run test`
- Build: `npm run build`

## CI/CD

GitHub Actions workflow is defined in `.github/workflows/ci.yml`.

## Deployment

Docker and Nginx artifacts are under `infrastructure/`.
