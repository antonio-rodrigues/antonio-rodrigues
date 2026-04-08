# Copilot Instructions — Anti-Fraude SMS Server (afsms-api)

## Project Summary

Crowdsourced fraud-SMS detection API for Portugal. Express 4 + PostgreSQL + Redis. CommonJS modules, esbuild bundling, Node.js built-in test runner. All services use constructor-based Dependency Injection — no singletons, no global state.

---

### Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```txt
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

---

## Language & Runtime

- **Node.js >= 20**, target `node24` for production builds.
- **CommonJS** (`require`/`module.exports`) throughout. Not ESM.
- **No TypeScript.** Plain JavaScript only.

### DO

- Use `require()` and `module.exports` for all imports/exports.
- Use `async/await` for all asynchronous operations.
- Use `node:` prefix for built-in modules in new code (`node:crypto`, `node:assert`).
- Use `const` by default. Use `let` only when reassignment is necessary.
- Use strict equality (`===` / `!==`) everywhere.
- Use template literals for string interpolation.
- Use destructuring for function parameters and object access.
- Use `Promise.all()` to parallelise independent async operations.

### DON'T

- Don't use `.then()` / `.catch()` chains — use `async/await`.
- Don't use `var`.
- Don't use loose equality (`==` / `!=`).
- Don't use string concatenation with `+` for building strings with variables.
- Don't use `import`/`export` (ESM syntax). The bundler expects CommonJS.
- Don't use TypeScript, JSDoc `@typedef`, or `.d.ts` files.

---

## Architecture & Dependency Injection

Every service receives its dependencies through the constructor. All wiring happens inside `createRouter()` in `src/routes/index.js`. No service ever imports `src/index.js`.

### DO

- Accept all external dependencies (Redis, pgPool, other services) via constructor object destructuring.
- Instantiate services exclusively inside `createRouter()`.
- Pass configuration values (thresholds, TTLs) as constructor parameters, not `process.env` reads inside services.
- Keep services stateless — store state in Redis or PostgreSQL, not in-memory.
- Use `BackgroundTaskRunner.run(name, fn)` for non-blocking post-response work (trust score distribution, phishing URL extraction).

### DON'T

- Don't `require('src/index.js')` or any bootstrap file from a service or utility.
- Don't access `process.env` inside services — read env vars in `src/index.js` and pass them through.
- Don't create singleton modules with module-level mutable state.
- Don't call `new Service()` outside of `createRouter()` (except in tests).
- Don't use global variables or module-scope caches that bypass Redis.

---

## Express & HTTP

### DO

- Define routes inside the `createRouter()` factory function.
- Apply middleware in this order: rate limiter → HMAC verification → route handler.
- Return early on validation failure: `if (error) return res.status(400).json({ error })`.
- Always return `application/json`. Error shape: `{ "error": "<message>" }`.
- Use `res.status(code).json(...)` explicitly — never rely on default status codes.
- Use parameterised queries for all database access — never interpolate user input into SQL.

### DON'T

- Don't use `app.use()` to register routes — use `router.get()` / `router.post()` inside the factory.
- Don't use `res.send()` for JSON responses — use `res.json()`.
- Don't throw unhandled errors from route handlers — wrap in try/catch and return 500.
- Don't add new middleware globally in `src/index.js` unless it applies to every request (like `helmet`, `express.json`).
- Don't return HTML or plain-text responses from API endpoints.

---

## PostgreSQL (node-postgres / `pg`)

### DO

- Use the shared `pgPool` (connection pool) for queries. Never create a new `Pool` instance.
- Use parameterised queries with `$1, $2, ...` placeholders: `pgPool.query('SELECT * FROM users WHERE id = $1', [userId])`.
- Use `ON CONFLICT DO NOTHING` or `ON CONFLICT ... DO UPDATE` for upserts.
- Use `pgPool.connect()` + `client.query('BEGIN')` / `COMMIT` / `ROLLBACK` for multi-statement transactions (see `TrustScoreService`).
- Always `client.release()` in a `finally` block after using `pgPool.connect()`.
- Use `parseInt(row.count, 10)` when reading `COUNT(*)` results (PostgreSQL returns strings for bigint).

### DON'T

