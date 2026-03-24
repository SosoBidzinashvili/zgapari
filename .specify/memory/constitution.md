# Zghapari — Project Constitution

> This document governs every decision made on this project.
> Every agent reads this file before producing any output.
> Last updated: 2026-03-24

---

## Uncertainty Declaration

| Claim | Basis | Confidence |
|---|---|---|
| Product vision, personas, and core user flow | Read directly from Product Description.md | High |
| Free tier limits (5 stories, 10 pages max) | Read directly from Product Description.md | High |
| Georgian language and mobile-first requirements | Read directly from CLAUDE.md and Product Description.md | High |
| Character consistency as the core technical risk | Read from Product Description.md Section 10 and Research Report 01 | High |
| GDPR and Georgian data law requirements for children's photos | Read from Research Report 04 | High |
| Photo retention behavior (30-day auto-expire) | Read from Research Report 04 Section 5.4 | High |
| Payment provider (BOG iPay first, TBC Pay second) | Read from Research Report 03 | High |
| LLM recommendation (Gemini 2.0 Flash, fallback GPT-4o) | Read from Research Report 02 | Medium — not tested; recommendations are research-based |
| Image generation approach (Gemini + InstantID hybrid) | Read from Research Report 01 | Medium — not tested; spike required before committing |
| "Nano Banana Pro" / "Gemini 3 Pro Image" in CLAUDE.md | Flagged as unresolved in Research Report 01 | Low — team must confirm actual API target |

---

## 1. Product Vision

Zghapari (ზღაპარი — Georgian for "fairy tale") is a web platform that lets parents create personalized, AI-illustrated children's storybooks rooted in Georgian culture and language. It exists because Georgian-speaking families lack children's books that reflect their heritage, language, and values, while creating custom illustrated books is time-consuming and expensive. Zghapari removes every barrier: no writing skill, no illustration budget, no software expertise needed. A parent types an idea or picks a template, and the platform returns a fully illustrated, age-appropriate storybook featuring their own child as the hero — in under two minutes. The long-term vision is to start with Georgian families and then expand the platform to serve other cultures and languages; the architecture must support multi-culture, multi-language expansion from day one.

**One-liner:** Turn your child into the hero of their own Georgian fairy tale — in minutes.

---

## 2. Core User Personas

### Persona A — Georgian Parent (Primary, MVP)

A parent living in Georgia with a child between the ages of 2 and 10. They speak Georgian as their primary language and are raising their child in a Georgian cultural context. They want bedtime stories in Georgian that feature their child by name, reflect Georgian traditions and landscapes, and feel culturally authentic rather than translated from another language. They are busy, not technically sophisticated, and access the internet primarily on a mobile phone. They are the decision-maker on payment and are protective of their child's privacy.

### Persona B — Bilingual Georgian Family (Primary, MVP)

A family where one or both parents speak both Georgian and English — common in educated urban households in Tbilisi and in the Georgian diaspora. They want stories available in both languages, either as two separate versions of the same story or as a selection at generation time. Language choice is important to them as a cultural statement and a practical parenting tool for raising bilingual children.

### Persona C — Gift-Giver (Secondary, MVP-adjacent)

A grandparent, aunt, uncle, or family friend who wants to create a personalized book as a gift for a child. They may be less familiar with technology than the primary persona. They need a simple, short flow that does not require deep knowledge of the child's profile. The product must communicate clearly in Georgian and English and handle the case where the gift-giver does not have access to a photo of the child. Gift purchasing is a post-MVP feature, but the persona informs UX simplicity requirements from the start.

### Persona D — Georgian Diaspora Parent (Secondary, Post-MVP)

A Georgian parent living in Europe, the US, or elsewhere. Motivation is stronger than Persona A — preserving cultural and linguistic heritage is urgent when the child's daily environment is not Georgian. GDPR compliance is directly relevant to this persona. The product must work in English as a navigation language while producing stories in Georgian.

---

## 3. Non-Negotiable Product Principles

These principles are derived directly from CLAUDE.md and the Product Description. Every feature spec, design, and implementation decision must respect all of them. No agent may override these principles without an explicit developer decision logged in a spec.

### 3.1 Character Consistency Is the Core Product Promise

The same child character must look recognizably identical across all pages of a single book and across multiple books created over time. The character's visual identity is tied to the child profile, not to a single book. Every image generation call must include the character reference. This is architecturally critical: the character reference must be stored persistently on the child profile and injected into every illustration generation job.

**Consequence for specs:** Any feature that touches image generation must specify how the character reference is used. Any feature that modifies child profile data must specify the impact on the stored character reference.

