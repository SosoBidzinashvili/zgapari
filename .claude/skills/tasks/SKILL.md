---
name: tasks
trigger: "use tasks skill"
agent: orchestrator
output: .specify/specs/NNN-feature-name/tasks.md
---

# Skill: Tasks

## When to use
After `plan` is approved. Before `implement`.

## Goal
Break the approved plan into a specific, ordered list of tasks that engineers can execute without making decisions. Each task is small enough to complete in one focused session.

## Pre-flight checklist
- [ ] `plan.md` exists and developer has approved it
- [ ] `data-model.md` exists
- [ ] `contracts/api-spec.md` exists

## Steps

1. Read `plan.md`, `data-model.md`, `api-spec.md`, and `spec.md`
2. Break the work into tasks following the rules below
3. Write `tasks.md` using `.specify/templates/tasks-template.md`
4. Present to developer: "Here are N tasks. Tasks marked [P] can run in parallel. Review and say approved."

## Task writing rules

### Every task must include
- Which agent executes it (frontend-engineer / backend-engineer / ai-pipeline-engineer / integrations-engineer)
- The exact file(s) to create or modify
- A specific definition of done — what does "complete" look like?
- Its dependencies — which tasks must finish before this one starts

### Ordering rules
- Database migrations always before service code
- Service code always before API endpoints
- API endpoints always before frontend components that call them
- Tests are written alongside or immediately after implementation

### Parallel markers
Mark tasks with [P] when they can run simultaneously:
- Frontend and backend tasks for the same feature can usually run in parallel once the API contract is agreed
- AI pipeline tasks can run in parallel with frontend tasks
- Integrations tasks can run in parallel with other build tasks

### Task size
- One task = one focused session (30–90 minutes of work)
- If a task takes more than 90 minutes, split it
- Database migrations are always a separate task from the code that uses them

## Example task format
```
### Task 003 — Create child profile database migration
Agent: backend-engineer
Depends on: Task 002 (database setup)
Parallel: No — must complete before Tasks 004, 005
Files: backend/src/database/migrations/NNN-create-child-profiles.ts

Create a migration that adds the `child_profiles` table with:
- id (UUID, primary key)
- user_id (UUID, foreign key to users)
- name (varchar 100, not null)
- date_of_birth (date, not null)
- language_preference (varchar 5, default 'ka')
- created_at, updated_at (timestamps)
- deleted_at (timestamp, nullable — soft delete)

Done when: migration runs successfully with `npm run migration:run`
```

## Rules
- Never write a task that says "implement the feature" — every task must be specific
- Always specify which agent owns each task
- Always specify file paths — not just "create a service" but "create `src/modules/children/children.service.ts`"
- Tasks for the same agent must be in the order they should be executed
- The final task for every feature must be "run all tests" owned by tester
