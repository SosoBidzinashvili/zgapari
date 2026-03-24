# Technical Plan — [Feature Name]

> Spec: NNN | Status: Draft / Approved | Author: Architect agent | Date: YYYY-MM-DD

---

## Architecture overview
[How this feature fits into the existing Zghapari system. What is new vs modified.]

---

## Components

### New components
| Component | Type | Location | Purpose |
|---|---|---|---|
| [e.g. ChildProfileService] | NestJS Service | `backend/src/modules/children/` | Manages child profile CRUD |

### Modified components
| Component | Location | What changes |
|---|---|---|

---

## Key technical decisions

### Decision 1 — [Topic]
**Choice:** [What was decided]
**Rationale:** [Why]
**Alternatives considered:** [What else was evaluated and why it was rejected]

### Decision 2 — [Topic]
[Repeat]

---

## Data flow

### Happy path — [main use case]
```
[Step 1: User action]
  → [Step 2: Frontend call]
  → [Step 3: API endpoint]
  → [Step 4: Service logic]
  → [Step 5: Database / AI pipeline / Storage]
  → [Step 6: Response to frontend]
  → [Step 7: UI update]
```

---

## AI pipeline (if applicable)
- Which models are involved?
- How is the character reference injected?
- What does the job queue look like for this feature?
- How is progress reported to the frontend?
- What happens if generation fails?

---

## Security and privacy
- Auth requirements for each new endpoint
- What sensitive data is handled? How is it protected?
- Photo deletion flow (if applicable)
- Presigned URL policy for any new assets

---

## Performance
- Any operations that need to be async?
- Caching opportunities?
- Expected load and how the design handles it?

---

## Flags and open questions
[Anything the developer needs to decide before engineers can start. Mark with ⚠️ DECISION NEEDED]