### 3.2 Georgian Language and Cultural Authenticity Are Not Optional

All UI strings must be externalized through i18next from day one — no hardcoded strings. Georgian script (Mkhedruli) must render correctly in every component, including generated PDFs (font embedding is required). Stories must use authentic Georgian names, places, foods, traditions, and cultural references — not transliterated or generically "made Georgian." The quality bar for Georgian text is: grammatically correct, age-appropriate, culturally rich, and idiomatic enough that a native Georgian speaker would not find it awkward.

**Consequence for specs:** Every feature that generates or displays text content must specify Georgian and English behavior separately. Every feature that affects PDF output must specify Georgian font rendering.

### 3.3 Children's Photo Privacy Is Critical

Children's photos are sensitive personal data (biometric/special category under GDPR and Georgian law). The following constraints are absolute:

- Photos are used exclusively for character generation. Never for any other purpose.
- Photos are never used to train AI models.
- Photos are never logged, cached in application logs, or stored in non-encrypted locations.
- The original photo must be offered for deletion immediately after character generation is complete.
- If the parent does not delete within 7 days, send a deletion reminder.
- If the parent has not deleted within 30 days of upload, auto-delete the original photo and log the event.
- Only the generated character reference (illustrated likeness, not the original photo) is stored long-term.
- Photo and character reference storage must be in a private, access-controlled bucket with signed URLs — never a public URL.

**Consequence for specs:** Every feature that touches photo upload or character generation must specify the consent checkpoint, retention behavior, and deletion mechanism.

### 3.4 Mobile-First Design

The primary usage context is a mobile phone. Seventy percent of Georgian internet users are on mobile. Every screen must be designed for 375px width first. Touch interactions must be the primary interaction model. Tap targets must be appropriately sized. Swipe and scroll patterns must feel natural on mobile. Desktop is a supported but secondary viewport.

**Consequence for specs:** Every UX section must describe the mobile experience first. Desktop enhancements are described separately and clearly marked as enhancements.

### 3.5 Age-Appropriate Content Adaptation

The child's age (derived from date of birth on the child profile) must drive story and illustration parameters. Age is not a static configuration — it is recalculated at story creation time so that stories for a child who has grown older automatically reflect the new age band. The age bands and their parameters are:

| Age Band | Words per Page | Sentence Length | Vocabulary | Page Count Range |
|---|---|---|---|---|
| 2–4 | 30–50 | 5–8 words | Very simple, everyday | 4–6 pages |
| 5–6 | 60–90 | 8–12 words | Simple with some new words | 6–8 pages |
| 7–8 | 90–130 | 10–15 words | Moderate complexity | 8–10 pages |
| 9–10 | 130–180 | 12–20 words | Richer vocabulary acceptable | 8–10 pages |

**Consequence for specs:** Every feature spec that involves story generation must reference the age band table and specify how age parameters are applied.

### 3.6 MVP Scope Discipline

The MVP is defined in Section 7 of this document. Features that appear in the post-MVP roadmap must not creep into MVP specs or plans. When a feature request arrives, the BA agent must first confirm whether it is in-scope for MVP before writing the spec. If it is post-MVP, state that clearly and stop.

---

## 4. Technical Principles

These principles are binding for all agents and engineers. They come from CLAUDE.md and must not be contradicted in any spec, plan, or implementation.

### 4.1 Async Image Generation — Always

Illustration generation is never synchronous. Every image generation call is dispatched as a BullMQ job. Each page's illustration is a separate job within a job group. The final PDF assembly is triggered only when all page jobs in the group have completed. The client receives real-time progress updates during generation. The two-minute generation target for a 10-page book requires parallel workers (minimum 4 concurrent workers for Gemini; more for slower providers).

### 4.2 Provider Abstraction — Always

Three AI provider interfaces must be abstracted from day one:

- `PaymentProvider` — implemented by `BogIPayProvider` (MVP), then `TbcPayProvider`
- `IllustrationProvider` — implemented by the chosen image generation service (Gemini 2.0 Flash + InstantID hybrid recommended; see Research Report 01)
- `StoryGenerationProvider` — implemented by the chosen LLM (Gemini 2.0 Flash recommended; see Research Report 02)

Business logic must never call a specific provider's API directly. All calls go through the interface. This allows swapping providers without changing business logic.

### 4.3 TypeScript Strict Mode — No Exceptions

TypeScript strict mode is required across the entire codebase. No `any`. No `as unknown`. This applies to frontend and backend without exception.

### 4.4 Data Model Standards

