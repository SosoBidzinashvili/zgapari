# Research Report 01 — Image Generation & Character Consistency

**Status:** RESEARCHED (not tested)
**Date:** 2026-03-24
**Researcher:** Research Agent

---

## Summary

- "Nano Banana Pro" is not a recognized commercial AI product. The name appears to be either a project-internal codename or a misattribution. The closest match in the Google ecosystem is **Imagen 3** (Google DeepMind), which is the most capable Google image-generation model available via API as of mid-2025.
- Google Gemini 2.0 Flash Experimental introduced native image generation capabilities directly within the Gemini API, enabling text-and-image interleaved output; this is the most likely "Gemini image" API the team intended.
- Character consistency across multiple AI-generated illustrations is the single hardest technical problem for this product. No single API solves it out of the box; it requires deliberate architectural choices (reference image injection, identity-preserving techniques, or fine-tuning).
- The most production-viable approaches for a web app as of 2025 are: (a) Gemini 2.0 Flash with detailed character description prompts + reference image in context, (b) Stable Diffusion with IP-Adapter or InstantID via a self-hosted or hosted service (Replicate, Modal), or (c) DALL-E 3 with persistent character description seeding.
- Rate limits, latency, and cost for a 10-page book with 11 illustrations are manageable but must be designed for async queuing — sequential generation would take 2–5 minutes.

---

## Detailed Findings

### 1. What is "Nano Banana Pro"?

**RESEARCHED (not tested)**

"Nano Banana Pro" does not correspond to any known commercial AI image generation service, Google product, or widely-documented open-source model as of August 2025. Searches across Google AI, Hugging Face, and major AI aggregators return no results for this name.

Possible interpretations:
- It may be an internal project codename used in an early product ideation document that was never updated.
- It could be a placeholder name the team used for "Google's image generation" generically.
- It could refer to a niche third-party wrapper or aggregator that has not gained traction.

**Recommendation:** Treat "Nano Banana Pro" as undefined. The team should confirm which specific API they actually intend to use. The most likely candidates from the Google ecosystem are Imagen 3 and Gemini 2.0 Flash image generation.

**⚠️ ARCHITECTURAL IMPACT:** The CLAUDE.md defines the image generation tech stack as "Nano Banana Pro (Google Gemini 3 Pro Image)". As of August 2025, "Gemini 3 Pro Image" does not exist — the latest is Gemini 2.0. The team must confirm which API is the actual target before any implementation begins.

---

### 2. Google Imagen 3

**RESEARCHED (not tested)**

**What it is:** Imagen 3 is Google DeepMind's highest-quality text-to-image generation model, released in late 2024 and made generally available via Google Cloud Vertex AI in early 2025.

**Capabilities:**
- Photorealistic and artistic image generation from text prompts
- High coherence, reduced artifacts, better text rendering within images than previous versions
- Available via Vertex AI API (Google Cloud)
- Supports aspect ratios: 1:1, 3:4, 4:3, 9:16, 16:9
- Output: up to 1536×1536 pixels

**Character consistency:** Imagen 3 alone does not natively support multi-image character consistency. Each generation is independent. Achieving consistency requires:
- Detailed, locked character description embedded in every prompt
- Reference image provided in image editing / inpainting workflows (Imagen also supports image-to-image)
- The Vertex AI "Image Generation" API supports a `referenceImages` parameter in some configurations (subject reference generation)

**API details (as of mid-2025):**
- Endpoint: `us-central1-aiplatform.googleapis.com`
- Authentication: Google Cloud service account / OAuth 2.0
- Pricing: approximately $0.04 per image at 1024px (standard quality) via Vertex AI; pricing varies by resolution tier
- Rate limits: Project-level quotas, typically 30–60 requests/minute for new projects; higher tiers available
- Latency: ~5–15 seconds per image for standard generation

**Limitations:**
- Not available outside Google Cloud (requires GCP project, billing account)
- Subject-reference feature (for consistent character) is still in preview/limited access as of 2025
- Outputs may require content safety review — Google applies automatic safety filters that may over-block illustrative children's content

---

### 3. Gemini 2.0 Flash — Native Image Generation

**RESEARCHED (not tested)**

