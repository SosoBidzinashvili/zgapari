# UX Spec — [Feature Name]

> Spec: NNN | Status: Draft / Approved | Author: UX Designer agent | Date: YYYY-MM-DD

---

## User flow

```
[Entry point]
      |
      v
[Screen 1: Name] ──(error)──> [Error state]
      |
      v
[Screen 2: Name] ──(back)───> [Screen 1]
      |
      |(success)
      v
[Screen 3: Name]
      |
      v
[Exit point / next feature]
```

---

## Screens

---

### Screen 1 — [Screen name]
**Route:** `/path/to/screen`
**Entry from:** [where the user comes from]
**Exits to:** [where the user goes next]

#### Layout (top to bottom, mobile 375px)
```
┌─────────────────────────┐
│ [Header / back button]  │
│                         │
│ [Main content area]     │
│                         │
│ [Primary CTA button]    │
└─────────────────────────┘
```

**What's on screen:**
- [Element 1 — description and purpose]
- [Element 2 — description and purpose]
- [Primary CTA — what it does]

**Primary action:** [The one thing the user is meant to do]
**Secondary actions:** [Everything else available]

#### States

**Default state:**
[What the screen looks like when the user first arrives]

**Loading state:**
[What the user sees while waiting — specific message, not just "spinner"]

**Empty state:**
[What the screen looks like with no data — message + suggested action]

**Error state:**
[What the user sees when something goes wrong — specific, warm, actionable]

#### Copy

| Element | Georgian (ka) | English (en) |
|---|---|---|
| Screen title | | |
| Primary button | | |
| Secondary button | | |
| Empty state message | | |
| Loading message | | |
| Error message | | |
| Confirmation message | | |

#### Mobile notes
[Anything specific to touch interaction, small screen layout, keyboard behavior]

#### Georgian-specific notes
[Does layout shift with Georgian text? Any cultural considerations?]

---

### Screen 2 — [Screen name]
[Repeat the same structure for every screen in the feature]

---

## Component inventory
List every new UI component this feature introduces. The frontend engineer creates these.

| Component name | Description | Reusable? |
|---|---|---|
| [e.g. CharacterPreviewCard] | [Shows illustrated character with art style selector] | Yes — used in profile and story creation |
| [e.g. GenerationProgressBar] | [Shows illustration X of N with animated progress] | Yes — used in all generation flows |

---

## Consistency notes
[Anything that must match existing screens or patterns from other ux-spec.md files]

---

## Open questions for developer
[Design decisions that need a human answer before the frontend engineer starts]
- [ ] [Question 1]
- [ ] [Question 2]
