# QA Checklist — [Feature Name]

> Spec: NNN | Author: Tester agent | Date: YYYY-MM-DD
> Run this checklist manually in the browser after automated tests pass.

---

## ⚠️ Uncertainty declaration
> List any test cases you could not write or verify automatically.

| Test case | Why uncertain | Manual verification needed |
|---|---|---|
| [e.g. PDF Georgian font rendering] | [Cannot assert visually in Jest] | [Open PDF and read Georgian text] |

---

## Automated test results

| Suite | Tests | Passing | Failing |
|---|---|---|---|
| Unit tests (`npm run test`) | N | N | N |
| Integration tests (`npm run test:e2e`) | N | N | N |
| TypeScript (`npx tsc --noEmit`) | — | ✅ / ❌ | — |
| Lint (`npm run lint`) | — | ✅ / ❌ | — |

---

## Manual test cases

### Happy path — [main user flow]
Run through the feature exactly as a Georgian parent would use it.

- [ ] Step 1: [Specific action] → Expected: [What you should see]
- [ ] Step 2: [Specific action] → Expected: [What you should see]
- [ ] Step 3: [Specific action] → Expected: [What you should see]

---

### Error cases
- [ ] [Submit form with empty required fields] → Expected: [Validation messages in correct language]
- [ ] [Simulate network failure] → Expected: [Friendly error message, data not lost]
- [ ] [Try to exceed free tier limit via API directly] → Expected: [422 LIMIT_REACHED, not a crash]

---

## Privacy checklist
> Run on every feature, not just features that explicitly touch photos.

### Photo handling
- [ ] Upload a test photo → verify it appears in the temporary bucket only
- [ ] Complete character generation → verify "delete original photo" option appears
- [ ] Delete the original photo → verify it is gone from storage (check S3 directly)
- [ ] Verify character reference remains after original photo deletion
- [ ] Verify original photo URL returns 404 after deletion
- [ ] Check network tab → verify original photo URL is never sent to frontend after deletion

### Data in logs
- [ ] Trigger a story creation → check application logs → no photo URLs, character URLs, or story content visible
- [ ] Trigger an error → check error logs → no PII in stack traces

### Content safety
- [ ] Generate a story → verify moderation middleware ran (check moderation log)
- [ ] Verify a moderation failure shows a generic error message (not the moderation reason)

### Free tier enforcement
- [ ] Create 5 free books → verify 6th is blocked with the correct UI message
- [ ] Create a 10-page book on free tier → verify 11th page is blocked
- [ ] Bypass frontend limit check → send API request directly → verify server-side enforcement blocks it

---

## Georgian rendering checklist
> Run on every feature that has any UI.

- [ ] Switch UI language to Georgian → verify all strings are translated (no English visible)
- [ ] Enter Georgian text in any input field → verify it displays correctly (correct Mkhedruli characters)
- [ ] If PDF is involved → open the exported PDF → verify Georgian text renders (not empty boxes)
- [ ] At 375px width → verify Georgian text doesn't overflow or break layout
- [ ] Verify error messages appear in the correct language based on UI setting

---

## Character consistency checklist
> Run only on features that involve AI illustration generation.

- [ ] Generate a 5-page book → verify the child character looks the same on all 5 pages
- [ ] Regenerate one page illustration → verify the character still matches other pages
- [ ] Generate a second book with the same child profile → verify character matches first book
- [ ] Test with both art styles → verify each style has a consistent character version

---

## Mobile checklist
> Run on every feature that has any UI.

- [ ] Open the feature in Chrome DevTools at 375px width → verify layout is correct
- [ ] Check all tap targets → minimum 44x44px (use DevTools to measure)
- [ ] Check the primary CTA → it should be reachable with one thumb (bottom of screen)
- [ ] If there are forms → tap an input field → verify the keyboard doesn't hide the submit button

---

## Overall result

```
┌──────────────────────────────────────────┐
│                                          │
│   PASS  /  PASS WITH NOTES  /  FAIL      │
│                                          │
│   Blocking issues:       N               │
│   Non-blocking notes:    N               │
│   Manual items pending:  N               │
│                                          │
└──────────────────────────────────────────┘
```

### Blocking issues (must fix before ship)
- [Issue 1 — file or area, description]

### Non-blocking notes (fix in follow-up)
- [Note 1]

### Manual items still pending
- [Any checklist item that couldn't be verified automatically and needs developer action]
