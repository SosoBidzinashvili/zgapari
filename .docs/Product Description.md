# Zghapari: Product Description

> **Audience for this document:** Development team — use this as the primary reference for architecture design and feature scoping.

---

## 1. Product Vision

**Zghapari** (ზღაპარი — Georgian for "fairy tale") is a web platform that lets parents create personalized, AI-illustrated children's storybooks rooted in Georgian culture and language.

**One-liner:** Turn your child into the hero of their own Georgian fairy tale — in minutes.

**Why this exists:** Georgian-speaking families lack children's books that reflect their heritage, language, and values. Creating custom illustrated books is expensive and time-consuming. Zghapari removes every barrier: no writing skill, no illustration budget, no software knowledge needed.

**Long-term vision:** Start with Georgian families, then expand to serve other cultures and languages. The platform architecture must support multi-culture, multi-language expansion from day one.

---

## 2. Target Audience

### Primary (MVP)
- **Families in Georgia** — parents of children ages 2–10 who want personalized bedtime stories in Georgian.
- **Bilingual Georgian families** — want stories in both Georgian and English.

### Secondary (Post-MVP)
- **Georgian diaspora** — families abroad preserving cultural connection.
- **International users** — English-speaking parents discovering the platform.
- **Grandparents** — gift use case (creating books for grandchildren).
- **Teachers / schools** — classroom storytelling and literacy tools.

---

## 3. Core User Flow

### 3.1 Story Creation (The Main Flow)

```
[Select Child Profile] → [Enter Story Idea] → [Configure Story] → [AI Generation] → [Review & Edit] → [Export]
```

**Step 1: Select or Create a Child Profile**
- Parent selects an existing child profile or creates a new one.
- Child profile stores: name, age (birth date), photo (optional), saved character appearance.
- The child's age determines story complexity, vocabulary level, page count range, and illustration style density.
- As the child grows, the platform adapts: stories generated for a 3-year-old differ from those for an 8-year-old — even for the same character.

**Step 2: Share a Story Idea**
- Free-form text prompt in Georgian or English.
  - Example: "ამბავი მამაცი გოგონას შესახებ, რომელმაც ჯადოსნური ქვევრი იპოვა ტყეში"
  - Example: "A story about a brave girl who finds a magical Qvevri in the forest"
- Alternatively, select from **story templates** organized by theme:
  - Georgian legends & mythology (Amirani, the golden fleece, Sulkalmakh)
  - Life moments (first day of school, new sibling, moving house, lost tooth)
  - Values & morals (bravery, kindness, sharing, honesty)
  - Seasons & holidays (Rtveli/grape harvest, Easter, New Year, Tbilisoba)
  - Adventure & fantasy (mountains, sea, space, magical creatures)
- Optional: upload a **child's drawing** — the AI builds a story around the doodle and incorporates the drawing's elements into the illustrations.

**Step 3: Configure the Story**
- **Language:** Georgian (primary) or English. Architecture must support adding more languages later.
- **Art style:** Choose from available styles (2 at MVP, expandable). Styles are inspired by Georgian visual heritage:
  - *Style 1:* Warm, painterly — inspired by Niko Pirosmani's naïve art and traditional Georgian manuscript illustrations.
  - *Style 2:* Modern, vibrant — clean digital illustration with Georgian motifs and patterns.
- **Story moral / educational angle** (optional): dropdown with common values.
- **Page count:** Auto-suggested based on child's age. Parent can adjust within range (4–10 pages at MVP).

**Step 4: AI Generation**
- System generates:
  - Story text (one text block per page, age-appropriate language)
  - One illustration per page, maintaining **character consistency** across all pages
  - Book cover illustration with title
- Parent sees a loading/progress state during generation.
- Generation target: under 2 minutes for a full book.

**Step 5: Review & Edit**
- Page-by-page preview showing text + illustration together.
- **Text editing:** Parent can directly edit any page's text.
- **Illustration regeneration:** "Regenerate this illustration" button per page — generates a new image for that page while keeping the same text and character.
- **Page management:** Add, remove, or reorder pages.
- Save as draft at any point.