Every database table must have: `id` (UUID), `created_at`, `updated_at`, `locale`. Every content table must have soft deletes via `deleted_at`. Soft-deleted records must be eligible for hard deletion after 30 days to satisfy GDPR right-to-erasure requirements.

### 4.5 Internationalization From Day One

All UI strings go through i18next. No string is hardcoded in a component. Date, number, and currency formatting must be locale-aware. Georgian script must render correctly everywhere, including PDFs (requires font embedding). The data model treats locale as a first-class column on every content table.

### 4.6 Security Standards

- All credentials via environment variables — no hardcoded secrets, ever.
- Every API endpoint requires an auth guard unless explicitly marked public in the spec.
- Card data must never pass through Zghapari's servers — use hosted payment pages only (PCI-DSS SAQ A scope).
- Photos and character references are stored in a private bucket with time-limited signed URLs. Access logs must record access events without logging the photo contents or file paths.

### 4.7 Per-Page Generation Idempotency

Each page's generation must be independently re-triggerable. Regenerating one illustration must not regenerate other pages. Completed pages must be cached so a retry or partial failure does not start the whole book over.

### 4.8 PDF Generation Standards

PDF generation is server-side (Puppeteer). Georgian fonts must be embedded. Resolution must be 300 DPI minimum for print-readiness. Bleed margins must be included for future print-on-demand compatibility.

### 4.9 Component State Requirements

Every new frontend component must handle three states: loading, error, and empty. No component may be considered complete without all three states implemented and tested.

### 4.10 Testing Requirements

Every new backend service method must have a corresponding unit test. Frontend components handle the three required states (loading/error/empty). No PR may be merged without the reviewer confirming these requirements are met.

---

## 5. Privacy Commitments

These commitments are product-level behavior requirements, not implementation details. They are derived from Research Report 04 (GDPR and Georgian data law) and the Product Description.

### 5.1 What Data Is Collected and Why

| Data | Purpose | Sensitivity |
|---|---|---|
| Parent email | Account authentication and communication | Standard |
| Parent name | Personalization | Standard |
| Child name | Story personalization | Standard |
| Child date of birth | Age-band calculation for story parameters | Standard |
| Child photo (original) | Generating illustrated character reference; deleted after use | Highest — biometric |
| Character reference (illustration) | Reuse across books for character consistency | High — derived from biometric |
| Story content | Book creation and library | Standard |
| Payment order ID and status | Transaction record | Standard |

Raw card data is never collected, stored, or processed by Zghapari. Payment is handled entirely on the provider's hosted page.

### 5.2 Child Photo Lifecycle

The original photo follows this mandatory lifecycle:

1. Upload is gated by an explicit parental consent checkpoint (not buried in terms of service — a dedicated modal with a separate checkbox).
2. The consent checkpoint must name the AI processing service used.
3. The photo is transmitted to the AI provider over HTTPS only.
4. The photo is stored in a private, encrypted bucket with access restricted to the generation job.
5. After character generation is complete and approved: the product prominently offers deletion of the original photo.
6. If not deleted within 7 days: the parent receives a reminder notification.
7. If not deleted within 30 days of upload: the photo is automatically and permanently deleted. The auto-deletion event is logged.
8. The generated character reference (illustrated likeness) is retained on the child profile until the parent deletes the child profile.
9. At any time, the parent may delete: the original photo, the character reference, or the entire child profile (which cascades deletion of all associated data).

### 5.3 What Is Never Done With Photos

- Photos are never used to train AI models.
- Photos are never shared with any party other than the named AI processing provider.
- Photos are never stored in application logs, error reports, or analytics events.
- Photos are never accessible via a public URL.
- Photos of one child are never used in the generation pipeline for a different child's book.

### 5.4 Consent Requirements

Explicit, separate parental consent is required before any photo is uploaded. This consent must:

- Confirm the uploader is the parent or legal guardian of the child.
- Name the AI service that will process the photo.
- State how long the photo will be retained and how to delete it.
- Be a distinct action from account creation or terms-of-service acceptance.
- Be revocable at any time.

The age threshold for children requiring parental consent is 18 (Georgian law), which is stricter than GDPR's 16. Zghapari uses 18 as the governing threshold for all users to satisfy both laws simultaneously.

### 5.5 Data Retention Schedule

| Asset | Retention | Deletion Trigger |
|---|---|---|
| Original child photo | Max 30 days from upload | Parent request or auto-expire |
| Character reference illustration | Until child profile is deleted | Parent request |
| Story content and PDFs | Until book is deleted | Parent request |
| Audit logs (photo lifecycle events) | 12 months | Auto-expire |
| Database backups | 30 days | Auto-expire |
| Payment order records | As required by Georgian financial regulations | Regulatory |

