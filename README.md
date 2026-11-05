# PantryChef

Restaurant inventory and order tracking system. BM 321 / SENG 321 Software Engineering project, Team 7.

PantryChef links customer orders to recipe-based ingredient reservations and stock usage, so waiters, chefs and the restaurant manager see the same order and inventory status.

## Team

| Member | Role |
|---|---|
| Burcu Ücük | Product Owner and Requirements Engineer |
| Bilgesu Nacak | Scrum Master and Agile Process Coach |
| Ayşe Dural | Lead Software Architect and Technical Lead |
| Beyzanur Alpay | Quality Assurance and Test Automation Engineer |
| Emre Boz | DevOps and CI/CD Infrastructure Engineer |
| Tuğçe Çevik | Implementation and Integration Engineer |

## Sprint 1 deliverables

| Deliverable | Owner | Location |
|---|---|---|
| Project proposal and license decision | Burcu Ücük | `docs/project-proposal.md` |
| System vision and boundary | Tuğçe Çevik | `docs/system-vision.md` |
| System context and order state diagrams | Tuğçe Çevik | `docs/diagrams/` |
| OpenAPI draft | Ayşe Dural | `api/openapi.yaml` |
| Team roles and RACI matrix | Bilgesu Nacak | `docs/team-roles-raci.md` |
| Meeting notes and decision log | Bilgesu Nacak | `docs/sprint1-meeting-notes.md` |
| Sprint 1 task board | Bilgesu Nacak | `docs/sprint1-task-board.md` |
| Repository workflow (Git-Flow) | Emre Boz | `docs/git-workflow.md` |
| Initial product backlog | Beyzanur Alpay (R), Burcu Ücük (A) | `docs/product-backlog.md` |
| Initial test cases | Beyzanur Alpay | `docs/test-cases.md` |

Each deliverable is added through its own issue and pull request.

## Repository layout

```text
api/              OpenAPI contract (api/openapi.yaml)
docs/             Project documents
docs/diagrams/    System context and order state diagrams
.github/          Issue and pull request templates, CI workflows
```

## How to contribute

1. Start from an issue. Use one of the issue templates.
2. Branch from `develop`: `feature/<issue-number>-<short-name>`.
3. Open a pull request into `develop`, link the issue with `Closes #<number>`, and request a teammate's review.
4. Merge after one approval and passing checks. Direct pushes to `main` and `develop` are blocked.

The full rules are in [`docs/git-workflow.md`](docs/git-workflow.md).

## License

Not decided yet (S1-03, part of the project proposal). The LICENSE file will be added after the decision.