**Step 6: Export & Share**
- **On-device reading:** Rendered book view with page-turn navigation (MVP: simple horizontal swipe/click).
- **PDF export:** Downloadable, print-ready PDF with bleed margins and proper resolution.
- Books are saved to the user's **library** (bookshelf).

### 3.2 Child Profile System

Each user account can have **multiple child profiles** (for families with several children).

A child profile contains:
- **Name** — used in story personalization.
- **Date of birth** — used to calculate current age → determines story complexity. As the child ages, new stories auto-adjust.
- **Photo** (optional) — used by Photo-to-Character to generate a consistent illustrated version.
- **Character appearance** — the AI-generated character reference derived from the photo. Stored so it can be reused across multiple books without re-uploading.
- **Language preference** — default language for stories.

**Recurring characters:** The same child character must be reusable across unlimited stories. The character's visual identity is tied to the child profile, not to a single book. This is architecturally critical — the character reference/embedding must be stored persistently and passed to the image generation pipeline for every new book.

### 3.3 Photo-to-Character Pipeline

1. Parent uploads a clear photo of their child's face.
2. System generates an illustrated character version in each available art style.
3. Parent approves or requests adjustments.
4. Approved character reference is saved to the child profile.
5. For every subsequent story, this reference is used to maintain visual consistency.

**Key constraints:**
- Must work from a single photo.
- Character must be recognizable as the child but stylized (not uncanny-valley realistic).
- Character must remain consistent across 4–10+ illustrations within a book and across books.
- Different art styles produce different stylized versions of the same character.

### 3.4 Drawing-to-Story Pipeline

1. Parent uploads an image of the child's drawing (photo of paper or digital drawing).
2. System analyzes the drawing: identifies shapes, creatures, objects, scenes.
3. AI generates a story that incorporates the drawing's elements as central plot points.
4. Illustrations reference the original drawing's style/elements while maintaining the selected art style.

---

## 4. User Account & Library

### 4.1 Account
- **Registration:** Email + password, or social login (Google). Extend later as needed.
- **Profile:** Parent name, email, list of child profiles.
- **Settings:** Default language, notification preferences.

### 4.2 Library (Bookshelf)
- All created books displayed as a visual bookshelf (cover thumbnails).
- States: Draft, Completed.
- Ability to re-read, re-edit, re-export, or delete any book.
- Filter/sort by child, date created, language.

---

## 5. Monetization

### Free Tier
- **5 stories** total (lifetime, not monthly).
- Each story: maximum **10 pages**.
- Full access to all art styles and features.
- PDF export included.
- Watermark on free-tier PDFs: small "Made with Zghapari" on the back cover.

### Paid Tier
- **Per-page pricing** after the free 5 stories are used.
- Price calculated at story creation based on page count, shown before generation begins.
- No subscription — pay only when you create.
- No watermark on paid exports.

### Post-MVP Monetization Expansion
- Premium art styles (licensed or higher-fidelity).
- Physical printed book ordering (print-on-demand partnership).
- Gift purchases (buy a book credit for someone else).
- Subscription option for heavy users (unlimited stories/month).

---

## 6. Content Safety & Privacy

### Photo Privacy (Critical)
- Children's photos are used **exclusively** for character generation.
- Photos are **never** used to train AI models.
- Original photos can be deleted by the parent at any time.
- Only the generated character reference (not the original photo) is stored long-term.
- Clear, plain-language privacy policy explaining exactly what happens to uploaded photos.

### Content Safety
- AI-generated text is filtered for age-appropriateness.
- Illustrations are filtered to ensure child-safe output.
- Story prompts are moderated to prevent misuse.
- All generated content adheres to child-safety standards.

