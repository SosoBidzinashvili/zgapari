---
name: clarify
trigger: "use clarify skill"
agent: ba
output: Updates the existing spec.md with a Clarifications section
---

# Skill: Clarify

## When to use
After `specify` produces a spec.md and before `plan` begins. Run this to fill gaps that would cause the architect to make wrong assumptions.

## Goal
Identify the top 5 ambiguities in the current spec and resolve them with the developer before any architecture decisions are made. Mistakes caught here are free. Mistakes caught in code are expensive.

## Steps

1. Read the current feature's `spec.md`
2. Read `.specify/memory/constitution.md`
3. Identify the 5 questions whose answers would most change how the architect designs the system
4. Present questions one at a time — wait for each answer before asking the next
5. After all 5 are answered, add a `## Clarifications` section to `spec.md` with the answers
6. If any answer changes the scope, update the relevant acceptance criteria or out-of-scope list
7. Say: "Spec updated. Ready to proceed to planning."

## How to pick the right 5 questions
Focus on things that would cause wrong architecture decisions:
- Ambiguous user flows with multiple valid interpretations
- Edge cases involving Georgian text, children's photos, or character references
- Anything that touches the free/paid tier boundary
- Anything that touches privacy or data deletion
- Performance requirements (how fast? how many concurrent users?)
- Error handling — what happens when AI generation fails mid-book?

## Example good questions for Zghapari features
- "If a parent starts creating a story but closes the browser halfway through generation — what should happen when they return?"
- "If the character reference doesn't exist for the selected art style — should we block the user or auto-generate one first?"
- "Should the page count limit on free tier be enforced at the start of creation (block), or at export (watermark)?"

## Rules
- Ask one question at a time — not a list of 5 at once
- Never ask questions that are already answered in the spec or constitution
- Never ask questions about implementation — only about behavior and requirements
- Update the spec file after answers — do not just keep the answers in the conversation
