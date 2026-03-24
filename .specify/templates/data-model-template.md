# Data Model — [Feature Name]

> Spec: NNN | Status: Draft / Approved | Author: Architect agent | Date: YYYY-MM-DD

---

## ⚠️ Uncertainty declaration
> List any schema decisions where you are not certain.
> Do not guess — mark uncertain items clearly and ask the developer.

| Decision | Uncertainty | Question for developer |
|---|---|---|
| [e.g. character_references storage type] | [JSON vs separate table?] | [Which do you prefer?] |

---

## New tables

### Table: `[table_name]`
**Purpose:** [One sentence — what this table stores and why]

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() | |
| `[column_name]` | `[type]` | [NOT NULL / NULLABLE / UNIQUE / FK] | [Why this type, any special handling] |
| `locale` | `VARCHAR(10)` | NOT NULL, DEFAULT 'ka' | Always include — even if only Georgian now |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT NOW() | |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT NOW() | Auto-updated via trigger |
| `deleted_at` | `TIMESTAMPTZ` | NULLABLE | Soft delete — NULL means active |

**Indexes:**
```sql
CREATE INDEX idx_[table]_[column] ON [table_name]([column_name]);
-- Reason: [why this index is needed — what query it serves]
```

**Foreign keys:**
```sql
ALTER TABLE [table_name]
  ADD CONSTRAINT fk_[table]_[ref_table]
  FOREIGN KEY ([column]) REFERENCES [ref_table](id)
  ON DELETE [CASCADE / SET NULL / RESTRICT];
-- Reason: [what this relationship means in product terms]
```

---

### Table: `[table_name_2]`
[Repeat structure]

---

## Modified tables

### Table: `[existing_table_name]`
**What changes and why:**

| Column | Change | Before | After |
|---|---|---|---|
| `[column]` | ADD / MODIFY / DROP | [old definition] | [new definition] |

**Migration notes:**
[Any data migration required? Default values for existing rows?]

---

## Entity relationships

```
[users] 1──────< [child_profiles]
                        |
                        1
                        |
                        < [character_references] (one per art style)
                        
[child_profiles] 1──────< [books]
                               |
                               1
                               |
                               < [pages]
```

---

## Migrations

### Migration file: `NNN-[description].ts`
```typescript
// Summary of what this migration does
// Up: [what it creates/adds]
// Down: [how to reverse it]
```

**Run order:** [Does this migration depend on another? Which one?]

---

## Privacy notes
> Required for any table that stores user content, photos, or children's data.

| Table | Sensitive data | Retention policy | Deletion behavior |
|---|---|---|---|
| [table] | [what's sensitive] | [how long kept] | [hard delete / soft delete / anonymize] |