### 5.6 Cross-Border Data Transfer

Sending a child's photo to a US-based AI API (Google, OpenAI) constitutes a cross-border data transfer under both GDPR and Georgian law. Before any photo processing begins:

- The Google Cloud Data Processing Addendum must be executed in the GCP console.
- If OpenAI is used for any processing, its Data Processing Agreement must be accepted.
- The privacy policy must disclose that data may be processed in the US and name the processors.

A Data Protection Impact Assessment (DPIA) for children's biometric data processing must be completed internally before launch. The team must consult a Georgian data protection lawyer before launch.

---

## 6. Content Safety Commitments

### 6.1 What Is Moderated

All of the following must pass safety checks before being delivered to the user:

- Story prompts submitted by the parent (input moderation)
- AI-generated story text (output moderation)
- AI-generated illustration prompts (intermediate moderation)
- AI-generated illustrations (image output moderation)

### 6.2 Moderation Architecture

Content moderation is a middleware layer, not embedded in generation logic. This allows safety policies to be updated independently of generation pipelines. The moderation layer is invoked:

- Before a generation job is dispatched (prompt check)
- After text generation completes (text output check)
- After each illustration is generated (image output check)

### 6.3 Failure Behavior

When content fails moderation, the behavior must be:

- User-facing: a generic, non-alarming message that does not reveal internal details of what was flagged or why.
- For prompt failures: the user is told their request could not be processed and is invited to try a different prompt or select from story templates.
- For generation output failures: the user is told a page could not be generated and is offered a retry. If retry fails, they may proceed with a placeholder or remove the page.
- No unsafe technical details (error codes, filter names, prompt contents) are shown to the user.

### 6.4 Quality Bar for Story Content

Generated story text is acceptable when:

- It is appropriate for the specified age band (vocabulary, themes, length).
- It contains no violence beyond age-appropriate adventure conflict resolution.
- It contains no frightening content for the specified age (monsters that exist to be friendly, not genuinely threatening, for ages 2–6).
- It contains no adult themes, romantic content, or material that a reasonable Georgian parent would consider inappropriate for a child.
- It reflects Georgian cultural values positively or neutrally — no mockery of Georgian traditions, names, or cultural practices.

### 6.5 Quality Bar for Illustrations

Generated illustrations are acceptable when:

- They are age-appropriate and child-safe.
- They do not depict real human faces (except stylized illustrated character that is clearly not a photograph).
- They maintain the selected art style consistently across pages.
- The child character is visually recognizable as the same character across all pages of a book.
- They do not produce uncanny-valley hyper-realistic images of children.

---

## 7. MVP Definition of Done

A Zghapari feature is "shipped" at MVP when all of the following are true.

### 7.1 MVP Feature Scope

The following features are in scope for MVP. Nothing else is MVP scope.

| Feature | Notes |
|---|---|
| User registration and login | Email/password and Google OAuth |
| Child profiles | Name, date of birth, optional photo, saved character reference |
| Story creation from text prompt | Free-form Georgian or English input |
| Story templates | 15–20 curated templates across themes |
| Photo-to-Character pipeline | Single photo to illustrated character in each art style |
| Drawing-to-Story pipeline | Upload child's drawing, AI builds story around it |
| 2 art styles | Pirosmani-inspired painterly + modern digital with Georgian motifs |
| AI story generation | Georgian and English, age-adapted, character-consistent |
| Page-by-page editor | Edit text, regenerate individual illustrations, add/remove/reorder pages |
| On-device reader | Horizontal swipe or click page-turn navigation |
| PDF export | Print-ready, Georgian font embedded, 300 DPI |
| Library (bookshelf) | View, re-read, re-edit, delete books; filter by child, date, language |
| Recurring characters | Same character reference reused across unlimited books |
| Free tier | 5 stories lifetime, max 10 pages each, back-cover watermark on PDF |
| Per-page paid tier | Price shown before generation; payment via BOG iPay |
| Georgian and English UI | Full bilingual interface via i18next |
| Mobile-responsive web app | Touch-optimized, 375px first |
| Content moderation | Text prompt and generated output safety filtering |
| Photo privacy controls | Consent checkpoint, deletion flow, auto-expire at 30 days |

### 7.2 Post-MVP Features (Out of Scope Until Explicitly Promoted)

The following are confirmed post-MVP. They must not appear in MVP specs, plans, or implementations.

