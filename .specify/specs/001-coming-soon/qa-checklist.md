# QA Checklist — Feature 001: Coming Soon / Waitlist

**Feature:** Coming Soon landing page with email waitlist sign-up
**Date written:** 2026-03-24
**Tester:** QA Agent (Phase 4)
**Status:** PENDING — no items have been executed; no item is marked passing

---

## How to use this checklist

Each item is preceded by `[ ]`. After manual verification, replace `[ ]` with
`[x]` and append the tester's initials and date, for example:
`[x] — IB 2026-03-24`

Do NOT mark any item passing unless you physically performed the step and
observed the stated outcome. Never guess. If a step cannot be executed,
write `[N/A — reason]`.

---

## 1. Georgian text rendering (Noto Sans Georgian)

- [ ] Open the app in Chrome on desktop. Verify all Georgian script characters
  (გახადე შენი შვილი ქართული ზღაპრის გმირად) render as Mkhedruli glyphs, not
  as boxes or question marks.
- [ ] Open Chrome DevTools > Network > Fonts. Confirm a font file matching
  "Noto Sans Georgian" (or equivalent Georgian-supporting font) is loaded and
  returns HTTP 200.
- [ ] Open the app in Firefox. Repeat the glyph check.
- [ ] Open the app in Safari (macOS). Repeat the glyph check.
- [ ] Confirm the footer text "© 2026 Zghapari" renders without any encoding
  artefacts.

---

## 2. Mobile layout at 375px (iPhone SE viewport)

- [ ] Open Chrome DevTools, set device to "iPhone SE" (375 x 667 logical px).
  Verify the page is not horizontally scrollable.
- [ ] Verify the email input field does not overflow or clip at 375px width.
- [ ] Verify the "Notify me / შეგატყობინებ" button is fully visible and
  tappable at 375px (minimum touch target 44x44px recommended).
- [ ] Verify the Georgian tagline paragraph does not overflow horizontally —
  text wraps cleanly within the container.
- [ ] Verify the English tagline paragraph does not overflow horizontally.
- [ ] Verify no text overlaps with any other element at 375px.
- [ ] Rotate to landscape (667 x 375). Verify the layout still fits without
  horizontal scroll.

---

## 3. Form validation — empty and invalid email

### 3a. Empty email (client-side check, no network call)
- [ ] Leave the email input blank and click the submit button. Verify the error
  message "გთხოვთ შეიყვანოთ ელ-ფოსტა / Please enter your email" appears.
- [ ] Open DevTools > Network. Confirm no POST request was made.

### 3b. Invalid email format
- [ ] Type "plaintext" (no @ symbol) into the email input and submit. Observe
  the browser behaviour — the `type="email"` attribute should trigger a browser
  tooltip on browsers that enforce it (Chrome, Firefox). Document which browser
  was used.
- [ ] Note: the current implementation uses `noValidate` on the form, which
  disables browser validation. With `noValidate`, invalid email formats ARE
  submitted to the API. The API returns 400. Verify the generic error message
  "დაფიქსირდა შეცდომა — სცადეთ თავიდან / Something went wrong, please try
  again" appears when 400 is received.
  -- ⚠️ POTENTIAL GAP: the frontend does not currently validate email format
  client-side (only checks for empty string). Consider adding email-format
  validation to show a more specific error without a round-trip. Flag for
  developer decision.

---

## 4. Success flow — thank-you message

- [ ] Enter a fresh email address not previously registered. Click submit.
- [ ] Verify the button shows "..." (loading indicator) while the request is
  in progress.
- [ ] Verify the email input and submit button are disabled during loading.
- [ ] After submission, verify the form disappears and the thank-you block
  appears containing:
    - "გმადლობთ! / Thank you!"
    - "შეგატყობინებთ გახსნისთანავე."
    - "We'll let you know as soon as we launch."
- [ ] Verify the thank-you block is fully visible at 375px without overflow.
- [ ] Reload the page and submit the same email again — verify the 409 conflict
  message appears (confirming the entry was actually saved to the database).

---

## 5. Duplicate email — 409 Conflict

- [ ] Submit an email address that is already in the `waitlist_entries` table
  (use an address submitted in step 4, or insert one directly via psql in the
  test environment).
- [ ] Verify the error message
  "ეს ელ-ფოსტა უკვე რეგისტრირებულია / This email is already registered"
  appears.
- [ ] Verify the form remains visible (not replaced by the thank-you block).
- [ ] Verify the email input is still editable so the user can correct their
  entry.
- [ ] Verify the submit button is re-enabled after the 409 response.

---

## 6. Network offline / server unreachable

- [ ] In DevTools > Network, set throttling to "Offline".
- [ ] Submit a valid email.
- [ ] Verify the error message
  "ქსელის შეცდომა — სცადეთ თავიდან / Network error — please try again" appears.
