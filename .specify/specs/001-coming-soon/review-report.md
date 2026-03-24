# Code Review Report — 001 Coming Soon

## Uncertainty Declaration

| Claim | Basis | Confidence |
|---|---|---|
| spec.md, plan.md, and api-spec.md do not exist for this feature | Glob search found no files under `.specify/specs/001-coming-soon/` | High |
| constitution.md is not yet written | Read the file directly — it contains only a placeholder stub | High |
| TypeScript strict mode is enabled on both frontend and backend | Read both tsconfig.json files directly | High |
| No hardcoded secrets in source files | Read all source files directly | High |
| CORS origins are localhost-only (no production domain) | Read `backend/src/main.ts` directly | High |
| The waitlist endpoint is intentionally public | Inferred from feature purpose (pre-launch page); no auth guard is present — correctness depends on a spec that does not exist | Medium |
| Race condition between findOne and save is a real risk | Inferred from standard PostgreSQL + TypeORM behavior under concurrent requests | High |
| i18next is not installed or used | `frontend/package.json` contains no i18next dependency; all strings are hardcoded in JSX | High |

---

## Overall verdict: PASS WITH NOTES

The code is clean, logically correct for its stated purpose, and contains no critical security or privacy violations. However, several process-level gaps and two functional issues require attention before the feature can be considered fully ready for production. None of the issues are blockers for a pre-launch waitlist, but they should be tracked.

---

## Findings

### [MAJOR] Race condition between duplicate check and insert

**File:** `/Users/Ioseb_Bidzinashvili/Downloads/AI Project/zgapari/backend/src/modules/waitlist/waitlist.service.ts:17-30`

**Issue:** The `create` method performs a `findOne` check for an existing email and then, if none is found, calls `save`. Under concurrent requests (two users submitting the same email simultaneously), both requests can pass the `findOne` check before either has written to the database. The result is either a duplicate row or a database-level unique constraint error that bubbles up as an unhandled 500 (Internal Server Error) rather than the intended 409 Conflict.

The `@Column({ unique: true })` on the entity does protect the data integrity at the database level, but the application layer will not catch the resulting `QueryFailedError` and will return a 500 to the client instead of a graceful 409.

**Fix:** Remove the explicit `findOne` + `ConflictException` pattern. Instead, attempt the `save` directly and catch the TypeORM `QueryFailedError`. Check `error.code === '23505'` (PostgreSQL unique violation) and rethrow as `ConflictException`. This makes the operation atomic and eliminates the race window.

```typescript
import { QueryFailedError } from 'typeorm'

async create(dto: CreateWaitlistDto): Promise<WaitlistEntry> {
  const entry = this.repo.create({
    email: dto.email.toLowerCase().trim(),
    locale: dto.locale ?? 'ka',
  })
  try {
    return await this.repo.save(entry)
  } catch (err) {
    if (err instanceof QueryFailedError && (err as any).code === '23505') {
      throw new ConflictException('Email already on the waitlist')
    }
    throw err
  }
}
```

**How to verify:** Write a test that calls `create` twice with the same email concurrently (`Promise.all`). Confirm both return 409, not 500.

---

### [MAJOR] CORS is locked to localhost — production origins are not configured

**File:** `/Users/Ioseb_Bidzinashvili/Downloads/AI Project/zgapari/backend/src/main.ts:11-17`

**Issue:** The CORS `origin` array is hardcoded to `http://localhost:5173` and `http://localhost:4173`. When deployed to production the frontend will be served from a different domain (e.g. `https://zghapari.ge`). The browser will block all cross-origin requests from the production frontend, making the feature completely non-functional in production.

**Fix:** Read the allowed origin(s) from an environment variable, falling back to localhost for development:

```typescript
const allowedOrigins = process.env['CORS_ORIGINS']
  ? process.env['CORS_ORIGINS'].split(',')
  : ['http://localhost:5173', 'http://localhost:4173']

app.enableCors({ origin: allowedOrigins, methods: [...] })
```

Add `CORS_ORIGINS=https://zghapari.ge` to `.env.example`.

**How to verify:** Set `CORS_ORIGINS` to a custom domain in a test environment and confirm cross-origin requests succeed. Confirm localhost still works when the variable is absent.

---

### [MAJOR] i18next is absent — CLAUDE.md rule violated

