# Research Report 04 — GDPR and Georgian Data Law for Children's Photo Data

**Status:** RESEARCHED (not tested)
**Date:** 2026-03-24
**Researcher:** Research Agent

**Important disclaimer:** This report is for informational purposes only and does not constitute legal advice. The Zghapari team should consult a qualified data protection lawyer — particularly one familiar with Georgian law — before launch. Children's biometric data is a high-risk processing category and the legal consequences of non-compliance are significant.

---

## Summary

- Children's photos submitted for AI character generation constitute **sensitive personal data** under both GDPR and Georgian law, triggering the highest level of legal protection. Processing photos of children under 16 (GDPR) or under 18 (Georgian law) requires **explicit, verifiable parental consent**.
- GDPR applies to Zghapari if it processes data of EU residents, regardless of where the company is incorporated. Even a Georgian-only product with no intentional EU marketing may encounter EU users. The safest approach is to build GDPR compliance from the start.
- The Georgian **Personal Data Protection Law** (2023 revision, in force) aligns substantially with GDPR principles but has some differences, particularly in enforcement authority (the Personal Data Protection Service of Georgia — PDPS) and specific consent requirements for children.
- Sending a child's photo to a US-based AI API (e.g., OpenAI, Google) constitutes a **cross-border data transfer** requiring specific safeguards under both laws. Google Cloud and OpenAI provide Standard Contractual Clauses (SCCs) for this purpose, but they must be actively executed (not just assumed).
- The product's planned approach — process photo then offer deletion — is **legally correct in direction** but requires specific UX, timing, and documentation to be compliant. The details matter.

---

## Detailed Findings

### 1. What Data is Being Processed?

**RESEARCHED (not tested)**

Zghapari processes the following categories of child-related data:

| Data Type | Classification | Legal Sensitivity |
|---|---|---|
| Child's name | Personal data | Standard |
| Child's date of birth | Personal data | Standard |
| Child's photo | Biometric data / special category | HIGHEST |
| Generated character reference (illustration) | Personal data | High (derived from biometrics) |
| Story content featuring the child | Personal data | High (personalized) |

**Photos of children are biometric data** under GDPR Article 9 because they can be used to uniquely identify an individual (facial recognition). Even if Zghapari does not use the photo for recognition purposes, the legal classification depends on the nature of the data, not the intended use.

---

### 2. GDPR Requirements

**RESEARCHED (not tested)**

#### 2.1 Applicability to Zghapari

GDPR applies when:
- The company is established in the EU, OR
- The company processes personal data of individuals in the EU (regardless of company location)

Even if Zghapari is a Georgian company, if any EU resident uses the service, GDPR applies to that user's data. Given the Georgian diaspora target market (EU residents of Georgian origin), GDPR applicability is a near certainty.

**Design decision:** Build GDPR compliance from the start. It also aligns with Georgian law and serves as the higher standard for all users.

#### 2.2 Children Under GDPR

- **Information society services** (online platforms) require **parental consent for children under 16** (Article 8). Member states may lower this to 13 — varies by country.
- Biometric data is a **special category** under Article 9, requiring:
  - Explicit consent (not bundled with terms of service — a separate, clear action), OR
  - Another lawful basis (Article 9(2)) — for Zghapari, consent is the only applicable basis

**For Zghapari:** Photo upload must be gated by an explicit parental consent action. "By uploading a photo..." buried in terms of service is NOT sufficient. A dedicated consent checkbox with plain language is required.

#### 2.3 Data Minimization (Article 5(1)(c))

GDPR requires collecting only the data necessary for the stated purpose. For Zghapari:
- The stated purpose is: "generate an illustrated character from your child's photo"
- Once the character illustration is generated and approved, the original photo is no longer necessary
- **Obligation:** Offer (and ideally default to) immediate deletion of the original photo after character generation
- Retaining the original photo beyond character generation is arguably a data minimization violation

#### 2.4 Purpose Limitation (Article 5(1)(b))

The photo may only be used for the purpose for which consent was given. Zghapari's consent must specify:
- The photo will be sent to [AI service name, e.g., "Google Gemini AI service"] for processing
- The photo will be used to generate an illustrated character
- The original photo will be deleted after [time period or user action]
- The generated character reference will be stored for [purpose: generating future book illustrations]

#### 2.5 Right to Erasure (Article 17)

Parents must be able to:
- Delete the original photo at any time
- Delete the generated character reference at any time
- Delete the child's profile entirely (cascading deletion of all associated data)
- Have these deletions executed within 30 days (GDPR requires "without undue delay")