- Don't use an ORM (Sequelize, Prisma, Knex, etc.). Raw SQL with parameterised queries only.
- Don't build SQL strings with template literals or concatenation — always use `$1` placeholders.
- Don't hold a client from `pgPool.connect()` longer than necessary — release it as soon as the transaction or query completes.
- Don't use `SELECT *` in production queries — select only the columns you need.
- Don't create new tables without adding them to `db-init/init.sql`.

---

## Redis (ioredis)

### DO

- Use the shared `redis` client passed via DI. Never create a new `Redis` instance in services.
- Set TTLs on volatile keys: `redis.set(key, value, 'EX', ttlSeconds)`.
- Use `INCR` for atomic counters, `SADD`/`SREM` for sets, `SSCAN` for iterating large sets.
- Invalidate `cache:bloom_filter` whenever consensus changes the active threat set.
- Use `Promise.all()` when issuing multiple independent Redis commands.

### DON'T

- Don't use `SMEMBERS` on potentially large sets — use `SSCAN` to avoid blocking Redis.
- Don't store complex objects directly — serialise with `JSON.stringify()` and parse with `JSON.parse()`.
- Don't forget to set `EXPIRE` on new counter keys (vote counters use `TTL_SECONDS * 2`).
- Don't use Redis as primary storage for data that must survive restarts — PostgreSQL is the source of truth.
- Don't use `KEYS` command in production code — it blocks the server on large keyspaces.

---

## Security

### DO

- Use `crypto.timingSafeEqual()` for all signature/token comparisons to prevent timing attacks.
- Validate and sanitise all user input at the route level before passing to services.
- Use HMAC-SHA256 for request authentication: `JSON.stringify(body) + ":" + timestamp`.
- Support key rotation via the `APP_SECRET_KEYS` array — iterate all secrets.
- Use `helmet()` middleware for HTTP security headers.
- Use `express-rate-limit` with `rate-limit-redis` store for per-route rate limiting.

### DON'T

- Don't use `===` for comparing HMAC signatures — use `crypto.timingSafeEqual()`.
- Don't log secrets, HMAC signatures, or full request bodies to console.
- Don't trust `req.params` or `req.body` without validation — always validate with dedicated validation functions.
- Don't disable rate limiting for any public endpoint.
- Don't store plaintext secrets in code — use environment variables loaded in `src/index.js`.
- Don't use `eval()`, `Function()`, or dynamic `require()` with user input.

---

## Testing

Uses Node.js built-in test runner (`node:test`) + `assert` from `node:assert/strict` + `supertest` for HTTP integration tests. No Jest, Mocha, Chai, or Sinon.

### DO

- Place test files in `src/tests/` named `*.test.js`.
- Use `const { test, describe, beforeEach } = require('node:test')` and `const assert = require('node:assert/strict')`.
- Test services by constructing them with mock objects passed via constructor injection.
- Create inline mock objects with only the methods your test needs (e.g., `{ query: async () => ({rows: [], rowCount: 1}) }`).
- Use `supertest` for endpoint integration tests — pass `createRouter(mockDeps)` directly.
- Bypass rate limiters and HMAC in integration tests by injecting passthrough middleware: `(req, res, next) => next()`.
- Test both success and failure paths — especially duplicate vote conflicts (409), validation errors (400), and consensus thresholds.
- Run tests with `npm test` or `node --test src/tests/*.test.js`.

### DON'T

- Don't use Jest, Mocha, Chai, Sinon, or any third-party test framework.
- Don't use `jest.mock()`, `jest.fn()`, or any auto-mocking system.
- Don't mock at the module level — inject mock objects through constructors.
- Don't depend on real database or Redis connections in tests — always use mocks.
- Don't use `setTimeout` or real timers in tests — mock time-dependent behaviour.
- Don't put test files outside `src/tests/`.

---

## Error Handling

### DO

- Wrap route handlers in `try/catch` blocks and return `res.status(500).json({ error: "Erro interno." })` on unexpected errors.
- Log errors with `console.error()` including context (endpoint name, relevant IDs).
- Use `BackgroundTaskRunner` for fire-and-forget operations that must not crash the process on failure.
- Use retry logic (like `Logger.logOperation`) only for idempotent, non-critical writes.

### DON'T

- Don't swallow errors silently — always log them.
- Don't let unhandled promise rejections propagate — catch them at the boundary.
- Don't use `process.exit()` in error handlers — let the process manager (Docker, pm2) handle restarts.
- Don't retry non-idempotent operations.