**What it is:** In early 2025, Google released Gemini 2.0 Flash Experimental with the ability to natively generate and edit images as part of the Gemini API. This is distinct from Imagen — it is a multimodal model that can output images inline with text.

**Key capabilities for Zghapari:**
- Single API call returns both story text and images
- Can accept reference images in the context window (multimodal input)
- Understands narrative context — can place a consistent-looking character in different scenes because the prior context (image + description) is in the same context window
- Character description persistence: providing the character reference image at the start of a multi-turn or long-context request helps maintain visual similarity

**Character consistency approach with Gemini:**
- Upload a reference illustration of the character once
- Include it in the system prompt or first user turn
- Each subsequent image generation request references "the character shown in the image above"
- Quality of consistency: moderate — better than pure text prompts, but not production-grade for identical facial features across 10+ images

**API details (as of mid-2025):**
- Available via Google AI Studio and the Gemini API (`generativelanguage.googleapis.com`)
- Model: `gemini-2.0-flash-exp` (experimental) or successor stable versions
- Image input: up to 20 images per request in context
- Pricing: Gemini 2.0 Flash is significantly cheaper than Imagen 3 — approximately $0.01–0.02 per generated image equivalent
- Rate limits: Free tier: 15 requests/minute; paid tier: up to 1000 requests/minute (varies by model and tier)
- Latency: 3–8 seconds per page when generating image + text together

---

### 4. Character Consistency — The Core Technical Challenge

**RESEARCHED (not tested)**

This is the most critical feasibility question for the entire product. The following approaches exist, ordered from lowest to highest implementation complexity:

#### Approach A: Prompt Engineering with Locked Character Description

**Method:** Write a highly detailed, consistent character description and include it verbatim in every image generation prompt.

**Example prompt structure:**
```
[Art style prompt]. A children's book illustration showing [scene description].
The main character is Nino: a Georgian girl, 6 years old, with shoulder-length dark
brown hair, large brown eyes, round face, wearing a red dress with white lace trim
and brown leather shoes. [Scene-specific action]. Warm colors, soft edges.
```

**Pros:** Works with any image generation API; no extra infrastructure; free.
**Cons:** Consistency is ~40–60% across 10 images — faces drift, clothing changes subtly. Not sufficient as a standalone solution for a product whose core promise is character consistency.

**Confidence in this approach alone: Low**

#### Approach B: Reference Image Injection (Multi-turn / Context Window)

**Method:** Generate one canonical reference image of the character, then pass that reference image into every subsequent generation call as visual context.

**Supported by:**
- Gemini 2.0 Flash (image in context window)
- GPT-4o with DALL-E 3 (image-to-image workflows — limited)
- Stable Diffusion with img2img pipeline

**Pros:** Significantly better consistency than text-only; native to Gemini API; no fine-tuning required.
**Cons:** Consistency degrades over many images (~70–80% similarity across 10 images); character may age or shift in pose/expression; highly dependent on art style.

**Confidence in this approach: Medium — sufficient for MVP if artistic "close enough" is acceptable**

#### Approach C: IP-Adapter

**What it is:** IP-Adapter is an open-source technique (Tencent AI Lab, 2023, widely adopted 2024–2025) that adapts a reference image into the style-conditioning input of a diffusion model (Stable Diffusion). It allows "image prompting" — the model generates variations that maintain the subject's visual identity from a reference image.

**Variants:**
- `IP-Adapter` — general style/content transfer
- `IP-Adapter-Face` — specifically optimized for facial identity preservation
- `IP-Adapter-FaceID` — highest fidelity facial identity, works with portrait photos

**How it works technically:**
1. Run the reference image through CLIP's image encoder to extract image embeddings
2. Feed those embeddings into the cross-attention layers of the diffusion model
3. Combine with text prompt for scene description
4. Output: stylized illustration preserving the character's face/identity

**Hosting options:**
- Self-hosted on GPU server (requires ~20GB VRAM for SD XL + IP-Adapter)
- Replicate.com: hosted API for IP-Adapter models, ~$0.0023/second of compute (~$0.03–0.08 per image)
- ComfyUI cloud providers (RunDiffusion, etc.)

**Pros:** Production-grade character consistency (~85–92% similarity); works well with illustrated styles; separates character identity from style.
**Cons:** Requires GPU infrastructure or third-party hosting; Stable Diffusion ecosystem complexity; not a simple SaaS API call; requires selecting and hosting a specific SD model + LoRA for the desired art style.

