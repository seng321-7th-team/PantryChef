# Sprint 3 CI/CD and Docker Readiness

**Sprint:** Sprint 2
**Task:** S2-27 ([Issue #35](https://github.com/seng321-7th-team/PantryChef/issues/35))
**Owner:** Emre Boz (DevOps and CI/CD)
**Reviewer:** Ayşe Dural
**Status:** Ready for review. The stack and deployment follow the architecture decisions (S2-16, `docs/architecture/architecture-decisions.md`, PR #64): React, NestJS (TypeScript) and PostgreSQL (ADR-001), Docker Compose with versions pinned in Sprint 3 (ADR-011).

## 1. Goal

In Sprint 3 the team delivers the first working MVP. On the DevOps side this means a GitHub Actions pipeline that builds and tests the code and blocks merges when unit test coverage is under 50%. Docker images, `docker-compose`, SonarQube and the technical debt report follow in the final stage. This document lists what we already have, what we will add and what can go wrong, so Sprint 3 can start without setup delays.

## 2. What we already have

| Item | Status |
|---|---|
| `main` and `develop` protected by rulesets: PR, 1 approval, no force push, no deletion | Active |
| Required check `OpenAPI lint` (Redocly) on every PR | Active |
| Required check `Frontend build and test` (lint, unit tests, build) on every PR | Active since S3-28 (job added in PR #121) |
| `Docs link check` on every PR (not required) | Added by S2-26 (PR #32) |
| `sprint-*` and `v*` tags protected | Active |
| Secret scanning and push protection | Enabled |
| `.gitignore` ignores `.env` files but keeps `.env.example` | Done |

## 3. Planned pipeline

| Job | Runs on | What it does | Required check |
|---|---|---|---|
| OpenAPI lint | Every PR | Already exists | Yes |
| Docs link check | Every PR | Already exists | No |
| Backend build and unit tests | Every PR | `npm ci`, `npm run build` and Jest unit tests in `backend/` | Yes, after its first green run on `develop` |
| Coverage gate | Every PR | Jest `--coverage`; fails if backend line coverage is under 50% | Yes, together with the job above |
| Frontend build and test | Every PR | `npm ci`, ESLint, Vitest unit tests and `npm run build` in `frontend/` | Yes (S3-26 PR #121, required in S3-28) |
| Integration tests | PRs to `develop` | Runs API tests against a real PostgreSQL service container | Later in Sprint 3 |
| Docker image build | Tags | Builds the images that the demo runs | Final |
| SonarQube analysis | Every PR | Code smells, duplication, technical debt | Final |

New jobs become required only after they pass once on `develop`. Otherwise every open PR would be blocked by a job that cannot pass yet. The OpenAPI lint job worked the same way in Sprint 1: it skipped until `api/openapi.yaml` existed.

**Tools.** Both sides are TypeScript on Node.js (ADR-001), so CI uses one toolchain:

| Part | Build and test | Coverage | Lint |
|---|---|---|---|
| Backend (NestJS) | npm, Jest (the NestJS default test runner) | Jest coverage with `coverageThreshold` set to 50% lines | ESLint |
| Frontend (React) | npm | Not in the gate for now (see section 7) | ESLint |

The coverage gate is the `coverageThreshold` setting in the backend Jest config, so `npm test` fails by itself when coverage drops. CI does not need a separate script for it.

**Why integration tests need a real database.** Order creation and "start preparation" use row locks and `CHECK` constraints (ADR-004). Mocks or an in-memory database cannot show that two parallel orders for the last portion behave correctly. These tests run against the same PostgreSQL major version as `docker-compose.yml`.

## 4. Docker plan

| File | Purpose |
|---|---|
| `backend/Dockerfile` | Multi-stage build: `npm ci` and `npm run build`, then a small Node.js runtime image with production dependencies only, running as a non-root user |
| `frontend/Dockerfile` | Builds the React app to static files, then serves them with nginx, which also forwards `/v1` to the backend |
| `docker-compose.yml` | `web`, `api` and `db` (PostgreSQL) with a named volume and seed data, the same three containers as ADR-011 |
| `.env.example` | Every variable the containers need, with dummy values |

Two backend jobs run inside the `api` container, so no extra container is needed:

- Database migrations run when the `api` container starts, before its health check reports ready. The migration tool comes with the ORM choice in the Sprint 3 skeleton (ADR-001).
- The cleanup of idempotency records older than 24 hours (ADR-005) runs as a scheduled task in the backend.

The runtime parts, ports and infrastructure requirements are described in `docs/architecture/infrastructure-requirements.md` (S2-23).

## 5. Versions

ADR-011 pins the versions once, in the Sprint 3 project skeleton. They are recorded here when that PR is merged.

| What | Rule (ADR-011) | Pinned in | Version |
|---|---|---|---|
| Node.js | Active LTS at the start of Sprint 3 | `.nvmrc`, read by CI (`actions/setup-node`) and used as the base image tag in both Dockerfiles | Sprint 3 |
| PostgreSQL | A major version still supported by the PostgreSQL project | `docker-compose.yml` and the CI service container | Sprint 3 |
| npm packages | Exact versions from the lock file | `package-lock.json` in `backend/` and `frontend/`, installed with `npm ci` | Sprint 3 |

Keeping the Node.js version in one file means CI and Docker cannot drift apart.

## 6. Steps for Sprint 3

1. Agree on the folder layout with Ayşe and Tuğçe: `backend/` and `frontend/` at the repo root.
2. Add `.nvmrc`, `.env.example` and a `docker-compose.yml` with only the database, so everyone can run PostgreSQL locally from day one. Fill in section 5.
3. Add the backend build and unit test job. Make it required after the first green run.
4. Add the coverage threshold and the 50% gate.
5. Add the frontend build and lint job.
6. Add the integration test job with a PostgreSQL service container.
7. Write the Dockerfiles and complete `docker-compose.yml` with seed data.
8. Test `docker compose up` on at least two team laptops.

## 7. Risks

| Risk | Effect | What we do |
|---|---|---|
| Versions or the ORM are picked late in Sprint 3 | The pipeline and Dockerfiles wait for them | Pin them in the first skeleton PR (step 2); section 5 already lists where each version goes |
| A new required check is added before the code exists | All PRs are blocked | Make a job required only after its first green run on `develop` |
| Coverage stays under 50% near the deadline | The gate blocks merges at the last moment | Write tests together with each feature; Beyzanur follows coverage every week |
| Locking logic passes unit tests but fails on a real database | Stock errors show up only in the demo | Integration tests on a PostgreSQL service container (section 3) |
| Integration tests fail randomly because the database is not ready | Red CI without a real bug | Use a health check on the PostgreSQL service and keep unit tests separate |
| A secret is committed | Leaked password or JWT key | `.env` is ignored, CI uses GitHub Secrets, push protection is on |
| Docker behaves differently on team laptops (Windows line endings, Docker Desktop) | "Works on my machine" problems in the demo | `.gitattributes` already normalizes line endings; test on two laptops (step 8) |
| Reviews are slow | PRs wait for approval, as in the Sprint 1 release night | The rule stays at 1 approval, but we request at least two reviewers on each PR so one absent person does not block it. Reviews within 24 hours. |

## 8. Open decisions

| Decision | Owner |
|---|---|
| ORM and migration tool | Ayşe, in the Sprint 3 skeleton |
| Does the 50% coverage gate count only the backend, or the frontend too? | Beyzanur, Emre |
| SonarQube: SonarCloud (free for public repos) or a local SonarQube container | Emre |