**File:** `/Users/Ioseb_Bidzinashvili/Downloads/AI Project/zgapari/frontend/package.json`
**File:** `/Users/Ioseb_Bidzinashvili/Downloads/AI Project/zgapari/frontend/src/App.tsx:16-17, 31-32, 41-42, 63-66`

**Issue:** CLAUDE.md rule 6 states: "all UI strings go through i18next." The frontend has no i18next dependency and no i18n setup. All strings — including the Georgian tagline, error messages, button label, thank-you text, and footer — are hardcoded directly in JSX as bilingual inline strings (e.g. `'გთხოვთ შეიყვანოთ ელ-ფოსტა / Please enter your email'`).

This is a pragmatic shortcut acceptable for a coming-soon page, but it directly contradicts a non-negotiable project rule. The pattern also sets a bad precedent for future components. When i18n is eventually added, all these strings will need to be extracted.

**Fix:** Install `i18next` and `react-i18next`. Create `src/i18n.ts` with Georgian (`ka`) as the default locale and English as the fallback. Replace all inline strings with `t('key')` calls. This is the required baseline for all components per CLAUDE.md.

**How to verify:** The `t()` function resolves all strings from the locale files. Switching locale programmatically changes the visible text without modifying JSX.

---

### [MINOR] Response body leaks the stored email address back to the caller

**File:** `/Users/Ioseb_Bidzinashvili/Downloads/AI Project/zgapari/backend/src/modules/waitlist/waitlist.controller.ts:12-14`

**Issue:** The `join` handler returns `{ id: entry.id, email: entry.email }`. While the email was submitted by the user themselves (so this is not a third-party data leak), returning the normalized (lowercased) email in the response body is unnecessary. If a user submits `USER@EXAMPLE.COM` and receives `user@example.com` back, the response confirms the normalization, which is harmless here but is a pattern to discourage. The `id` (a UUID) provides no value to the client for this feature.

**Fix:** Return only `{ message: 'ok' }` or an empty body with HTTP 201. There is nothing the frontend needs from the response body beyond the status code.

---

### [MINOR] Loading state uses `'...'` as button label

**File:** `/Users/Ioseb_Bidzinashvili/Downloads/AI Project/zgapari/frontend/src/App.tsx:86`

**Issue:** `{loading ? '...' : 'შეგატყობინებ \u2014 Notify me'}` renders three dots as the loading indicator. This is not announced to screen readers and provides no accessible status. A Georgian user on a slow network will see `...` with no indication of what is happening.

**Fix:** Use an `aria-busy` attribute and a Georgian/English loading string, or a visually hidden `<span>` with `aria-live="polite"`. At minimum replace `'...'` with `'იტვირთება... / Loading...'`.

---

### [MINOR] No rate limiting on the public POST /api/waitlist endpoint

**File:** `/Users/Ioseb_Bidzinashvili/Downloads/AI Project/zgapari/backend/src/modules/waitlist/waitlist.controller.ts`

**Issue:** The endpoint is fully public with no rate limiting. A script can enumerate addresses or flood the database with invalid signups. Since the email column has a unique constraint, a full enumeration attack is possible: submit known emails, check for 409 vs 201 to confirm whether they are registered.

**Fix:** Apply `@nestjs/throttler` with a conservative limit (e.g. 5 requests per minute per IP). This does not prevent all abuse but eliminates trivial scripted attacks.

---

### [MINOR] `synchronize: true` in non-production environments is risky without a documented migration strategy

**File:** `/Users/Ioseb_Bidzinashvili/Downloads/AI Project/zgapari/backend/src/app.module.ts:17`

**Issue:** `synchronize: config.get('NODE_ENV') !== 'production'` means TypeORM will auto-synchronize the schema in development and any non-production environment. This is convenient for development but will silently alter tables — including dropping columns — if the entity definition changes. A staging environment that shares a database with real test data is at risk.

This is an acceptable tradeoff for the current stage of development, but a migration-based approach (TypeORM migrations) should be planned before the first production deployment.

**Fix:** This is a note for the roadmap, not a blocking issue. Document in the `.specify/specs/` that migrations are the target strategy before production launch.

---

### [NOTE] spec.md, plan.md, and api-spec.md do not exist for this feature

**Files:** `.specify/specs/001-coming-soon/` (directory was empty at review time)

The CLAUDE.md pipeline requires spec before plan before build. This feature was built without formal spec, plan, or API contract documents. As a result, several checklist items in the standard review template are **UNVERIFIED** because there is no spec to check against. This is noted rather than treated as a blocking issue given the simplicity of the feature.

