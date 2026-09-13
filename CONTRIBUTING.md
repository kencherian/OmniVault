# Contributing to OmniVault

First off, thank you for considering contributing to OmniVault!

## Development Workflow

We utilize a strict CI/CD pipeline. All PRs must pass type checking, linting, formatting, and unit tests before they can be merged.

1. **Fork & Clone:** Fork the repository and clone it to your local machine.
2. **Install Dependencies:** Run `npm install`.
3. **Branching Strategy:** Create a new branch based on the type of work:
   - Features: `feature/your-feature-name`
   - Bug Fixes: `bugfix/issue-description`
   - Documentation: `docs/what-you-updated`
4. **Run Checks Locally:** Before committing, ensure you run:
   - `npm run format`
   - `npm run typecheck`
   - `npm run test`
5. **Commit:** We encourage semantic commit messages (e.g., `feat: ...`, `fix: ...`, `chore: ...`).
6. **Pull Request:** Open a PR against the `main` branch. The PR template will guide you through the required checklist.

## Architecture Guidelines

If you are modifying storage logic, ensure you are utilizing the `IStorageProvider` adapter located in `lib/storage` rather than invoking BaaS SDKs directly.
