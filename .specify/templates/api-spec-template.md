# API Spec — [Feature Name]

> Spec: NNN | Status: Draft / Approved | Author: Architect agent | Date: YYYY-MM-DD
> Base URL: `/api/v1`
> Auth: All endpoints require `Authorization: Bearer <jwt>` unless marked 🔓 Public

---

## ⚠️ Uncertainty declaration
> List any endpoint design decisions you are not certain about.
> Frontend and backend engineers both depend on this contract — uncertainty here is expensive.

| Endpoint | Uncertainty | Question for developer |
|---|---|---|
| [e.g. POST /books] | [Should page count be set at creation or later?] | [Which approach fits the wizard flow?] |

---

## Endpoints

---

### `POST /[resource]`
**Purpose:** [One sentence — what this endpoint does]
**Auth:** 🔒 Required / 🔓 Public

**Request body:**
```json
{
  "field_name": "string",          // required — description
  "field_name_2": 123,             // required — description
  "optional_field": "string|null"  // optional — description
}
```

**Success response — `201 Created`:**
```json
{
  "data": {
    "id": "uuid",
    "field_name": "string",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "error": null
}
```

**Error responses:**

| Status | Code | When |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Required field missing or invalid |
| `401` | `UNAUTHORIZED` | Missing or invalid JWT |
| `403` | `FORBIDDEN` | User doesn't own this resource |
| `409` | `CONFLICT` | [Specific conflict condition] |
| `422` | `LIMIT_REACHED` | Free tier limit hit |

**Frontend notes:**
[Anything the frontend engineer needs to know about calling this endpoint]

**Backend notes:**
[Any business logic the backend engineer must implement — e.g. "enforce free tier limit here"]

---

### `GET /[resource]/:id`
**Purpose:** [One sentence]
**Auth:** 🔒 Required

**Path params:**
| Param | Type | Description |
|---|---|---|
| `id` | `UUID` | [Resource] ID |

**Query params:**
| Param | Type | Required | Description |
|---|---|---|---|
| `locale` | `string` | No | Language code — `ka` or `en`, defaults to user preference |

**Success response — `200 OK`:**
```json
{
  "data": {
    "id": "uuid"
  },
  "error": null
}
```

**Error responses:**

| Status | Code | When |
|---|---|---|
| `401` | `UNAUTHORIZED` | |
| `403` | `FORBIDDEN` | Resource belongs to another user |
| `404` | `NOT_FOUND` | Resource doesn't exist or is soft-deleted |

---

### `PATCH /[resource]/:id`
[Repeat structure — use PATCH not PUT for partial updates]

---

### `DELETE /[resource]/:id`
[Repeat structure — note whether this is hard or soft delete]

---

## Async job endpoints

### `POST /[resource]/:id/[action]`
**Purpose:** [Triggers an async job — e.g. "Start illustration generation for a page"]
**Auth:** 🔒 Required

**Success response — `202 Accepted`:**
```json
{
  "data": {
    "job_id": "uuid",
    "status": "queued",
    "poll_url": "/api/v1/jobs/uuid/status"
  },
  "error": null
}
```

---

### `GET /jobs/:job_id/status`
**Purpose:** Poll for async job progress
**Auth:** 🔒 Required

**Success response — `200 OK`:**
```json
{
  "data": {
    "job_id": "uuid",
    "status": "queued | processing | complete | failed",
    "progress": {
      "total": 11,
      "completed": 4,
      "failed": 0
    },
    "result_url": "/api/v1/[resource]/uuid",  // null until complete
    "error_message": null                      // null unless failed — generic message only
  },
  "error": null
}
```

---

## Standard error response shape
> All errors follow this shape — no exceptions.

```json
{
  "data": null,
  "error": {
    "code": "ERROR_CODE_CONSTANT",
    "message": "Human readable message — shown to developer, not user",
    "field": "field_name"  // only for VALIDATION_ERROR
  }
}
```

---

## Error code reference

| Code | HTTP Status | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Request body failed validation |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | Valid JWT but wrong user |
| `NOT_FOUND` | 404 | Resource doesn't exist or soft-deleted |
| `CONFLICT` | 409 | Duplicate or conflicting state |
| `LIMIT_REACHED` | 422 | Free tier limit hit |
| `GENERATION_FAILED` | 500 | AI generation error — never expose details |
| `INTERNAL_ERROR` | 500 | Unexpected error |