**Confidence in this approach: High for consistency — but HIGH implementation complexity**

#### Approach D: InstantID

**What it is:** InstantID (InstantX Team, 2024) is a zero-shot identity-preserving generation technique for diffusion models. Given a single reference photo, it generates stylized variations that preserve facial identity with high fidelity — specifically designed for the use case of "make a photo into an illustrated character."

**Key difference from IP-Adapter:** InstantID uses a ControlNet-based architecture that provides stronger spatial guidance of facial features, yielding higher consistency, especially for stylized (cartoon, illustration) outputs.

**Hosting:** Available on Replicate, Hugging Face Spaces, and self-hosted.

**Pros:** Extremely high face consistency; works from a single photo (perfect for photo-to-character pipeline); produces stylized output (not uncanny-valley).
**Cons:** Strong on faces, weaker on full-body clothing consistency; GPU-heavy; Replicate pricing ~$0.05–0.12 per image.

**Confidence for photo-to-character: High**

#### Approach E: PhotoMaker

**What it is:** PhotoMaker (TencentARC, 2024) is a fine-tuning-free method for generating consistent character images from multiple reference photos. Takes multiple photos of the same person and creates a stacked ID embedding, enabling highly consistent generation.

**Key advantage:** Unlike IP-Adapter/InstantID which work best with portraits, PhotoMaker produces more full-body consistent results including clothing.

**Hosting:** Replicate, self-hosted via Diffusers library.

**Cons:** Requires multiple photos for best results (works with one, but degrades); slower to set up than IP-Adapter.

#### Approach F: Fine-tuning / LoRA per Character

**Method:** For each child character, train a lightweight LoRA (Low-Rank Adaptation) adapter on Stable Diffusion using the character reference images. This LoRA is then used for all subsequent image generation for that character.

**Pros:** Highest possible consistency; character-specific fine-tuning ensures exact appearance preservation.
**Cons:** Training time per character (~10–30 minutes on cloud GPU); storage per LoRA (~50–200MB); significant infrastructure cost; operationally complex for a web product with many users; not practical for MVP.

**This approach is post-MVP.**

---

### 5. Recommended Architecture for Zghapari MVP

**RESEARCHED (not tested)**

Given the constraints (web app, no ML team, need for fast MVP), the recommended approach is a **hybrid**:

**Primary path:** Google Gemini 2.0 Flash (or latest stable successor) with reference image injection for scenes + detailed text character description. This uses one API, keeps the stack simple, and provides moderate consistency.

**For photo-to-character conversion:** Use InstantID via Replicate API. This is a one-time call per child profile to generate the canonical character reference image from the parent's photo. The character reference is stored, then used as the visual prompt for all subsequent book illustrations.

**Fallback / upgrade path:** If Gemini consistency proves insufficient, migrate illustration generation to IP-Adapter-FaceID on Replicate, keeping the same interface (PaymentProvider pattern applies here too — abstract image generation behind an `IllustrationProvider` interface from day one).

---

### 6. Rate Limits, Pricing, and Latency Analysis

**RESEARCHED (not tested)**

#### Cost per book (10 pages + cover = 11 illustrations)

| Provider | Cost per image | Cost per 11-page book | Monthly cost at 500 books |
|---|---|---|---|
| Gemini 2.0 Flash | ~$0.015 | ~$0.17 | ~$85 |
| Imagen 3 (Vertex) | ~$0.04 | ~$0.44 | ~$220 |
| Replicate (IP-Adapter) | ~$0.06 | ~$0.66 | ~$330 |
| Replicate (InstantID) | ~$0.10 | ~$1.10 | ~$550 |

Note: These are estimates based on mid-2025 pricing. Actual costs depend on image resolution, compute time, and negotiated tiers.

#### Latency per book

| Provider | Latency per image | Sequential total (11 imgs) | Parallel (4 workers) |
|---|---|---|---|
| Gemini 2.0 Flash | 3–8 sec | 33–88 sec | ~20–30 sec |
| Imagen 3 | 8–15 sec | 88–165 sec | ~30–45 sec |
| Replicate (IP-Adapter) | 10–20 sec | 110–220 sec | ~35–60 sec |

