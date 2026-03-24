# Code Review Report — [Feature Name]

> Spec: NNN | Reviewer: Code Reviewer agent | Date: YYYY-MM-DD
> Branch: `feature/NNN-[feature-name]`

---

## ⚠️ Uncertainty declaration
> List any checklist items you could not fully verify and why.

| Checklist item | Why uncertain | What would resolve it |
|---|---|---|
| [e.g. Payment webhook signature] | [No webhook test in the codebase] | [Manual test with BOG sandbox] |

---

## Verdict

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   APPROVED  /  APPROVED WITH MINOR ISSUES       │
│             /  REQUIRES CHANGES                 │
│                                                 │
│   Critical issues:  N                           │
│   Minor issues:     N                           │
│                                                 │
└─────────────────────────────────────────────────┘
```

> APPROVED — safe to proceed to ship
> APPROVED WITH MINOR ISSUES — safe to proceed, minor issues tracked below for follow-up
> REQUIRES CHANGES — do not proceed until critical issues are resolved

---

## Critical issues
> Must fix before merge. Each issue blocks the PR.

### Issue C-01 — [Short title]
**File:** `path/to/file.ts`
**Lines:** 42–58
**What is wrong:**
[Clear description of the problem]

**Why it matters:**
[Impact — security risk / privacy violation / spec mismatch / broken functionality]

**How to fix:**
[Specific, actionable fix — not just "fix this"]

---

### Issue C-02 — [Short title]
[Repeat structure]

---

## Minor issues
> Should fix, not blocking. Can be addressed in a follow-up PR.

### Issue M-01 — [Short title]
**File:** `path/to/file.ts`
**Lines:** 12–15
**What:** [Description]
**Suggestion:** [How to improve]

---

## Checklist results

### Spec compliance
- [ ] All acceptance criteria from `spec.md` are implemented
- [ ] No out-of-scope code included
- [ ] API endpoints match `api-spec.md` exactly

### Security
- [ ] No hardcoded secrets or API keys
- [ ] All user input validated and sanitized
- [ ] Auth guards on all protected endpoints
- [ ] Presigned URLs used — no raw S3 URLs returned

### Privacy — children's data
- [ ] Photo deletion flow implemented (not just UI)
- [ ] Character references in isolated storage bucket
- [ ] No children's data in application logs
- [ ] No permanent asset URLs returned to client
- [ ] GDPR erasure — account deletion removes data

### Georgian-specific
- [ ] All visible strings use i18next — no hardcoded display text
- [ ] Georgian font specified where text is rendered (PDF, images)
- [ ] Locale-aware date/number formatting
- [ ] Tested with actual Georgian characters (not placeholder text)

### Character consistency
- [ ] Every image generation call includes character reference
- [ ] Character reference retrieval includes correct art style
- [ ] No code path that generates without a character reference

### Async jobs
- [ ] No synchronous image generation
- [ ] All long-running operations are queued via BullMQ
- [ ] Job progress is reported correctly
- [ ] Failed jobs surface a generic error — no internal details to client

### Free tier enforcement
- [ ] Tier limits enforced server-side (not frontend only)
- [ ] Limits read from config — not hardcoded
- [ ] Watermark flag set correctly based on payment status

### TypeScript quality
- [ ] No `any` types
- [ ] No `as unknown as X` casts
- [ ] All async functions properly awaited
- [ ] Error types are specific

---

## What was done well
> Engineers should know what to keep doing.
- [Positive note 1]
- [Positive note 2]