**Action:** For all subsequent features, spec.md and plan.md must exist before code review begins.

---

### [NOTE] constitution.md is a stub

**File:** `/Users/Ioseb_Bidzinashvili/Downloads/AI Project/zgapari/.specify/memory/constitution.md`

The file contains only: `Status: NOT YET WRITTEN`. Per CLAUDE.md, the constitution must exist before any feature specs are written. This means every agent in the pipeline has been operating without a constitution. This should be addressed immediately by running the `constitution` skill.

---

### [NOTE] Branching rule may have been violated

**File:** CLAUDE.md (branching rules section)

CLAUDE.md states: "main — stable only, no direct commits" and "feature/NNN-feature-name — one branch per feature." The current git status shows `main` as the active branch with this code committed. This is a process note only; no code change is required.

---

## Spec compliance

- [ ] All acceptance criteria met — UNVERIFIED (no spec.md exists)
- [ ] No out-of-scope code — UNVERIFIED (no spec.md to define scope)

The feature behaves as described in the review request (email capture, deduplication, bilingual UI, Georgian font, async-safe form) and is reasonable for a coming-soon page.

---

## Privacy checklist

- [x] No children's data involved — not applicable to this feature (waitlist email only)
- [x] No logging of submitted email addresses — verified: no `console.log`, `Logger`, or body dump calls found in any backend file
- [x] No sensitive data in error responses — verified: ConflictException message is generic ("Email already on the waitlist"); no stack traces or internal details exposed
- [ ] Photo deletion/expiry behavior — not applicable to this feature
- [ ] Character references isolated storage — not applicable to this feature
- [ ] Presigned URL TTL — not applicable to this feature
- [ ] Right-to-erasure behavior — UNVERIFIED: the `deleted_at` column exists on the entity (soft-delete support is present), but there is no deletion endpoint and no documented erasure flow. If a user asks to be removed from the waitlist, there is no mechanism to do so. This should be tracked.

---

## Georgian / multilingual checklist

- [x] Georgian font loaded — Noto Sans Georgian loaded via Google Fonts in `frontend/index.html:9`; `lang="ka"` set on `<html>` element
- [x] Locale stored with content — `locale` column present on `waitlist_entries` entity; defaults to `'ka'`; client can pass `locale` in the request body
- [x] Locale parameterized in backend — `CreateWaitlistDto` accepts optional `locale` field, validated against `['ka', 'en']` allowlist
- [x] Mkhedruli encoding risk — Georgian text is UTF-8 encoded inline in `.tsx` source; PostgreSQL with UTF-8 collation (standard for `pg`) handles this correctly; no encoding risk identified
- [ ] Frontend i18n via i18next — FAIL: strings are hardcoded, not routed through i18next (see MAJOR finding above)
- [ ] PDF rendering fonts — not applicable to this feature

---

## Positive notes

1. **Entity design is correct.** The `WaitlistEntry` entity has `id` (UUID), `created_at`, `updated_at`, `locale`, and `deleted_at` — satisfying every CLAUDE.md table rule in one go for a feature where the spec was never written.

2. **Unit tests are thorough and well-structured.** Five tests covering the happy path, email normalization, locale defaulting, locale override, and the duplicate rejection path. The mock repository pattern is clean and idiomatic for NestJS/Jest. This is the standard to maintain.

3. **No hardcoded secrets anywhere.** All credentials (DATABASE_URL, REDIS_HOST, REDIS_PORT, JWT_SECRET) are read from environment variables via ConfigService. The `.env.example` file makes local setup self-documenting.

4. **ValidationPipe is properly configured.** `whitelist: true` strips unknown fields; `forbidNonWhitelisted: true` returns a 400 if unknown fields are sent; `transform: true` enables class-transformer. This is the correct production configuration.

5. **Frontend form UX is solid.** Handles loading state (disabled input + button), error state (inline message), empty-string guard, success state (thank-you message), and network errors — satisfying the CLAUDE.md requirement that every component handles all three states.

6. **TypeScript strict mode is active on both sides.** Both `tsconfig.json` files have `"strict": true`; the frontend additionally has `noUnusedLocals` and `noUnusedParameters`. No `any` types were found in any reviewed file.

7. **Georgian language is treated as a first-class citizen in the UI.** Georgian text appears first, before English, in all bilingual strings. The `<html lang="ka">` attribute is correct. Font loading is via `<link rel="preconnect">` for performance. These are good habits to carry forward.