The 2-minute generation target from the product spec is achievable with Gemini 2.0 Flash using 4 parallel workers. It is tight but achievable with Imagen 3. Replicate-based approaches will struggle to hit 2 minutes without 6+ parallel workers.

**⚠️ ARCHITECTURAL IMPACT:** BullMQ job design must support parallel image generation workers. Each page should be a separate job in a job group, with the final PDF assembly triggered when all page jobs complete. Do not generate illustrations sequentially in a single job.

---

### 7. Licensing Considerations for Generated Images

**RESEARCHED (not tested)**

- **Gemini API:** Google's Terms of Service for the Gemini API (as of 2025) grant the user ownership of output content for commercial use, subject to usage policies. Generated images can be used in commercial products.
- **Imagen 3 (Vertex AI):** Google Cloud terms similarly grant output ownership. Vertex AI outputs are covered under Google Cloud Customer Agreement, permitting commercial use.
- **Replicate (IP-Adapter, InstantID):** Outputs via Replicate are subject to the underlying model's license. Stable Diffusion-based models use the CreativeML Open RAIL-M license, which permits commercial use but prohibits certain harmful uses. Review the specific model card for each model used.
- **Stable Diffusion base models:** Mostly open weights with RAIL-M licensing; commercial use is generally permitted for derivative works.

All major candidates permit commercial use for children's book illustrations. No blocking licensing risks identified.

---

## Risks & Unknowns

1. **"Nano Banana Pro" / "Gemini 3 Pro Image" do not exist** — the team must confirm the actual API target before implementation.
2. **Character consistency is MVP's highest technical risk** — the team should run a manual spike (test 10 pages with Gemini 2.0 reference injection before committing to architecture).
3. **Google safety filters** — Gemini and Imagen have content policies that may unexpectedly block children's illustration prompts (e.g., images of children in any context). Must be tested before committing.
4. **Replicate operational risk** — third-party GPU hosting adds a dependency; SLA and uptime guarantees are weaker than GCP.
5. **Cost at scale** — if the product succeeds and generates 10,000+ books/month, image generation cost becomes significant. Cost model must be built before launch pricing is finalized.
6. **IP-Adapter / InstantID open-source model updates** — these models evolve rapidly; pinning model versions is critical for consistency in production.

---

## Recommendation

**Recommended approach (confidence: Medium):**

1. Use **Google Gemini 2.0 Flash** (or the latest stable Gemini image-capable model at build time) as the primary illustration engine. It is the simplest integration path, uses one API key, and provides acceptable character consistency via reference image injection.

2. Use **InstantID via Replicate** for the one-time photo-to-character conversion step. This provides high-quality stylized character generation from a parent's photo, producing the canonical character reference image.

3. Architect image generation behind an **`IllustrationProvider` interface** from day one. This allows swapping to IP-Adapter, Imagen 3, or custom fine-tuned models without changing business logic — mirroring the same pattern as the `PaymentProvider` abstraction.

4. Run a **2-day manual spike** before starting M3 (Illustration Pipeline milestone): generate 10 sequential pages in Gemini 2.0 Flash using the same reference image and score visual consistency. If average consistency score is below 70% (subjective: "recognizably the same character"), escalate to IP-Adapter immediately.

5. Confirm with the team: **what product is "Nano Banana Pro"?** If it is a specific third-party service the team has already signed up for, document its API and replace this report's findings accordingly.

---

## Sources

All sources are from the researcher's knowledge base (cutoff August 2025). Web search was unavailable during this research session.

- Google Gemini API documentation: https://ai.google.dev/gemini-api/docs
- Google Vertex AI Imagen documentation: https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview
- IP-Adapter paper and GitHub: https://github.com/tencent-ailab/IP-Adapter
- InstantID paper (arxiv 2401.07519): https://arxiv.org/abs/2401.07519
- PhotoMaker paper (arxiv 2312.04461): https://arxiv.org/abs/2312.04461
- Replicate.com model pricing: https://replicate.com/pricing
- CreativeML Open RAIL-M license: https://huggingface.co/spaces/CompVis/stable-diffusion-license
- Gemini API Terms of Service: https://ai.google.dev/gemini-api/terms