| Phase | Feature |
|---|---|
| Phase 2 | Read-aloud narration (TTS in Georgian and English) |
| Phase 2 | ePub export |
| Phase 2 | Physical book printing (print-on-demand) |
| Phase 2 | Gift flow |
| Phase 2 | Social sharing |
| Phase 2 | Additional art styles (3+) |
| Phase 3 | Native iOS and Android apps |
| Phase 3 | Collaborative creation mode |
| Phase 3 | Bedtime reading mode |
| Phase 3 | Story series and sequels |
| Phase 3 | Additional languages beyond Georgian and English |
| Phase 3 | Cultural expansion beyond Georgia |
| Phase 4 | Community gallery |
| Phase 4 | Teacher and school accounts |
| Phase 4 | Referral program |
| Phase 4 | Subscription pricing tier |
| Phase 4 | AI story suggestions from reading history |

### 7.3 Per-Feature Definition of Done

A single feature is done when:

1. The spec (this pipeline's Phase 1 output) exists and has been approved by both developers.
2. The UX spec (Phase 2) covers every screen, loading state, error state, and empty state.
3. The plan and data model (Phase 2) are approved and consistent with the constitution.
4. All acceptance criteria from the spec pass in the test environment.
5. Georgian and English behaviors are verified — not assumed.
6. The mobile experience has been tested at 375px width on a real device or device emulator.
7. All loading, error, and empty states are implemented in the frontend.
8. Every new backend service method has a unit test.
9. The code reviewer has signed off and the review report exists.
10. The QA checklist has been completed and all items are passing.
11. No console errors in the browser for happy path flows.
12. The feature branch has been reviewed and approved by both developers before merging to main.

### 7.4 MVP Is "Shipped" When

- All MVP features are in Done state as defined in 7.3.
- The application runs without errors on mobile (iOS Safari and Android Chrome at minimum).
- Georgian script renders correctly in the app and in exported PDFs.
- The free tier limit (5 stories, 10 pages max) is enforced correctly and the paywall is working.
- At least one payment has been processed end-to-end in the BOG iPay production environment.
- The photo consent flow, deletion flow, and auto-expire are all working and verified.
- The GDPR/Georgian law compliance checklist from Research Report 04 is complete.
- The Google Cloud Data Processing Addendum has been executed.
- A privacy policy in Georgian and English has been published.
- The DPIA has been completed internally.
- A Georgian data protection lawyer has reviewed the processing.

---

## 8. Open Flags and Unresolved Decisions

These items were identified during Phase 0 research and are not yet resolved. No architecture or implementation work that depends on these decisions should begin until they are resolved. Each is flagged with its source.

| Flag | Source | Blocking What |
|---|---|---|
| "Nano Banana Pro" and "Gemini 3 Pro Image" in CLAUDE.md do not correspond to known products. The actual image generation API must be confirmed by the team. | Research Report 01 | Illustration pipeline architecture, cost model, M3 milestone |
| Character consistency quality with Gemini 2.0 Flash reference injection must be validated with a manual 2-day spike (10 pages, same reference) before committing to this approach. | Research Report 01 | IllustrationProvider implementation choice |
| Gemini 2.0 Flash Georgian story quality vs GPT-4o must be validated with actual test stories before committing to Gemini as the StoryGenerationProvider. | Research Report 02 | StoryGenerationProvider implementation choice |
| Georgian PDPS registration: it is unclear whether proactive registration with the Personal Data Protection Service of Georgia is required before launch. A Georgian data protection lawyer must clarify. | Research Report 04 | Launch readiness |
| Google Cloud region choice (us-central1 vs europe-west4): affects GDPR cross-border transfer complexity. Must be decided before infrastructure is provisioned. | Research Report 04 | Infrastructure provisioning |
| Merchant registration with BOG iPay must begin at least 2–3 weeks before the payments milestone. Sandbox credentials take 3–5 business days; production onboarding takes 1–2 weeks. | Research Report 03 | M6: Payments milestone |

---

## 9. How Agents Must Use This Document

Every agent that works on Zghapari must:

1. Read this document before producing any output.
2. Start every output with the uncertainty declaration table required by CLAUDE.md.
3. Flag any feature request or design decision that contradicts a principle in this constitution with **⚠️ CONFLICT** before proceeding.
4. Never propose implementation details that would violate the technical principles in Section 4.
5. Never write a spec for a post-MVP feature listed in Section 7.2 without a developer explicitly approving it as promoted to MVP scope.
6. Never assume a research finding that is not in the research reports in `.specify/research/`. Refer to the actual reports by filename.
7. Treat all unresolved open flags in Section 8 as blockers for the work they gate.
