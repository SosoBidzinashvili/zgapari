# Task Breakdown — [Feature Name]

> Spec: NNN | Status: Draft / Approved | Author: Orchestrator | Date: YYYY-MM-DD
> Total tasks: N | Estimated sessions: N

---

## Execution waves

### Wave 1 — Foundation (no dependencies)
Tasks that can start immediately.

---

### Task 001 — [Task name]
**Agent:** backend-engineer / frontend-engineer / ai-pipeline-engineer / integrations-engineer
**[P] Parallel:** Yes / No — [reason]
**Depends on:** None / Task NNN
**Files:**
- Create: `path/to/new/file.ts`
- Modify: `path/to/existing/file.ts`

**What to build:**
[Specific description of what this task produces. Precise enough that the engineer makes no architectural decisions.]

**Done when:**
- [ ] [Specific verifiable condition]
- [ ] [Specific verifiable condition]

---

### Task 002 — [Task name]
[Repeat pattern]

---

### Wave 2 — Core logic (depends on Wave 1)

### Task 003 — [Task name]
**Agent:** [agent]
**[P] Parallel:** [Yes/No]
**Depends on:** Task 001, Task 002
**Files:**
- ...

[Continue pattern for all tasks]

---

## Final tasks (always last)

### Task NNN — Write and run all tests
**Agent:** tester
**Depends on:** All implementation tasks
**[P] Parallel:** No

Run the full test suite:
- Unit tests: `npm run test`
- Integration tests: `npm run test:e2e`
- Privacy checklist: manual (see qa-checklist.md)
- Georgian rendering checklist: manual
- Character consistency checklist: manual (if AI pipeline involved)

**Done when:**
- [ ] All automated tests passing
- [ ] Privacy checklist: PASS
- [ ] Georgian rendering: PASS
- [ ] No TypeScript errors: `npx tsc --noEmit`
