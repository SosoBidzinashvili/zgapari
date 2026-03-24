---
name: ux-spec
trigger: "use ux-spec skill"
agent: ux-designer
output: .specify/specs/NNN-feature-name/ux-spec.md
---

# Skill: UX Spec

## When to use
After `clarify` is approved. Before `plan`. The architect reads ux-spec.md when designing the frontend components — it must exist before planning begins.

## Updated pipeline position
```
specify → clarify → ux-spec ← YOU ARE HERE → plan → tasks → implement → review → ship
```

## Pre-flight checklist
- [ ] `spec.md` exists and is approved
- [ ] Clarifications section in `spec.md` is complete
- [ ] Check `.specify/specs/` for other ux-spec.md files — read them for UI consistency

## Steps

1. Read `spec.md` including the clarifications section
2. Read `.specify/memory/constitution.md`
3. Check existing `ux-spec.md` files in other feature folders for established patterns
4. Ask the developer 2 questions before designing:
   - "Are there any existing screens this feature extends or connects to?"
   - "Any strong opinions on layout or interaction for this specific feature?"
5. Design every screen following the template at `.specify/templates/ux-spec-template.md`
6. Write the full copy in both Georgian and English
7. Draw the user flow in ASCII
8. Present to developer: "Here is the UX design. Please review each screen and the copy before approving."
9. Wait for approval before the plan skill runs

## What good output looks like
The frontend engineer should be able to build the entire feature UI without making a single design decision. If they have to guess anything — the layout, the copy, the error message — the ux-spec is incomplete.

## Rules
- Design mobile (375px) first — desktop is a secondary consideration
- Every screen must have all four states: default, loading, empty, error
- Copy is never a placeholder — write the actual Georgian and English words
- Do not proceed to plan until developer says "approved"
