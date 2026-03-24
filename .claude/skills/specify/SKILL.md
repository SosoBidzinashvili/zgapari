---
name: specify
trigger: "use specify skill — [feature idea]"
agent: ba
output: .specify/specs/NNN-feature-name/spec.md
---

# Skill: Specify

## When to use
At the start of every new feature — before planning, before architecture, before any code.

## Goal
Produce a `spec.md` that is so clear and complete that the architect can design the system without asking the developer any questions.

## Steps

1. Read `.specify/memory/constitution.md` — this governs all decisions
2. Read `.docs/Zghapari_Development_Plan.docx` for product context
3. Check `.specify/specs/` — count existing folders to determine the next NNN number
4. Ask the developer up to 3 clarifying questions before writing anything:
   - What is the main user action this feature enables?
   - Are there any constraints not obvious from the feature name?
   - Is there anything explicitly out of scope?
5. Write the spec using the template at `.specify/templates/spec-template.md`
6. Save to `.specify/specs/NNN-feature-name/spec.md`
7. Present to developer: "Here is the spec. Review it and say approved or tell me what to change."

## Output structure
Follow `.specify/templates/spec-template.md` exactly.

## Zghapari-specific things to always include
- How does this feature behave in Georgian vs English?
- Does it involve a child profile or character reference?
- Does it touch photo storage or character generation?
- Is there a free-tier / paid-tier difference in behavior?
- What does this look like on a 375px mobile screen?
- What are the empty state, loading state, and error state?

## Rules
- Write acceptance criteria as testable statements — not intentions
- Explicitly list out-of-scope items — this protects engineers from scope creep
- Never assume a technical solution — describe behavior only
- If the feature idea conflicts with the constitution, flag it immediately
- Do not start writing until you have asked your 3 clarifying questions