### Compliance
- GDPR compliance (required for EU users and good practice).
- Georgian data protection law compliance (Personal Data Protection Law of Georgia).
- Consider COPPA alignment for future US market entry.
- Data residency: clarify where data is stored (relevant for Georgian users' trust).

---

## 7. Non-Functional Requirements

### Performance
- Story generation (text + all illustrations): target **< 2 minutes** for a 10-page book.
- PDF export: **< 30 seconds**.
- Page load times: **< 2 seconds** on 4G connections (Georgian mobile networks).

### Scalability
- Architecture must handle concurrent generation jobs (queue-based).
- Image generation is the bottleneck — design for async job processing with status updates.

### Mobile-First
- Primary usage will be on mobile devices (Georgian market is heavily mobile).
- Responsive web app. Native app is post-MVP.
- Touch-friendly UI throughout (story creation, editing, reading).

### Internationalization (i18n)
- All UI strings externalized from day one.
- RTL support not needed now but architecture should not preclude it.
- Georgian script (Mkhedruli) must render correctly across all components, including generated PDFs.
- Date, number, and currency formatting must be locale-aware.

### Accessibility
- Minimum WCAG 2.1 AA compliance for the web UI.
- Screen reader support for navigation and reading mode.

---

## 8. MVP Scope

### In Scope (MVP)

| Feature | Details |
|---|---|
| User registration & login | Email/password + Google OAuth |
| Child profiles | Name, DOB, photo, saved character |
| Story creation from text prompt | Free-form input in Georgian or English |
| Story templates | Curated set of 15–20 templates across themes |
| Photo-to-Character | Single photo → illustrated character |
| Drawing-to-Story | Upload drawing → AI-generated story |
| 2 art styles | Pirosmani-inspired painterly + modern digital |
| AI story generation | Text + illustrations, character-consistent |
| Page-by-page editor | Edit text, regenerate illustrations, add/remove/reorder pages |
| On-device reader | Simple page-turn book view |
| PDF export | Print-ready, proper resolution |
| Library / bookshelf | View, re-read, re-edit, delete books |
| Recurring characters | Same character across multiple books |
| Free tier (5 books, 10 pages max) | With back-cover watermark |
| Per-page paid tier | Payment integration (Stripe or local Georgian provider like BOG/TBC iPay) |
| Georgian + English UI | Full bilingual interface |
| Mobile-responsive web app | Touch-optimized |
| Content moderation | Text + image safety filters |
| Photo privacy controls | Delete photo, clear policy |

### Out of Scope (Post-MVP Roadmap)

| Phase | Feature |
|---|---|
| Phase 2 | Read-aloud narration (TTS in Georgian + English) |
| Phase 2 | ePub export |
| Phase 2 | Physical book printing (print-on-demand integration) |
| Phase 2 | Gift flow (purchase a book for someone else) |
| Phase 2 | Social sharing (share cover/preview on social media) |
| Phase 2 | Additional art styles (3+) |
| Phase 3 | Native mobile apps (iOS + Android) |
| Phase 3 | Collaborative creation mode (parent + child pick elements together) |
| Phase 3 | Bedtime reading mode (dark theme, sleep timer, ambient sounds) |
| Phase 3 | Story series / sequels (continue a previous story) |
| Phase 3 | Additional languages beyond Georgian + English |
| Phase 3 | Cultural expansion beyond Georgia |
| Phase 4 | Community gallery (public, anonymized story covers) |
| Phase 4 | Teacher/school accounts with classroom features |
| Phase 4 | Referral program |
| Phase 4 | Subscription pricing tier |
| Phase 4 | AI story suggestions based on child's reading history |

---

## 9. Landing Page Copy

> *This section is for the marketing website — separate from the app itself.*

### Hero Section
**Headline:** შექმენი შენი შვილის ზღაპარი — წუთებში.
*(Create your child's fairy tale — in minutes.)*

**Sub-headline:** Zghapari არის უსწრაფესი და უმარტივესი გზა, რომ დაკავებულმა მშობლებმა შექმნან, დაახატონ და გამოსცენ ბავშვების წიგნები. შეინარჩუნე კულტურა, აანთე ფანტაზია — ყოველგვარი წერისა და ხატვის გარეშე.

**English version:**
**Headline:** Turn Your Child Into the Hero of Their Own Georgian Fairy Tale — In Minutes.

**Sub-headline:** Zghapari is the fastest, easiest way for busy parents to create, illustrate, and publish custom children's books. Preserve your culture and spark their imagination — without writing a single word or drawing a single line.

**CTA:** შექმენი პირველი ზღაპარი უფასოდ / Create Your First Zghapari for Free

### Problem Section
**ძილის წინ ამბავი არ უნდა იყოს სტრესი.**
*(Bedtime stories shouldn't be stressful.)*

Most parents:
- Search endlessly for books that reflect their values, heritage, and language.
- Feel too exhausted after a long day to invent new, engaging bedtime stories.
- Wish they could capture their child's wild imagination in a real book — but lack the time, tools, or budget.

Zghapari takes your quick idea and transforms it into a beautifully illustrated, culturally rich storybook — before your child puts on their pajamas.

### Features Section
- **Photo-to-Character:** Upload one photo. Your child becomes the illustrated hero — exploring the Caucasus, outsmarting dragons, wearing a chokha.
- **Drawing-to-Story:** Upload your child's crayon doodle. Zghapari builds an entire story around it.
- **Grows With Your Child:** Stories adapt to your child's age. What's magical at 3 becomes an adventure at 7.
- **Georgian Heart, Modern Tech:** AI-generated illustrations in styles inspired by Georgian art — from Pirosmani's warmth to modern vibrant design.
- **Bilingual:** Georgian and English with one click.

### How It Works
1. **Share an idea** — type a prompt or pick a story template.
2. **Choose your style** — select art style, language, and your child's character.
3. **Let the AI work** — full book with consistent illustrations in under 2 minutes.
4. **Read, edit, export** — read on-screen, tweak anything, download as PDF.

### Closing CTA
**არ წაიკითხო ზღაპარი. შექმენი ის ერთად.**
*(Don't just read a fairy tale. Create it together.)*

---

## 10. Key Technical Considerations for Architecture

> *Guidance for the dev team — not exhaustive architecture, but constraints to design around.*

1. **Character consistency is the hardest problem.** The same child character must look recognizably identical across all pages of a book and across multiple books. This likely requires storing a character reference (embedding, LoRA, or reference images) per child profile and injecting it into every image generation call. Investigate: IP-Adapter, consistent-character techniques, or fine-tuning approaches.

2. **Image generation is the bottleneck.** A 10-page book = 10 illustrations + 1 cover = 11 image generation calls. At ~15-30s per image, this is 3-5 minutes sequentially. Parallelize where possible. Use async job queues with progress reporting to the client.

3. **Georgian language quality matters.** LLMs vary in Georgian text quality. Evaluate models specifically for Georgian output. Consider post-processing or human review for story templates. Georgian script rendering in PDFs must be tested thoroughly (font embedding, Unicode handling).

4. **Multilingual architecture from day one.** Even though MVP is Georgian + English, the data model, UI framework, content pipeline, and API should all support locale as a first-class parameter. Don't hardcode language assumptions.

5. **Payment integration in Georgia.** Stripe has limited support in Georgia. Research local options: BOG iPay, TBC Pay, or similar Georgian payment processors. Architecture should abstract the payment provider.

6. **Mobile-first, but not mobile-only.** Design the API and UI for mobile-first usage (Georgian market is ~70% mobile). The web app must be responsive. Plan for eventual native apps but don't build them at MVP.

7. **Photo storage and processing.** Photos of children are sensitive data. Process photos to generate character references, then offer parents the option to delete the original. Store character references (not raw photos) as the long-lived asset. Encrypt at rest. Isolate from other data stores.

8. **PDF generation.** Must support Georgian script with proper font embedding. Consider server-side PDF generation (e.g., Puppeteer, WeasyPrint, or a dedicated PDF service) rather than client-side. Print-ready means: correct DPI (300+), bleed margins, CMYK color space consideration for future print phase.

9. **Content moderation pipeline.** Both text prompts and generated outputs (text + images) need safety filtering. This should be a middleware layer, not embedded in generation logic — so it can be updated independently.

10. **Idempotent generation with caching.** If a user regenerates one illustration, don't regenerate the whole book. Each page's generation should be independently triggerable. Cache completed pages.
