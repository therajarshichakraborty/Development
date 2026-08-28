# URL Shortener with Analytics — Low-Level Design

Stack: Node.js, Express, TypeScript, MongoDB, Mongoose, Docker, JWT auth, Zod validation, Postman for API verification.

---

## 1. Scope (MVP)

**In scope**

- User registration/login (JWT)
- Create short URL (auto-generated code or custom alias), with optional expiry
- Redirect via short code
- Click tracking per redirect (async, non-blocking)
- Analytics: total clicks, clicks over time, referrer breakdown, device/browser breakdown
- List/update/delete a user's URLs
- Rate limiting on URL creation
- Centralized error handling and response format
- Dockerized app + MongoDB

**Out of scope (note but don't build)**

- Real-time analytics dashboard (websockets)
- Geo-IP lookup (stub the field, don't integrate a paid service)
- Team/workspace sharing of links
- Password reset flow

Write these two lists into your README as "Scope" — this is what a tech lead expects before you touch a model file.

---

## 2. Non-functional requirements

| Concern               | Decision                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Redirect latency      | Must be O(1) lookup — unique index on `shortCode`, redirect route does no auth check                                            |
| Short code collisions | Generate with `nanoid(7)`, retry on duplicate-key error, escalate length after 5 failures                                       |
| Click logging         | Never blocks the redirect response — fire the write, respond first (`res.redirect` before awaiting the log insert, or queue it) |
| Rate limiting         | Anonymous/unauthenticated create: 10/hour/IP. Authenticated: 100/hour/user. Redirect endpoint: unlimited/very high ceiling      |
| Validation            | Every request body validated at the edge (route/middleware layer), never inside services                                        |
| Auth                  | Stateless JWT, access token only for MVP (skip refresh tokens, note it as a documented gap)                                     |
| Consistency           | Click count on `Url` is denormalized and eventually-consistent with the `ClickEvent` log — document this tradeoff explicitly    |

---

## 3. Architecture — layered, not fat controllers

This is the structure a backend team actually enforces in review, not a tutorial's `routes/index.js`:

```
src/
  config/
    env.ts              # validated env vars (zod), single source of truth
    db.ts                # mongoose connection, retry logic
  models/
    User.model.ts
    Url.model.ts
    ClickEvent.model.ts
  repositories/           # ONLY layer that touches Mongoose models directly
    user.repository.ts
    url.repository.ts
    clickEvent.repository.ts
  services/               # business logic, orchestration, no req/res knowledge
    auth.service.ts
    url.service.ts
    shortCode.service.ts
    analytics.service.ts
  controllers/             # req/res only, calls services, no business logic
    auth.controller.ts
    url.controller.ts
    redirect.controller.ts
    analytics.controller.ts
  routes/
    auth.routes.ts
    url.routes.ts
    analytics.routes.ts
    redirect.routes.ts
    index.ts
  middlewares/
    auth.middleware.ts
    error.middleware.ts
    rateLimiter.middleware.ts
    validate.middleware.ts
    notFound.middleware.ts
  validators/               # zod schemas, one per endpoint group
    auth.validator.ts
    url.validator.ts
  utils/
    ApiResponse.ts
    ApiError.ts
    asyncHandler.ts
    jwt.ts
    logger.ts
  types/
    express.d.ts            # augments Request with req.user
  app.ts                     # express app, middleware wiring, no listen()
  server.ts                  # imports app, connects DB, listens
tests/
  unit/
  integration/
postman/
  UrlShortener.postman_collection.json
  UrlShortener.postman_environment.json
docker-compose.yml
Dockerfile
.env.example
.dockerignore
```

**Rule enforced by this structure**: controllers never import a Mongoose model. Services never import `express`. Repositories are the only files that know Mongoose exists. This is the separation MAANG-style backend teams review PRs against — it's what makes the analytics service testable without spinning up Express.

---

## 4. Data models

### User

| Field                     | Type     | Notes                                |
| ------------------------- | -------- | ------------------------------------ |
| `_id`                     | ObjectId |                                      |
| `name`                    | String   | required                             |
| `email`                   | String   | required, unique index, lowercase    |
| `passwordHash`            | String   | required, never returned in `toJSON` |
| `createdAt` / `updatedAt` | Date     | timestamps: true                     |

### Url

| Field                     | Type                  | Notes                                                     |
| ------------------------- | --------------------- | --------------------------------------------------------- |
| `_id`                     | ObjectId              |                                                           |
| `originalUrl`             | String                | required, validated as URL                                |
| `shortCode`               | String                | required, **unique index**, 7-char nanoid or custom alias |
| `isCustomAlias`           | Boolean               | default false                                             |
| `owner`                   | ObjectId (ref `User`) | nullable — MVP allows anonymous shortening                |
| `clickCount`              | Number                | default 0, denormalized counter                           |
| `isActive`                | Boolean               | default true — soft "delete" toggles this                 |
| `expiresAt`               | Date                  | nullable                                                  |
| `createdAt` / `updatedAt` | Date                  | timestamps: true                                          |

Indexes: `{ shortCode: 1 }` unique, `{ owner: 1, createdAt: -1 }` for list queries.

### ClickEvent

| Field       | Type                 | Notes                                                                 |
| ----------- | -------------------- | --------------------------------------------------------------------- |
| `_id`       | ObjectId             |                                                                       |
| `url`       | ObjectId (ref `Url`) | required, indexed                                                     |
| `timestamp` | Date                 | default now                                                           |
| `referrer`  | String               | nullable, from `req.headers.referer`                                  |
| `userAgent` | String               | raw string from header                                                |
| `device`    | String enum          | `mobile` \| `desktop` \| `tablet` \| `unknown`, parsed from UA        |
| `browser`   | String               | parsed from UA                                                        |
| `ipHash`    | String               | store a hash of IP, not raw IP — privacy note to write in your README |
| `country`   | String               | nullable, out-of-scope stub for MVP                                   |

Indexes: `{ url: 1, timestamp: -1 }` compound — this is what the timeseries aggregation query hits.

**Design decision to document**: `clickCount` on `Url` is incremented via `$inc` at redirect time; `ClickEvent` is the source of truth for breakdowns. If they ever disagree, `ClickEvent` count wins — write this down, an interviewer or reviewer will ask.

---

## 5. API contract

Base path: `/api/v1`

Standard response envelope:

```
Success: { success: true, data: <payload>, meta?: {...} }
Error:   { success: false, error: { code: string, message: string, details?: any } }
```

### Auth

| Method | Path             | Auth     | Body                  | Notes                                   |
| ------ | ---------------- | -------- | --------------------- | --------------------------------------- |
| POST   | `/auth/register` | none     | name, email, password | 201, returns user (no password) + token |
| POST   | `/auth/login`    | none     | email, password       | 200, returns token                      |
| GET    | `/auth/me`       | required | —                     | 200, returns current user               |

### URLs

| Method | Path        | Auth     | Body/Query                            | Notes                                              |
| ------ | ----------- | -------- | ------------------------------------- | -------------------------------------------------- |
| POST   | `/urls`     | optional | originalUrl, customAlias?, expiresAt? | 201; rate-limited harder if unauthenticated        |
| GET    | `/urls`     | required | `?page=&limit=`                       | paginated list of caller's URLs                    |
| GET    | `/urls/:id` | required | —                                     | 403 if not owner, 404 if missing                   |
| PATCH  | `/urls/:id` | required | isActive?, expiresAt?                 | ownership check before update                      |
| DELETE | `/urls/:id` | required | —                                     | soft delete (`isActive: false`), not a hard delete |

### Redirect (public, separate from `/api/v1` — this is the whole point of a shortener)

| Method | Path          | Auth | Notes                                                                                  |
| ------ | ------------- | ---- | -------------------------------------------------------------------------------------- |
| GET    | `/:shortCode` | none | 302 to `originalUrl`; 404 if not found; 410 Gone if expired/inactive; logs click async |

### Analytics

| Method | Path                                      | Auth     | Notes                                                |
| ------ | ----------------------------------------- | -------- | ---------------------------------------------------- |
| GET    | `/urls/:id/analytics`                     | required | totals: clickCount, uniqueReferrers, deviceBreakdown |
| GET    | `/urls/:id/analytics/timeseries?range=7d` | required | daily click counts via aggregation pipeline          |

### Health

| Method | Path      | Notes                                                                 |
| ------ | --------- | --------------------------------------------------------------------- |
| GET    | `/health` | 200 + DB connection state — this is what your Docker healthcheck hits |

### Error codes to standardize (put these in `ApiError`)

`VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409, duplicate alias/email), `GONE` (410, expired link), `RATE_LIMITED` (429), `INTERNAL_ERROR` (500).

---

## 6. Middleware chain (order matters — this is a real review comment you'll get if it's wrong)

```
helmet → cors → morgan/logger → express.json() → rateLimiter (route-scoped)
  → routes → notFoundHandler → errorHandler (must be last, 4 args)
```

`errorHandler` catches everything thrown via `asyncHandler`-wrapped controllers and normalizes into the error envelope. No controller should have a raw `try/catch` — that's a code-smell in review.

---

## 7. Docker

`docker-compose.yml` services:

- `app`: builds from local Dockerfile, depends_on `mongo` with a healthcheck condition, env from `.env`
- `mongo`: official `mongo` image, named volume for persistence, exposed only internally (don't publish 27017 to host in the "prod-like" compose file — do it in a separate `docker-compose.override.yml` for local dev if you want Compass access)

Write two compose files: `docker-compose.yml` (base) and `docker-compose.dev.yml` (bind-mounts `src/`, exposes Mongo port, runs `ts-node-dev`). This dev/prod split is standard practice, not optional polish.

`.env.example` should list every var with a placeholder: `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV`, `BASE_URL` (used to build the full short link in API responses).

---

## 8. Postman verification plan

Build one collection, folders matching route groups (Auth / URLs / Redirect / Analytics / Health). This is the actual QA pass a backend engineer does before opening a PR:

**Collection-level setup**

- Environment with `baseUrl`, `authToken`, `urlId`, `shortCode` as variables
- Login request's **Tests** tab sets `pm.environment.set("authToken", ...)` from the response — every subsequent request uses `{{authToken}}` in the Authorization header automatically
- Create-URL request's Tests tab sets `pm.environment.set("urlId", ...)` and `shortCode` so analytics/redirect requests chain off it without manual copy-paste

**Per-request test assertions to write (Tests tab, not just "it returned 200")**

- Status code matches spec exactly (201 vs 200 — reviewers check this)
- Response body has `success: true/false` matching expectation
- Response schema shape (`pm.response.to.have.jsonSchema(...)` or manual key checks)
- For list endpoints: pagination meta fields present

**Negative/edge cases to cover as separate requests, not skipped**

- Register with an already-used email → 409
- Login with wrong password → 401
- Create URL with a malformed `originalUrl` → 400
- Create URL with a `customAlias` that collides → 409
- GET `/urls/:id` for a URL you don't own → 403
- GET `/urls/:id` for a non-existent id → 404
- GET `/:shortCode` for an expired link → 410
- GET `/:shortCode` for an unknown code → 404
- Hit `/urls` without a token → 401
- Exceed the rate limit on anonymous create → 429

**Run order**: use a Postman "Collection Runner" or Newman CLI run through the whole folder sequence once chained variables are wired — this is the artifact you'd actually attach to a PR description (`newman run collection.json -e env.json`) as proof the API works end to end.

---

## 9. Suggested build order (how you'd actually get assigned and ship this)

1. Project scaffold: `tsconfig`, `package.json`, folder structure, `.env.example`, Docker files, DB connection with retry — get `/health` returning 200 in Docker before writing any feature
2. `User` model + auth service/controller/routes + JWT middleware — test in Postman before moving on
3. `Url` model + short code service (with collision retry logic) + create/list/get/update/delete
4. Redirect route wired in, click count increment
5. `ClickEvent` model + async logging on redirect, UA parsing utility
6. Analytics service: aggregation pipelines for totals + timeseries + breakdowns
7. Rate limiting, centralized error handling, request validation on every route
8. Full Postman collection with chained variables and negative cases, exported and committed to the repo
9. README: architecture diagram (even ASCII), setup instructions, API table, documented tradeoffs (the ones flagged above)

Each numbered step above is a single PR in a real team. Don't build steps 3-6 in one branch — that's the difference between a review a senior engineer approves in 10 minutes and one that gets "please split this up."
