---
name: ship
trigger: "use ship skill"
agent: devops
output: Pull request on GitHub
---

# Skill: Ship

## When to use
After review is complete and developer has approved both the code review report and QA checklist.

## Goal
Create a clean, well-described pull request on GitHub for the other developer to review and merge.

## Pre-flight checklist
- [ ] `review-report.md` shows APPROVED or APPROVED WITH MINOR ISSUES
- [ ] `qa-checklist.md` shows PASS (especially privacy and Georgian sections)
- [ ] All tests are passing in CI
- [ ] No TypeScript errors
- [ ] Developer has confirmed: "approved, ship it"

## Steps

1. Run final checks:
   ```bash
   # Verify no TypeScript errors
   npx tsc --noEmit

   # Verify tests pass
   npm run test

   # Verify linting
   npm run lint
   ```
   If any fail — stop and tell the developer. Do not create the PR.

2. Commit any uncommitted changes with a clear message:
   ```bash
   git add .
   git commit -m "feat(NNN): [feature name] — [one line summary]"
   ```

3. Push the feature branch:
   ```bash
   git push origin feature/NNN-feature-name
   ```

4. Write the PR description using the template in `devops.md`

5. Present the PR description to the developer for review before opening it

6. Open the PR on GitHub

7. Say: "PR is open at [URL]. Your partner needs to review and approve before merging."

## PR commit message format
```
feat(NNN): user authentication with Google OAuth

- Add JWT + Google OAuth login flow
- Add child profile creation after first login
- Add session management with refresh tokens

Spec: .specify/specs/001-auth/spec.md
Review: APPROVED
Tests: 47 passing
```

## Rules
- Never create a PR without both reports approved
- Never skip the TypeScript and lint checks — they must pass
- PR description must include manual test steps — the other developer needs to verify it works
- Never merge the PR yourself — that is the other developer's job
- If CI fails after the PR is opened, notify the developer immediately
