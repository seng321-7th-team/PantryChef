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
| Project proposal and license decision | Burcu Ücük | `docs/project-proposal.md`, `LICENSE` |
| System vision and boundary, with context and order state diagrams | Burcu Ücük | `docs/system-vision.md` |
| Initial product backlog | Burcu Ücük | `docs/product-backlog.md` |
| OpenAPI draft | Ayşe Dural | `api/openapi.yaml` |
| Team roles and RACI matrix | Bilgesu Nacak | `docs/team-roles-raci.md` |
| Meeting notes and decision log | Bilgesu Nacak | `docs/sprint1-meeting-notes.md` |
| Sprint 1 task board | Bilgesu Nacak | `docs/sprint1-task-board.md` |
| Repository workflow (Git-Flow) | Bilgesu Nacak, Emre Boz | `docs/git-workflow.md` |
| Repository setup, branch protection and CI | Emre Boz | `.github/`, repo rulesets |
| Individual contributions | All members | `CONTRIBUTIONS.md` |

Beyzanur Alpay (QA) and Tuğçe Çevik (implementation and integration) review the Sprint 1 documents. Test cases are planned for Sprint 2.

Each deliverable is added through its own issue and pull request.

## Repository layout

```text
api/              OpenAPI contract (api/openapi.yaml)
docs/             Project documents
docs/diagrams/    Diagram files (Sprint 1 diagrams are in docs/system-vision.md)
.github/          Issue and pull request templates, CI workflows
```

## How to contribute

1. Start from an issue. Use one of the issue templates.
2. Branch from `develop`: `feature/<issue-number>-<short-name>`.
3. Open a pull request into `develop`, link the issue with `Closes #<number>`, and request a teammate's review.
4. Merge after one approval and passing checks. Direct pushes to `main` and `develop` are blocked.

The full rules are in [`docs/git-workflow.md`](docs/git-workflow.md).

## License

MIT, see [LICENSE](LICENSE). The choice is explained in the project proposal (S1-03).