The system must support soft-delete → hard-delete within 30 days. Backup retention should not exceed 30–90 days (document the exact retention schedule).

#### 2.6 Data Breach Notification (Article 33)

If a breach affecting personal data occurs:
- Notify the relevant supervisory authority within 72 hours
- If Georgian company + EU users: notify both the Georgian PDPS and the lead EU supervisory authority (most likely GDPA — Irish DPC if Google infrastructure is involved, otherwise the DPA of the country with the most affected users)
- Notify affected users "without undue delay" if the breach poses high risk to their rights

#### 2.7 Data Protection Impact Assessment (DPIA — Article 35)

A DPIA is **mandatory** before processing that is "likely to result in a high risk" to individuals. Processing children's biometric data clearly meets this threshold.

A DPIA for Zghapari must document:
- Description of processing: what data, for what purpose, by which systems
- Assessment of necessity and proportionality
- Assessment of risks: data breach, misuse, unauthorized access
- Mitigating measures: encryption, access controls, deletion procedures
- Residual risk assessment

A DPIA is not publicly filed — it is an internal document. But regulators may request it during an investigation.

---

### 3. Georgian Personal Data Protection Law

**RESEARCHED (not tested)**

#### 3.1 Current Legal Framework

Georgia's **Personal Data Protection Law** (Georgian: „პერსონალური მონაცემების დაცვის შესახებ" საქართველოს კანონი) has been substantially revised and updated, with the most recent significant revision bringing it closer to GDPR standards. Key institutional context:

- **Enforcement authority:** The **Personal Data Protection Service of Georgia (PDPS)** (პერსონალური მონაცემების დაცვის სამსახური) is the supervisory authority.
- **Website:** https://personaldata.ge
- Georgia has been on an EU association path, leading to deliberate alignment with GDPR.

#### 3.2 Key Requirements

**Special Categories of Data:**

Georgian law treats the following as special (sensitive) categories requiring heightened protection:
- Biometric data used for identification (includes facial images processed for identification purposes)
- Health data
- Data on minors (children) specifically has enhanced protections

