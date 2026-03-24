---
name: plan
trigger: "use plan skill — [any tech constraints]"
agent: architect
output: .specify/specs/NNN-feature-name/plan.md + data-model.md + contracts/api-spec.md
---

# Skill: Plan

## When to use
After the spec is approved and clarifications are complete. Never before.

## Goal
Produce three documents that engineers can build from without making any architectural guesses.

## Pre-flight checklist
Before starting, verify all of these exist:
- [ ] `.specify/memory/constitution.md`
- [ ] `.specify/specs/NNN-feature-name/spec.md` — with developer approval confirmed
- [ ] `.specify/research/` — check if relevant research reports exist for this feature
  - If this feature involves image generation → `character-consistency-spike.md` must exist
  - If this feature involves payments → `payment-providers.md` must exist
  - If these are missing → STOP and tell the developer which research must be done first

## Steps

1. Read all pre-flight documents
2. Read the developer's tech constraints from the trigger (e.g. "use PostgreSQL views for this")
3. Design the system — think before writing:
   - What components are new vs modified?
   - What is the data model?
   - What are all the API endpoints?
   - Are there async jobs? How do they chain?
   - What are the privacy and security implications?
4. Write `plan.md` using `.specify/templates/plan-template.md`
5. Write `data-model.md` using `.specify/templates/data-model-template.md`
6. Write `contracts/api-spec.md` using `.specify/templates/api-spec-template.md`
7. Present a summary to the developer: "Here is what I designed. Key decisions: [3 bullet points]. Please review all three documents before approving."

## Zghapari-specific rules
- Every image generation flow must be async — never design a synchronous endpoint for it
- Every content table needs a locale column — even if only Georgian is in scope now
- Character reference must be an input to every illustration generation — design the data flow to make this explicit
- Payment provider must be behind an interface — never design direct BOG/TBC calls in business logic
- Photo storage and character reference storage must be separate in the design

## Rules
- If the spec is ambiguous in a way that affects the architecture, stop and ask — do not assume
- Flag any decision that deviates from the agreed tech stack as ⚠️ DECISION NEEDED
- api-spec.md must cover every endpoint the frontend will need — no gaps
- If research reports exist and recommend a specific approach, follow it — do not invent alternatives
