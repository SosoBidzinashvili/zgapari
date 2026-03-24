---
name: constitution
trigger: "use constitution skill"
agent: ba
output: .specify/memory/constitution.md
---

# Skill: Constitution

## When to use
Run this once at project start, before any feature specs are written. Also run it when a major product direction changes.

## Goal
Produce a `constitution.md` that every agent reads before doing any work. It is the single source of truth for project principles, constraints, and quality standards.

## Steps

1. Read `CLAUDE.md`
2. Read `.docs/Zghapari_Development_Plan.docx` — full product context
3. Read `.docs/pre_development_roadmap.md` — pre-development checklist
4. Ask the developer: "Is there anything about priorities, team constraints, or quality standards not covered in the docs that I should include?"
5. Write `.specify/memory/constitution.md` using the structure below
6. Present it to the developer for approval before saving

## Output structure

```markdown
# Zghapari — Project Constitution

## Product vision
[One-liner + why this exists]

## Who we are building for
[Primary user: Georgian parents, children ages 2–10. Secondary users. Their context and constraints.]

## Non-negotiable principles
[Things that cannot be compromised regardless of deadline or complexity]
- Character consistency across all illustrations — this IS the product promise
- Children's photo privacy — photos are processed then offered for deletion
- Georgian language quality — never ship poor Georgian text
- Mobile-first — 70% of Georgian users are on mobile
- Cultural authenticity — Georgian art, values, and language are central, not decorative

## Technical constraints (all agents must respect these)
[From Section 10 of the product description — the hard architectural constraints]

## Definition of done — MVP
[What a shippable MVP looks like — from Section 8 of the product description]

## Quality bar
[What "good enough" means for this product — Georgian text, character consistency, privacy]

## What we are NOT building yet
[Post-MVP features — from Section 8 out-of-scope list]

## How we work
[Spec-driven, human-in-the-loop, agents are called manually, nothing moves without approval]
```

## Rules
- The constitution must be specific to Zghapari — not generic project principles
- Every principle must be actionable — agents must be able to make decisions from it
- Present for developer approval before writing the file
