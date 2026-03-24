# Phase 0 Research — Overview and Recommendations

**Project:** Zghapari (ზღაპარი)
**Research date:** 2026-03-24
**Status:** All 4 research reports complete
**Methodology:** All findings are RESEARCHED (not tested). Web search was unavailable during this session; findings are based on researcher knowledge through August 2025. Key claims are clearly labeled in each report.

---

## Quick Reference: Key Recommendations

| # | Research Area | Report | Primary Recommendation | Confidence | Top Risk |
|---|---|---|---|---|---|
| 1 | Image Generation & Character Consistency | `01-image-generation.md` | Use Gemini 2.0 Flash for illustrations + InstantID (Replicate) for photo-to-character. Abstract behind `IllustrationProvider` interface. Run a 2-day consistency spike before building M3. | Medium | "Nano Banana Pro" / "Gemini 3 Pro Image" do not exist — confirm the actual API target immediately. Character consistency is the highest technical risk. |
| 2 | Georgian LLM for Story Generation | `02-georgian-llm.md` | Use Google Gemini 2.0 Flash for story text generation. Same Google Cloud account as image generation. GPT-4o is higher quality but 5-10x more expensive. Abstract behind `StoryGenerationProvider` interface. | Medium-High | Gemini Flash Georgian quality must be tested with real stories before committing. Safety filter false positives possible. |
| 3 | Georgian Payment Providers | `03-payments.md` | Integrate BOG iPay first using Hosted Payment Page mode (PCI-DSS SAQ A only). Abstract behind `PaymentProvider` interface. Add TBC Pay later. Do not use Stripe — not available for Georgian merchants. | Medium-High | Start merchant registration early — takes 1-2 weeks. Never tested (sandbox test required before M6). |
| 4 | GDPR & Georgian Data Law | `04-privacy-compliance.md` | Build GDPR compliance from day one. Execute Google Cloud DPA immediately. Add dedicated consent UI for photo upload. Auto-expire original photos at 30 days. Consult a Georgian data protection lawyer before launch. | High (legal requirement, not a choice) | Children's biometric data is the highest regulatory risk category. Non-compliance penalties and reputational damage can be severe. |

---

## Phase Gate Status

| Phase Gate | Research Status | Decision Needed |
|---|---|---|
| Image generation API confirmed | BLOCKED — "Nano Banana Pro" undefined | Team must identify the actual API |
| Character consistency feasibility | NOT CONFIRMED — spike required | Run 2-day manual test before M3 |
| Georgian LLM selected | RECOMMENDATION MADE | Approve Gemini 2.0 Flash or specify alternative |
| Payment provider selected | RECOMMENDATION MADE | Approve BOG iPay as primary; start merchant registration |
| Legal/compliance baseline | RECOMMENDATION MADE | Execute DPAs; engage Georgian data protection lawyer |

---

## Report Index

### 01 — Image Generation & Character Consistency
**File:** `01-image-generation.md`

Key findings:
- "Nano Banana Pro" is an unidentified product name — likely a codename for Google Gemini image generation. Team must confirm.
- "Google Gemini 3 Pro Image" does not exist as of mid-2025. The latest Google image APIs are Imagen 3 (Vertex AI) and Gemini 2.0 Flash (native image output).
- Character consistency across 10+ illustrations requires deliberate architecture: reference image injection is a minimum; IP-Adapter or InstantID provides production-grade consistency.
- Recommended stack: Gemini 2.0 Flash for illustrations (reference image in context) + InstantID via Replicate for photo-to-character conversion.
- Cost per book (11 illustrations): ~$0.17 with Gemini; ~$0.66-1.10 with Replicate-based approaches.
- BullMQ must support parallel generation (4 workers minimum) to hit the 2-minute book generation target.

### 02 — Georgian LLM Evaluation
**File:** `02-georgian-llm.md`

Key findings:
- Top performers for Georgian: GPT-4o > Claude 3.5 Sonnet > Gemini 2.0 Flash >> Llama 3.
- Gemini 2.0 Flash is recommended for Zghapari because: same GCP account, dramatically cheaper ($0.0004/story vs $0.035/story for GPT-4o), adequate Georgian quality for children's stories.
- No Georgian-specific generative LLM exists that outperforms frontier models. Fine-tuning not required for MVP.
- Story generation cost is negligible compared to image generation cost. Even at 10,000 books/month, text generation costs less than $200/month.
- LLM should return structured JSON (page text + illustration prompts) in a single call.

