# Zghapari — CLAUDE.md

> This file is loaded at the start of every Claude Code session.
> Every agent reads this before doing anything.

---

## What this project is

**Zghapari** (ზღაპარი — Georgian for "fairy tale") is a web platform that lets parents create personalized, AI-illustrated children's storybooks rooted in Georgian culture and language.

**One-liner:** Turn your child into the hero of their own Georgian fairy tale — in minutes.

Full product description: `.docs/Zghapari_Development_Plan.docx`
Pre-development roadmap: `.docs/pre_development_roadmap.md`
Project constitution: `.specify/memory/constitution.md`

---

## Tech stack

| Area | Decision |
|---|---|
| Frontend | React 18 + TypeScript (strict) |
| Backend | Node.js + TypeScript + NestJS |
| Database | PostgreSQL + TypeORM |
| Job queue | BullMQ + Redis |
| Image generation | Nano Banana Pro (Google Gemini 3 Pro Image) |
| File storage | S3-compatible (AWS or GCS) |
| PDF generation | Puppeteer (server-side) |
| Auth | JWT + Google OAuth |
| Payments | BOG iPay or TBC Pay — abstracted behind interface |
| CI/CD | GitHub Actions |

---

## Repository structure

```
zgapari/
├── CLAUDE.md                          ← you are here
├── frontend/                          ← React app (Soso owns this)
├── backend/                           ← Node.js API (partner owns this)
├── .docs/                             ← project reference documents
├── .specify/
│   ├── memory/constitution.md         ← read this after CLAUDE.md
│   ├── specs/                         ← one folder per feature (NNN-name)
│   │   └── NNN-feature-name/
│   │       ├── spec.md
│   │       ├── plan.md
│   │       ├── tasks.md
│   │       ├── data-model.md
│   │       ├── contracts/api-spec.md
│   │       ├── review-report.md
│   │       └── qa-checklist.md
│   ├── research/                      ← Phase 0 research reports
│   └── templates/                     ← templates for all spec documents
└── .claude/
    ├── agents/                        ← one file per agent role
    └── skills/                        ← one folder per SDLC skill
```

---

## How we work — the pipeline

Every feature follows this exact sequence. Nothing skips a phase.

```
Phase 0  → Research agent      — feasibility spikes, payment research, legal
Phase 1  → BA agent            — constitution, user stories, acceptance criteria
Phase 1  → BA agent            — clarify ambiguities before design
Phase 2  → UX Designer agent   — ux-spec.md — every screen, state, copy
Phase 2  → Architect agent     — plan.md, data-model.md, api-spec.md
Phase 3  → Engineers           — build (frontend + backend + AI pipeline + integrations)
Phase 4  → Code reviewer       — review report [PARALLEL]
Phase 4  → Tester              — tests + QA checklist [PARALLEL]
Phase 5  → DevOps agent        — PR on GitHub
```

**Human checkpoint between every phase.** Nothing moves forward without the developer saying "approved".

---

## How to invoke agents

All agents are called manually. You are always in control.

| What you type | What happens |
|---|---|
| `use constitution skill` | BA writes the project constitution |
| `use specify skill — [idea]` | BA writes a feature spec |
| `use clarify skill` | BA fills gaps in the current spec |
| `use ux-spec skill`          | UX Designer designs every screen, state, and copy |
| `use plan skill — [constraints]` | Architect designs the system |
| `use tasks skill` | Orchestrator breaks plan into tasks |
| `use implement skill` | Engineers build the feature |
| `use review skill` | Code reviewer + tester run in parallel |
| `use ship skill` | DevOps creates the PR |

You can also call agents directly:
- `research agent — evaluate Georgian LLM quality`
- `architect agent — review the data model for the child profile feature`
- `code reviewer — check the payment integration code`

---

## Non-negotiable rules for every agent

### Never break these
1. **Read this file and constitution.md before every task** — no exceptions
2. **Never skip a phase** — spec before plan, plan before build, always
3. **Never proceed without developer approval** — wait for "approved" between phases
4. **Character consistency is the core product promise** — every image generation call must include the character reference
5. **Children's photo privacy is critical** — photos are processed then offered for deletion; never stored long-term; never logged
6. **Georgian language is not optional** — all UI strings go through i18next; Georgian script must render correctly everywhere including PDFs
7. **Mobile-first** — build for 375px width first; 70% of Georgian users are on mobile
8. **Payments are abstracted** — never call BOG iPay or TBC Pay directly in business logic; always through the PaymentProvider interface
9. **Async for image generation** — never make illustration generation synchronous; always BullMQ jobs
10. **No hardcoded secrets** — all credentials via environment variables

### Code standards
- TypeScript strict mode — no `any`, no `as unknown`
- Every table: `id` (UUID), `created_at`, `updated_at`, `locale`
- Every content table: soft deletes (`deleted_at`)
- Every API endpoint: auth guard unless explicitly public
- Every new backend service method: accompanied by a unit test
- Every new frontend component: handles loading state, error state, and empty state

### Branching
- `main` — stable only, no direct commits
- `feature/NNN-feature-name` — one branch per feature
- PRs require approval from the other developer before merging

---

## Developer ownership

| Area | Owner |
|---|---|
| `/frontend` | Soso |
| `/backend` | Partner |
| `.specify/` | Both |
| `.claude/` | Both |
| Architecture decisions | Both (discuss before deciding) |

---

## Current status

Check `.specify/specs/` to see which features have been built.
Check `.specify/research/` to see which Phase 0 research is complete.
The first thing to do is run the `constitution` skill, then the `research` agent for Phase 0.

---

## Key files to read for full context

1. This file (you are here)
2. `.specify/memory/constitution.md` — project principles
3. `.docs/Zghapari_Development_Plan.docx` — full product and technical plan
4. `.docs/pre_development_roadmap.md` — what to do before writing code
5. `.specify/research/` — findings from Phase 0 spikes