---

## Code Style & Formatting

Enforced by ESLint + Prettier via `lint-staged` on pre-commit (husky).

### DO

- Run `npm run lint` and `npm run format` before committing.
- Use Prettier defaults (the project config extends `eslint-config-prettier`).
- Prefix unused function parameters with `_` (e.g., `(_req, res) => ...`).
- Use descriptive variable names — `smsHash`, `voteType`, `activeThreats` not `h`, `v`, `at`.
- Write comments in Portuguese for user-facing messages and inline code comments. Use English for JSDoc, function names, and variable names.

### DON'T

- Don't disable ESLint rules with `eslint-disable` comments unless absolutely necessary.
- Don't use semicolons inconsistently — let Prettier handle it (project uses semicolons).
- Don't mix tabs and spaces — Prettier handles indentation.
- Don't add trailing commas manually — Prettier applies the `all` trailing comma style.

---

## Project Structure

```
src/
├── index.js              # Bootstrap: DB connections, middlewares, env vars, graceful shutdown
├── routes/index.js       # createRouter(deps) — wires DI and defines all endpoints
├── services/             # Business logic classes (constructor DI)
├── utils/                # Stateless utilities and helpers
└── tests/                # All test files (*.test.js)
```

### DO

- Add new business logic as a service class in `src/services/`.
- Add new stateless helpers in `src/utils/`.
- Wire new services into `createRouter()` in `src/routes/index.js`.
- Add new SQL tables/indexes to `db-init/init.sql`.

### DON'T

- Don't create nested route files or sub-routers — all routes go in `src/routes/index.js`.
- Don't add new entry points — `src/index.js` is the only one.
- Don't create `src/config.js` or `src/constants.js` — config flows through DI from `src/index.js`.
- Don't edit files in `dist/` — it's auto-generated by `npm run build`.
- Don't add new dependencies without strong justification — prefer Node.js built-in modules.

---

## Consensus Logic (Critical)

These invariants must never be broken:

- UNSAFE consensus triggers at **exact equality** (`count === THRESHOLD_UNSAFE`), not `>=`.
- SAFE consensus triggers at **`count >= THRESHOLD_SAFE`**.
- Every consensus event **must** `DEL cache:bloom_filter` to invalidate the Bloom Filter cache.
- Trust score rewards are dispatched via `bgTaskRunner.run()` — never synchronously in the request path.
- `user_votes.reward_processed` prevents double-rewarding — always check and set it within a transaction.

---

## Docker & Build

### DO

- Use `docker compose up --build` for full local stack.
- Use multi-stage Dockerfile: build stage installs all deps and bundles, production stage runs only the bundle.
- Keep `esbuild` as the sole bundler — target `node24`, output to `dist/`.
- Use Alpine-based Node.js images for minimal size.

### DON'T

- Don't install `devDependencies` in the production Docker image.
- Don't add application code outside `src/` (except `db-init/` for schema/seeds).
- Don't expose internal ports directly — map through docker-compose.

---

## Automation Rules

### 1. Red/Green TDD

- **Trigger:** Whenever I ask you to `Use red/green TDD` in a prompt.
- **Action:** You MUST:
  - Use test driven development: write the tests first, confirm that the tests fail before you implement the change that gets them to pass.

### 2. Documentation Updates

- **Trigger:** Whenever I ask you to `Sync docs` or `Update docs` in a prompt.
- **Action:** You MUST:
  - Automatically update the related documentation under `.planning/codebase/` and `docs/ARCHITECTURE.md` to reflect the current session commit changes.

<!-- GSD Configuration — managed by get-shit-done installer -->

# Instructions for GSD

- Use the get-shit-done skill when the user asks for GSD or uses a `gsd-*` command.
- Treat `/gsd-...` or `gsd-...` as command invocations and load the matching file from `.github/skills/gsd-*`.
- When a command says to spawn a subagent, prefer a matching custom agent from `.github/agents`.
- Do not apply GSD workflows unless the user explicitly asks for them.
- After completing any `gsd-*` command (or any deliverable it triggers: feature, bug fix, tests, docs, etc.), ALWAYS: (1) offer the user the next step by prompting via `ask_user`; repeat this feedback loop until the user explicitly indicates they are done.
<!-- /GSD Configuration -->
