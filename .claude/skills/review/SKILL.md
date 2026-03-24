---
name: review
trigger: "use review skill"
agents: code-reviewer [PARALLEL] + tester [PARALLEL]
output: .specify/specs/NNN-feature-name/review-report.md + qa-checklist.md + test files
---

# Skill: Review

## When to use
After `implement` is complete and developer has reviewed the code in VS Code.

## Goal
Two agents run simultaneously. Code reviewer checks the code. Tester writes and runs tests. Both produce reports. Developer reviews reports and either approves or sends back to engineers.

## Pre-flight checklist
- [ ] Implementation is complete (all tasks in tasks.md marked done)
- [ ] Developer has done a first-pass review in VS Code
- [ ] Feature branch is up to date

## Steps

### Parallel execution
Both of the following happen at the same time:

**code-reviewer runs:**
1. Reads `spec.md`, `plan.md`, `api-spec.md`
2. Reviews all changed files against the full checklist in `code-reviewer.md`
3. Writes `review-report.md` with: APPROVED / APPROVED WITH MINOR ISSUES / REQUIRES CHANGES

**tester runs:**
1. Reads `spec.md` and `api-spec.md`
2. Writes unit tests for all new backend service methods
3. Writes integration tests for all new API endpoints
4. Writes frontend component tests for all new components
5. Runs the privacy & safety checklist
6. Runs the Georgian rendering checklist
7. Runs the character consistency checklist (if AI pipeline was involved)
8. Writes `qa-checklist.md` with manual test steps for the developer

### After both complete
Orchestrator presents a summary:
```
Review complete.

Code Reviewer: [APPROVED / REQUIRES CHANGES]
Critical issues: N
Minor issues: N

Tester: [PASS / FAIL]
Tests written: N
Tests passing: N
Privacy checklist: [PASS / FAIL]
Georgian rendering: [PASS / FAIL]

Action needed: [what the developer needs to do next]
```

## Fix loop
If either report returns REQUIRES CHANGES or FAIL:
1. Engineers fix the specific issues flagged
2. Re-run only the relevant parts of the review (not the full review from scratch)
3. Repeat until both reports show APPROVED and PASS

## Rules
- Code reviewer and tester always run in parallel — never sequentially
- Fix loop is always targeted — fix specific issues, not a full rewrite
- Developer must see both reports before approving the feature
- A MINOR ISSUES approval is still an approval — minor issues can be fixed in a follow-up
- Privacy checklist failures are always blocking — never ship with a privacy failure
