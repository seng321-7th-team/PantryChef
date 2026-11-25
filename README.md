# PantryChef

Restaurant inventory and order tracking system. BM 321 / SENG 321 Software Engineering project, Team 7.

PantryChef links customer orders to recipe-based ingredient reservations and stock usage, so waiters, chefs and the restaurant manager see the same order and inventory status.

## Team

| Member | GitHub | Role |
|---|---|---|
| Burcu Ücük | [@burcucuk5](https://github.com/burcucuk5) | Product Owner and Requirements Engineer |
| Bilgesu Nacak | [@BilgesuNacak](https://github.com/BilgesuNacak) | Scrum Master and Agile Process Coach |
| Ayşe Dural | [@ayseddurall](https://github.com/ayseddurall) | Lead Software Architect and Technical Lead |
| Beyzanur Alpay | [@beyzanuralpayy](https://github.com/beyzanuralpayy) | Quality Assurance and Test Automation Engineer |
| Emre Boz | [@emrboz](https://github.com/emrboz) | DevOps and CI/CD Infrastructure Engineer |
| Tuğçe Çevik | [@tucevik](https://github.com/tucevik) | Implementation and Integration Engineer |

Individual contributions are listed in [`CONTRIBUTIONS.md`](CONTRIBUTIONS.md).

## Sprint 1 deliverables

| Deliverable | Owner | Location |
|---|---|---|
| Project proposal and license decision | Burcu Ücük | [`docs/project-proposal.md`](docs/project-proposal.md), [`LICENSE`](LICENSE) |
| System vision and boundary, with context and order state diagrams | Burcu Ücük | [`docs/system-vision.md`](docs/system-vision.md) |
| Initial product backlog | Burcu Ücük | [`docs/product-backlog.md`](docs/product-backlog.md) |
| OpenAPI draft | Ayşe Dural | [`api/openapi.yaml`](api/openapi.yaml) |
| Team roles and RACI matrix | Bilgesu Nacak | [`docs/team-roles-raci.md`](docs/team-roles-raci.md) |
| Meeting notes and decision log | Bilgesu Nacak | [`docs/sprint1-meeting-notes.md`](docs/sprint1-meeting-notes.md) |
| Sprint 1 task board | Bilgesu Nacak | [`docs/sprint1-task-board.md`](docs/sprint1-task-board.md) |
| Repository workflow (Git-Flow) | Bilgesu Nacak, Emre Boz | [`docs/git-workflow.md`](docs/git-workflow.md) |
| Repository setup, branch protection and CI | Emre Boz | `.github/`, repo rulesets |
| Individual contributions | All members | [`CONTRIBUTIONS.md`](CONTRIBUTIONS.md) |

Beyzanur Alpay (QA) and Tuğçe Çevik (implementation and integration) review the Sprint 1 documents. Test cases are planned for Sprint 2.

Each deliverable is added through its own issue and pull request.

## Sprint 2 deliverables

Sprint 2 covers the requirements and the architecture. The table below links to the Sprint 2 deliverables.

| Deliverable | Owner | Location |
|---|---|---|
| Software requirements specification (SRS) | Burcu Ücük | [`docs/srs.md`](docs/srs.md) |
| Refined product backlog, user stories and acceptance criteria | Burcu Ücük | [`docs/product-backlog.md`](docs/product-backlog.md) |
| Functional and non-functional requirements | Burcu Ücük | [`docs/non-functional-requirements.md`](docs/non-functional-requirements.md) |
| Test plan and test cases | Beyzanur Alpay | [`test-plan.md`](docs/testing/test-plan.md), [`test-cases.md`](docs/testing/test-cases.md) |
| Quality metrics and traceability matrix | Beyzanur Alpay | [`quality-metrics.md`](docs/testing/quality-metrics.md), [`traceability-matrix.md`](docs/testing/traceability-matrix.md) |
| Figma prototype links, screen exports and demo scenario | Tuğçe Çevik | [`figma-links.md`](docs/ui-ux/figma-links.md), [`ui-prototype.md`](docs/ui-ux/ui-prototype.md), [`demo-scenario.md`](docs/ui-ux/demo-scenario.md) |
| User-flow diagrams | Tuğçe Çevik | [`docs/ui-ux/user-flows.md`](docs/ui-ux/user-flows.md) |
| UI design and user story consistency review | Tuğçe Çevik | [`docs/ui-ux/ui-user-story-review.md`](docs/ui-ux/ui-user-story-review.md) |
| Frontend UI skeleton (React + TypeScript, mock data, stretch goal) | Tuğçe Çevik | [`frontend/README.md`](frontend/README.md) |
| C4 (context, container, component), UML (use case, sequence, state, class) and ER diagrams | Ayşe Dural | [`docs/architecture/README.md`](docs/architecture/README.md) |
| Database schema | Ayşe Dural | [`docs/architecture/database-schema.md`](docs/architecture/database-schema.md) |
| Architecture decision records (ADR-001 to ADR-011) | Ayşe Dural | [`docs/architecture/architecture-decisions.md`](docs/architecture/architecture-decisions.md) |
| Architecture, SRS and OpenAPI consistency review | Ayşe Dural | [`docs/architecture/consistency-review.md`](docs/architecture/consistency-review.md) |
| OpenAPI contract v0.2.1 | Ayşe Dural | [`api/openapi.yaml`](api/openapi.yaml) |
| Infrastructure and deployment requirements, deployment view | Emre Boz | [`infrastructure-requirements.md`](docs/architecture/infrastructure-requirements.md), [`deployment-view.png`](docs/architecture/deployment-view.png) |
| Sprint 3 CI/CD and Docker readiness | Emre Boz | [`docs/devops/sprint3-readiness.md`](docs/devops/sprint3-readiness.md) |
| Repository setup for Sprint 2 and docs link check | Emre Boz | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) |
| Task board, RACI and meeting notes | Bilgesu Nacak | [`sprint2-task-board.md`](docs/sprint2-task-board.md), [`sprint2-raci.md`](docs/sprint2-raci.md), [`sprint2-meeting-notes.md`](docs/sprint2-meeting-notes.md) |
| Progress and impediment tracking | Bilgesu Nacak | [`docs/sprint2-progress-impediments.md`](docs/sprint2-progress-impediments.md) |
| Deliverables consistency review and retrospective agenda | Bilgesu Nacak | [`sprint2-deliverables-consistency-review.md`](docs/sprint2-deliverables-consistency-review.md), [`sprint2-review-retrospective-agenda.md`](docs/sprint2-review-retrospective-agenda.md) |
| Submission package | Bilgesu Nacak | [`docs/sprint2-submission.md`](docs/sprint2-submission.md) |

## Repository layout

```text
api/                OpenAPI contract (api/openapi.yaml)
docs/               Project documents
docs/diagrams/      Diagram files (Sprint 1 diagrams are in docs/system-vision.md)
docs/architecture/  C4, UML, database schema, ADRs and infrastructure requirements (Sprint 2)
docs/testing/       Test plan, test cases and quality metrics (Sprint 2)
docs/ui-ux/         Figma links, user flows and screen exports (Sprint 2)
docs/devops/        DevOps notes, e.g. Sprint 3 CI/CD and Docker readiness
frontend/           React + TypeScript UI skeleton (Sprint 2, see frontend/README.md)
.github/            Issue and pull request templates, CI workflows
docker-compose.yml  Local PostgreSQL for development (Sprint 3)
.env.example        Environment variables with dummy values, copy to .env
```

## Local development

The full steps to run the MVP come later in Sprint 3 (S3-29). For now the repo has a local PostgreSQL database:

1. Install Docker Desktop.
2. Copy `.env.example` to `.env` and set your own `POSTGRES_PASSWORD` (also in `DATABASE_URL`).
3. Start the database: `docker compose up -d db`
4. Check that it is healthy: `docker compose ps`
5. Stop it with `docker compose down`. The data stays in the `pgdata` volume. `docker compose down -v` deletes it.

The frontend runs on its own, see [`frontend/README.md`](frontend/README.md).

## How to contribute

1. Start from an issue. Use one of the issue templates.
2. Branch from `develop`: `feature/<issue-number>-<short-name>`.
3. Open a pull request into `develop` and request a teammate's review. Use `Closes #<number>` when the PR completes the issue, and `Refs #<number>` when the issue stays open.
4. Merge after one approval and passing checks. Direct pushes to `main` and `develop` are blocked.

The full rules are in [`docs/git-workflow.md`](docs/git-workflow.md).

## License

MIT, see [LICENSE](LICENSE). The choice is explained in the project proposal (S1-03).