**Children's Data:**
- Processing personal data of children requires **parental or guardian consent**
- The law defines minors as persons under 18 (stricter than GDPR's 16-year threshold)
- For any processing of a minor's data, the parent must be the data subject for consent purposes

**Consent Requirements:**
- Must be freely given, specific, informed, and unambiguous
- Must be explicitly obtained for sensitive/special category data
- Must be revocable at any time, with the same ease as giving it

**Data Minimization:**
- Aligned with GDPR: process only what is necessary for the stated purpose

**Data Retention:**
- Data must not be retained longer than necessary for the purpose
- Must establish and document retention periods

**Rights of Data Subjects (through their parent/guardian for children):**
- Right to access
- Right to rectification
- Right to erasure
- Right to restriction of processing
- Right to object

**Data Processor Agreements:**
- When Zghapari uses AI APIs (Google, OpenAI) to process personal data, Zghapari is the **data controller** and the AI API provider is the **data processor**
- A Data Processing Agreement (DPA) must be in place before processing begins
- Google Cloud and OpenAI both offer standard DPAs — these must be actively accepted in the account settings, not assumed

#### 3.3 Georgian Law vs GDPR — Key Differences

| Topic | GDPR | Georgian Law | Action for Zghapari |
|---|---|---|---|
| Age for children | Under 16 (or 13 per member state) | Under 18 | Use 18 as the threshold to satisfy both |
| Fines | Up to 4% global turnover / €20M | Fines set by PDPS (lower than GDPR) | Comply with GDPR standard for highest protection |
| Enforcement authority | National DPAs (27 countries) | PDPS (Georgia) | Register/notify PDPS if required |
| Cross-border transfers | SCCs, adequacy decisions | Similar requirements | Use SCCs with Google/OpenAI |
| DPA requirement | Mandatory written DPA with processors | Similar requirement | Execute Google + OpenAI DPAs |
| DPIA trigger | High-risk processing | Similar triggers | Conduct DPIA for children's biometric processing |

---

### 4. Cross-Border Data Transfers

**RESEARCHED (not tested)**

When Zghapari sends a child's photo to Google Cloud (US servers) or OpenAI (US servers), this is a cross-border transfer of personal data from Georgia (and potentially the EU) to a third country.

**GDPR requirements for transfers to the US:**
- The EU-US Data Privacy Framework (DPF) was adopted in 2023, providing a legal mechanism for EU-US transfers for certified companies
- Google and OpenAI are DPF-certified — check current certification at https://www.dataprivacyframework.gov
- Additionally/alternatively: use Standard Contractual Clauses (SCCs), which Google Cloud and OpenAI both provide

**Georgian law requirements:**
- Similar requirements for transfers to countries without "adequate" data protection
- SCCs are recognized as a valid transfer mechanism

**Practical action items:**
1. Execute Google Cloud's Data Processing Addendum (DPA) — available in GCP console
2. Accept OpenAI's Data Processing Agreement — available in OpenAI platform settings
3. Document in the DPIA and privacy policy that data may be processed in the US
4. If possible, configure Google Cloud to use EU data regions (reducing GDPR complexity)

**⚠️ ARCHITECTURAL IMPACT:** If the team uses Google Cloud with `us-central1` as the region (the default for Gemini API), all data including uploaded photos passes through US-based infrastructure. Switching to `europe-west4` (Netherlands) for storage and processing reduces GDPR cross-border transfer complexity significantly but may not be available for all Gemini API features. This is an architecture decision that must be made before the infrastructure is provisioned.

---

### 5. Technical Safeguards Required

**RESEARCHED (not tested)**

The following technical measures are required (not optional) for legally compliant processing of children's photos:

#### 5.1 Encryption

- **At rest:** All stored photos and character references must be encrypted at rest (AES-256 minimum). AWS S3, GCS: server-side encryption is enabled by default with the service's managed key. For higher assurance, use Customer-Managed Encryption Keys (CMEK).
- **In transit:** TLS 1.2 minimum for all API calls and data transfers. TLS 1.3 preferred.
- **In processing:** Cannot encrypt data while it is being processed by the AI API, but ensure the API call itself is encrypted (HTTPS — standard for all major API providers).

#### 5.2 Access Controls

- Photos and character references must be stored in a **private, non-public S3/GCS bucket**
- Access to photos must be through signed, time-limited URLs (not public URLs)
- Only the specific background job processing the photo should have read access during processing
- Application logs must **never** contain photo URLs, file paths, or any extractable reference to a child's photo

#### 5.3 Audit Logging

Log the following events (without logging the data itself):
- Photo upload initiated (user_id, child_profile_id, timestamp)
- Photo sent to AI processing (user_id, child_profile_id, provider, timestamp)
- Character generation completed (user_id, child_profile_id, timestamp)
- Photo deletion requested (user_id, child_profile_id, timestamp)
- Photo hard-deleted (user_id, child_profile_id, timestamp)
- Character reference deleted (user_id, child_profile_id, timestamp)

Never log: file contents, base64 photo data, character descriptions extracted from photos, user's child's name alongside any photo identifier.

#### 5.4 Retention and Deletion

| Asset | Retention Period | Deletion Trigger |
|---|---|---|
| Original photo | Until user explicitly deletes, max 7 days if no action | User request or auto-expire |
| Character reference (illustration) | Until user deletes child profile | User request |
| Story content | Until user deletes book | User request |
| Audit logs | 12 months | Auto-expire |
| Backups | 30 days max | Auto-expire |

**Recommended UX flow for photo deletion:**
1. After character generation is complete and approved: show a prominent prompt — "Your photo has been used to create [Child's Name]'s character. Would you like to delete the original photo now? Your character is already saved." with a clear "Delete Photo" button.
2. Default behavior: offer but don't auto-delete immediately (some users may want to regenerate with the same photo).
3. If user has not deleted within 7 days of upload: send an email notification and offer deletion again.
4. If user has not deleted within 30 days: auto-delete the original photo. Log the auto-deletion event.

---

### 6. Privacy Policy and Consent Language

**RESEARCHED (not tested)**

The privacy policy must include, in plain language accessible to non-lawyers:

**For the photo upload specifically, include:**
- Exactly what happens to the photo (sent to [named AI provider] for character generation)
- Where the photo is stored (cloud storage, region if known)
- How long it is stored
- How to delete it
- That the photo is never used to train AI models (explicitly)
- That the photo is never shared with third parties except the named AI processing provider

**Consent checkpoint (not just in privacy policy — in the product UI):**

At the moment a parent attempts to upload a photo, show a consent modal that includes:
- "I am the parent or legal guardian of the child whose photo I am uploading"
- "I understand this photo will be sent to [Google Gemini AI service] to create an illustrated character"
- "I agree to the [Privacy Policy link] regarding how this photo will be processed and stored"
- A single clear checkbox: "I agree"

This separate consent action is required for special category (biometric) data. It cannot be buried in account creation terms of service.

---

### 7. Operational Compliance Checklist

**RESEARCHED (not tested)**

Before launch, complete the following:

- [ ] Execute Google Cloud Data Processing Addendum in GCP console
- [ ] Execute OpenAI Data Processing Agreement (if OpenAI is used)
- [ ] Draft and publish privacy policy (Georgian and English versions)
- [ ] Implement dedicated consent UI for photo upload
- [ ] Implement photo deletion flow (user-initiated and auto-expire)
- [ ] Implement account/child-profile deletion with cascading data deletion
- [ ] Configure S3/GCS bucket as private (no public access)
- [ ] Enable server-side encryption on storage bucket
- [ ] Implement audit logging for photo lifecycle events
- [ ] Conduct internal DPIA and document findings
- [ ] Register with the Personal Data Protection Service of Georgia (PDPS) if required
- [ ] Define and document data retention schedule
- [ ] Set up data breach response procedure (who to notify, how quickly)
- [ ] Review with a Georgian data protection lawyer before launch

---

## Risks & Unknowns

1. **Georgian PDPS registration requirement** — it is unclear whether Zghapari must proactively register with the PDPS before processing begins, or whether notification is only required for certain types of high-risk processing. A Georgian data protection lawyer must clarify this.
2. **"Biometric data" classification boundary** — the classification of a casual face photo as biometric depends on how it is processed. If Zghapari does not run facial recognition on the photo (it only passes it to an AI image generator), the biometric classification argument is weaker. However, the safest approach is to treat it as biometric/special category regardless.
3. **AI provider subprocessors** — Google and OpenAI use subprocessors. Under GDPR, if Zghapari's DPA with Google lists subprocessors, any change to those subprocessors may require notification. Monitor for changes.
4. **Georgian law updates** — Georgia's data protection law may continue to evolve as part of EU alignment. Check for updates to the law annually.
5. **Age verification** — Zghapari cannot reliably verify that the person uploading a photo is actually the parent. The consent checkbox serves as a legal declaration, not a technical verification. This is a known limitation of online consent mechanisms.
6. **COPPA (US)** — if Zghapari later markets in the US, COPPA applies to services directed at children under 13. COPPA requires verifiable parental consent (higher bar than a checkbox), specific privacy notice format, and other requirements. Plan for this at Phase 3 international expansion.

---

## Recommendation

**Build GDPR compliance from day one, treating it as the baseline for all users (confidence: High)**

The Georgian diaspora target market (EU residents) makes GDPR near-certain to apply. Georgian law is substantially aligned with GDPR. Building to GDPR standard means complying with both laws simultaneously with minimal additional effort.

**Five non-negotiable actions before launch:**
1. **Execute Google Cloud and OpenAI DPAs** — 30 minutes of admin work; no excuse to skip
2. **Implement dedicated consent UI** for photo upload (separate from account creation, specific to photo processing)
3. **Implement auto-expire photo deletion at 30 days** with a reminder prompt at 7 days
4. **Configure storage as private with signed URLs** — no public photo bucket ever
5. **Consult a Georgian data protection lawyer** for at least a 2-hour review of the planned processing and draft privacy policy — budget 500–1000 GEL for this

**Architectural note:** Store photos and character references in a **separate S3/GCS bucket** from general application assets (book PDFs, public images). This provides cleaner access control, clearer audit trails, and easier compliance with deletion requirements.

---

## Sources

All sources are from the researcher's knowledge base (cutoff August 2025). Web search was unavailable during this research session.

- GDPR full text: https://gdpr-info.eu
- GDPR Article 9 (special categories): https://gdpr-info.eu/art-9-gdpr/
- GDPR Article 17 (right to erasure): https://gdpr-info.eu/art-17-gdpr/
- GDPR Article 35 (DPIA): https://gdpr-info.eu/art-35-gdpr/
- Georgian Personal Data Protection Service: https://personaldata.ge
- Georgian Personal Data Protection Law text (Georgian): https://matsne.gov.ge
- EU-US Data Privacy Framework: https://www.dataprivacyframework.gov
- Google Cloud Data Processing Addendum: https://cloud.google.com/terms/data-processing-addendum
- OpenAI Data Processing Agreement: https://openai.com/policies/data-processing-addendum
- PCI-DSS SAQ A: https://www.pcisecuritystandards.org/document_library
- COPPA (US FTC): https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa
- EDPB Guidelines on children's data: https://edpb.europa.eu