- [ ] Verify the submit button is re-enabled after the network error.
- [ ] Restore network. Submit the same email again. Verify it succeeds (or
  returns 409 if it was saved before the network dropped).

---

## 7. Privacy — no email in console or logs

- [ ] Open DevTools > Console. Clear the console.
- [ ] Submit a valid email (e.g., "privacy-test-TIMESTAMP@example.com" with a
  timestamp to make it unique and searchable).
- [ ] Verify the submitted email address does NOT appear anywhere in the
  console output (no console.log, console.warn, console.error entries
  containing it).
- [ ] Check the backend logs (stdout of the NestJS process) for the same
  email string. Verify it does not appear.
- [ ] Verify the 201 response body returned to the browser contains only
  `{id, email}` — confirm no sensitive fields (locale, createdAt, deletedAt)
  are exposed unintentionally.
- [ ] On the 409 error path, verify the error response body does not echo back
  the submitted email address in the `message` field.

---

## 8. Keyboard accessibility

- [ ] Load the page. Without touching the mouse, press Tab once. Verify focus
  moves to the email input (visible focus ring or outline).
- [ ] Press Tab again. Verify focus moves to the submit button.
- [ ] Press Tab again. Verify focus either cycles back to the top or moves to
  the footer link (no focus trap).
- [ ] With focus on the email input, type a valid email and press Enter.
  Verify the form submits (same behaviour as clicking the button).
- [ ] Verify the focus ring / outline on the input is visible against the page
  background (meets WCAG AA contrast for focus indicators — note, not fully
  auditable here without a contrast tool, but visually check it is not
  invisible).
- [ ] After a successful submission, verify the thank-you message is announced
  to screen readers: use VoiceOver (macOS) or NVDA (Windows) and confirm the
  thank-you content is read out automatically or reachable by Tab.

---

## Mandatory Privacy and Safety Checklist

The following sections are required on every feature per QA agent rules.
Items marked N/A include the reason.

### Photo handling
- [ ] N/A — this feature does not handle photo uploads.

### Character references
- [ ] N/A — this feature does not generate or reference character images.

### Children's data in logs (CRITICAL)
- [ ] During form submission, verify logs contain no story text, photo URLs,
  or character reference URLs. (This feature collects only email addresses,
  not children's data. Verify the email is also absent from logs per section 7
  above.)
- [ ] Error logs / stack traces contain no PII. Verify by triggering a 409
  and checking backend stderr for the submitted email address.

### Content safety (moderation)
- [ ] N/A — this feature does not involve content generation or moderation.

### Free-tier enforcement
- [ ] N/A — this feature predates the free-tier system; no book or page limits
  apply.

---

## Georgian-specific UI checks

- [ ] Switch browser language to Georgian (`ka`) if the app supports locale
  switching (note: current implementation does not have a locale switcher;
  both ka and en text are shown simultaneously). Verify no new English
  fallbacks appear.
- [ ] Enter a Mkhedruli email address prefix in the input (if the user's
  keyboard layout supports it) — verify it is stored and displayed correctly.
  Note: RFC 5321 restricts email local parts to ASCII; this item tests whether
  the frontend handles non-ASCII gracefully (should reject or pass through
  depending on product decision). Flag for developer decision if not specified.
- [ ] Verify no text overflow or wrapping issues at 375px (covered in section 2).
- [ ] Date/number formatting — N/A for this page (no dates or numbers
  displayed to the user).
- [ ] Georgian PDF export — N/A for this feature.

---

## Character consistency checks

- [ ] N/A — this feature does not involve AI image generation.

---

## Known gaps flagged for developer decision

1. **⚠️ Client-side email format validation is absent.** The form only
   checks for an empty string. Invalid formats (e.g., "hello@") are submitted
   to the API, which returns 400, and the generic error message is shown.
   A dedicated client-side format check with a more specific error message
   would improve UX. Flag as a product decision.

2. **⚠️ `noValidate` on the form disables browser-native email validation.**
   This is intentional (to show a custom error UI), but it means the browser
   will not prevent a request for malformed emails. This is handled server-side
   by `@IsEmail()` in the DTO. Confirm this is the intended behaviour.

3. **⚠️ Frontend test framework not yet installed.** `App.test.tsx` exists
   at `frontend/src/App.test.tsx` but will not run until Vitest and
   @testing-library/react are added to the project. See setup instructions
   at the top of that file.

4. **⚠️ `supertest` not installed in backend.** `waitlist.controller.spec.ts`
   requires `npm install --save-dev supertest @types/supertest` in the backend
   directory before it will compile and run.

5. **⚠️ `spec.md`, `plan.md`, and `contracts/api-spec.md` for feature 001
   do not yet exist.** Tests were written against the implementation directly
   and against the task brief. These documents should be back-filled for
   traceability.
