# Project: Zgapari

## What we're building
A web application with a React frontend and Node.js backend.
Two developers collaborate — one owns frontend agents, one owns backend agents.

## Tech stack
- Frontend: React (JavaScript)
- Backend: Node.js
- Repository: monorepo (one repo, two folders)

## Folder structure
zgapari/
├── frontend/       # React app — owned by Soso
├── backend/        # Node.js API — owned by partner
└── .claude/
    └── agents/     # subagent definitions

## Rules all agents must follow
- Never touch folders outside your assigned area
- Always write clean, readable code with comments
- Use English for all code, variable names, and comments
- Before starting any task, read this file fully
- Ask before making structural changes to the project

## Branching
- main = stable, working code only
- Each feature gets its own branch: feature/name-of-feature
- Never push directly to main