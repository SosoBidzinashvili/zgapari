---
name: implement
trigger: "use implement skill"
agent: orchestrator (delegates to engineers)
output: Code committed to feature branch
---

# Skill: Implement

## When to use
After `tasks.md` is approved. This is where code gets written.

## Goal
Execute the tasks in `tasks.md` in the correct order. Parallel tasks run simultaneously. The developer reviews code in VS Code as it is written and approves before moving to the next phase.

## Pre-flight checklist
- [ ] `tasks.md` exists and developer has approved it
- [ ] Git is on the correct feature branch (create it if it doesn't exist: `feature/NNN-feature-name`)
- [ ] All agents needed for this feature are available

## Steps

1. Read `tasks.md` — identify the full task list, dependencies, and parallel markers
2. Group tasks by execution wave:
   - Wave 1: tasks with no dependencies
   - Wave 2: tasks that depend only on Wave 1
   - And so on
3. For each wave:
   a. Announce which tasks are starting and which agents own them
   b. Execute [P] tasks simultaneously
   c. Execute sequential tasks in order
   d. After each task, present the output to the developer
   e. Ask: "Task NNN complete. Does this look right?" before proceeding
4. After all tasks: "All tasks complete. Ready for review phase."

## How to present code to the developer
After each task completes, show:
- Which files were created or modified
- A brief summary of what the code does (2–3 sentences)
- Any decisions that were made and why
- Any open questions or things that need developer attention

## What agents do during implementation

### frontend-engineer
- Works only in `/frontend`
- Follows `api-spec.md` for all API calls — never invents endpoint shapes
- Uses i18next for every string — adds keys to `ka.json` and `en.json`
- After each component: checks it renders correctly at 375px

### backend-engineer
- Works only in `/backend`
- Implements endpoints exactly as defined in `api-spec.md`
- Creates TypeORM migrations before service code
- Writes a unit test alongside every service method

### ai-pipeline-engineer
- Works only in `/backend/src/modules/ai-pipeline`
- Reads character consistency research before any generation code
- Every image generation call includes character reference injection
- Every job is independently retriable

### integrations-engineer
- Works only in `/backend/src/modules/integrations`
- Follows payment provider research recommendations exactly
- Tests Georgian font rendering in PDF output before marking PDF tasks complete

## Mid-implementation decisions
If an engineer encounters something not covered in the plan:
1. Stop immediately
2. Describe the situation to the developer
3. Wait for a decision before continuing
4. Do not invent solutions to unplanned problems

## Rules
- Never skip tasks — even if they seem small
- Never reorder tasks without telling the developer
- Code is never "done" until the developer has seen it and said "looks good"
- If a task reveals that the plan is wrong, stop the implementation and flag it
- Never commit directly to `main` — always on the feature branch
