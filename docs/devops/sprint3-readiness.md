# Sprint 3 CI/CD and Docker Readiness

**Sprint:** Sprint 2
**Task:** S2-27 ([Issue #35](https://github.com/seng321-7th-team/PantryChef/issues/35))
**Owner:** Emre Boz (DevOps and CI/CD)
**Reviewer:** Ayşe Dural
**Status:** Draft. Tool choices depend on the tech stack decision (ADR, S2-16).

## 1. Goal

In Sprint 3 the team delivers the first working MVP. On the DevOps side this means a GitHub Actions pipeline that builds and tests the code and blocks merges when unit test coverage is under 50%. Docker images, `docker-compose`, SonarQube and the technical debt report follow in the final stage. This document lists what we already have, what we will add and what can go wrong, so Sprint 3 can start without setup delays.

## 2. What we already have

| Item | Status |
|---|---|
| `main` and `develop` protected by rulesets: PR, 1 approval, no force push, no deletion | Active |
| Required check `OpenAPI lint` (Redocly) on every PR | Active |
| `Docs link check` on every PR (not required) | Added in Sprint 2 (S2-26) |
| `sprint-*` and `v*` tags protected | Active |
| Secret scanning and push protection | Enabled |
| `.gitignore` ignores `.env` files but keeps `.env.example` | Done |

## 3. Planned pipeline

| Job | Runs on | What it does | Required check |
|---|---|---|---|
| OpenAPI lint | Every PR | Already exists | Yes |
| Docs link check | Every PR | Already exists | No |
| Backend build and unit tests | Every PR | Compiles the backend and runs unit tests | Yes, after its first green run on `develop` |
| Coverage gate | Every PR | Fails if backend line coverage is under 50% | Yes, together with the job above |
| Frontend build and lint | Every PR | Builds the frontend and runs the linter | Yes, once the frontend exists |
| Integration tests | PRs to `develop` | Runs API tests against a PostgreSQL service container | Later in Sprint 3 |
| Docker image build | Tags | Builds the images that the demo runs | Final |
| SonarQube analysis | Every PR | Code smells, duplication, technical debt | Final |

New jobs become required only after they pass once on `develop`. Otherwise every open PR would be blocked by a job that cannot pass yet. The OpenAPI lint job worked the same way in Sprint 1: it skipped until `api/openapi.yaml` existed.

**Tools by stack.** The final choice follows the ADR. Possible options:

| If the backend is | Build and test | Coverage |
|---|---|---|
| Java (Spring Boot) | Maven or Gradle, JUnit 5 | JaCoCo |
| Node.js (Express or NestJS) | npm, Jest or Vitest | Built-in coverage (Istanbul / c8) |
| Python (FastAPI or Django) | pip, pytest | coverage.py |

## 4. Docker plan

| File | Purpose |
|---|---|
| `backend/Dockerfile` | Multi-stage build: build stage, then a small runtime image |
| `frontend/Dockerfile` | Builds the static files, then serves them with nginx, which also forwards `/v1` to the backend |
| `docker-compose.yml` | `web`, `api` and `db` (PostgreSQL) with a named volume and seed data |
| `.env.example` | Every variable the containers need, with dummy values |

The runtime parts, ports and infrastructure requirements are described in `docs/architecture/infrastructure-requirements.md` (S2-23).

## 5. Steps for Sprint 3

1. Agree on the folder layout with Ayşe and Tuğçe: `backend/` and `frontend/` at the repo root.
2. Add `.env.example` and a `docker-compose.yml` with only the database, so everyone can run PostgreSQL locally from day one.
3. Add the backend build and unit test job. Make it required after the first green run.
4. Add the coverage report and the 50% gate.
5. Add the frontend build and lint job.
6. Write the Dockerfiles and complete `docker-compose.yml` with seed data.
7. Test `docker compose up` on at least two team laptops.

## 6. Risks

| Risk | Effect | What we do |
|---|---|---|
| The tech stack is decided late | The pipeline cannot be written | ADR in Sprint 2 (S2-16); the table in section 3 already covers the likely stacks |
| A new required check is added before the code exists | All PRs are blocked | Make a job required only after its first green run on `develop` |
| Coverage stays under 50% near the deadline | The gate blocks merges at the last moment | Write tests together with each feature; Beyzanur follows coverage every week |
| Integration tests fail randomly because the database is not ready | Red CI without a real bug | Use a health check on the PostgreSQL service and keep unit tests separate |
| A secret is committed | Leaked password or JWT key | `.env` is ignored, CI uses GitHub Secrets, push protection is on |
| Docker behaves differently on team laptops (Windows line endings, Docker Desktop) | "Works on my machine" problems in the demo | `.gitattributes` already normalizes line endings; test on two laptops (step 7) |
| Reviews are slow | PRs wait for approval, as in the Sprint 1 release night | Two reviewers per PR, reviews within 24 hours |

## 7. Open decisions

| Decision | Owner |
|---|---|
| Backend and frontend stack | Ayşe (ADR, S2-16) |
| Does the 50% coverage gate count only the backend, or the frontend too? | Beyzanur, Emre |
| SonarQube: SonarCloud (free for public repos) or a local SonarQube container | Emre |