### 03 — Georgian Payment Providers
**File:** `03-payments.md`

Key findings:
- Stripe is unavailable for Georgian merchant accounts. Do not use Stripe for MVP.
- BOG iPay and TBC Pay are both viable. BOG has a larger established merchant base; TBC has better English developer documentation.
- Both support Hosted Payment Page (redirect model), reducing PCI-DSS scope to SAQ A (no card data ever touches Zghapari's servers).
- Both support Visa/Mastercard, 3DS, Google Pay, Apple Pay.
- Fees: approximately 1.5–2.5% + fixed fee (negotiate with each bank).
- `PaymentProvider` interface abstraction enables future provider swap with no business logic changes.
- Webhook idempotency is mandatory — both providers may send duplicate events.

### 04 — GDPR and Georgian Data Law
**File:** `04-privacy-compliance.md`

Key findings:
- Children's photos are biometric special-category data under both GDPR and Georgian law — highest protection level.
- Explicit, separate parental consent is required before uploading a photo (not buried in T&Cs).
- Georgian law uses age 18 as the threshold for children's data (stricter than GDPR's 16).
- Cross-border transfer to US AI APIs requires executing Google Cloud DPA and OpenAI DPA (Standard Contractual Clauses).
- Original photos must be deletable on request and auto-expired at 30 days maximum.
- A DPIA (Data Protection Impact Assessment) is legally mandatory before processing begins.
- Consult a Georgian data protection lawyer before launch — budget 500–1000 GEL.

---

## Architectural Decisions Required Before Phase 2

The following decisions must be made by the team before the Architect agent begins work. These are flagged as architectural impacts in the individual reports:

1. **Image generation API:** What is "Nano Banana Pro" actually? Which specific Google API will be used? (Imagen 3 vs Gemini 2.0 Flash vs a third-party service)

2. **Character consistency approach:** Accept Gemini reference-injection (moderate consistency) for MVP, or build with IP-Adapter/InstantID from the start (higher consistency, more infrastructure)?

3. **Cloud region:** Use `us-central1` (default, cheaper) or `europe-west4` (better for GDPR, higher cost) for Google Cloud infrastructure? This affects GDPR cross-border transfer complexity.

4. **Illustration + Story generation interface:** Confirm `IllustrationProvider` and `StoryGenerationProvider` interface pattern alongside the existing `PaymentProvider` pattern — all three AI services must be similarly abstracted.

5. **Photo storage isolation:** Confirm that children's photos and character references will be in a separate, private-only bucket from general application assets.

---

## Next Steps for the Team

1. **Immediately:** Clarify what "Nano Banana Pro" means in the tech stack — update CLAUDE.md with the actual API name.
2. **Within 1 week:** Run a manual 2-day character consistency spike (Gemini 2.0 Flash, 10 pages, reference image injection). Score consistency. Go/no-go decision for the chosen approach.
3. **Within 1 week:** Start BOG iPay merchant registration to get sandbox access before M6 milestone.
4. **Within 2 weeks:** Execute Google Cloud DPA (5 minutes in GCP console). Do not process any real user data before this.
5. **Before launch:** Engage a Georgian data protection lawyer for a compliance review (budget ~500–1000 GEL).
6. **Before Phase 2 (Architecture):** Make the architectural decisions listed above. The Architect agent cannot finalize the plan without these answers.

---

## Research Limitations

All four reports are RESEARCHED (not tested). Key limitations:

- Web search was unavailable during this research session. All pricing, API details, and API availability information reflects the researcher's knowledge as of August 2025 and may have changed by March 2026.
- No actual API calls were made. Stated latencies and costs are estimates from documented API specifications, not empirical measurements.
- Georgian-specific details (PDPS registration requirements, exact BOG/TBC API endpoints, Georgian law nuances) should be verified against current official sources before acting on them.
- The consistency spike (Approach B, C, D in report 01) has not been run. Character consistency claims are based on published research and community reports, not Zghapari-specific testing.
