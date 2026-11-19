# PantryChef – Architecture Diagrams

Sprint 2 architecture deliverables of the Lead Software Architect (Ayşe Dural). Each diagram is kept
as an editable draw.io file; every page is also exported as PNG so it can be viewed on GitHub and
included in the submission ZIP without draw.io.

| Task | Diagram | Source | PNG |
|---|---|---|---|
| S2-12 | C4 System Context | [`c4/PantryChef_C4.drawio`](c4/PantryChef_C4.drawio), page 1 | [Context](c4/PantryChef_C4-1-context.png) |
| S2-13 | C4 Container | [`c4/PantryChef_C4.drawio`](c4/PantryChef_C4.drawio), page 2 | [Container](c4/PantryChef_C4-2-container.png) |
| S2-34 | C4 Component | [`c4/PantryChef_C4.drawio`](c4/PantryChef_C4.drawio), page 3 | [Component](c4/PantryChef_C4-3-component.png) |
| S2-14 | UML Use Case | [`uml/PantryChef_UML_SEQUENCE_STATE_CLASS.drawio`](uml/PantryChef_UML_SEQUENCE_STATE_CLASS.drawio), page 1 | [Use Case](uml/PantryChef_UML-1-use-case.png) |
| S2-14 | UML Sequence (order creation and start of preparation) | same file, page 2 | [Sequence](uml/PantryChef_UML-2-sequence.png) |
| S2-35 | UML State (order lifecycle) | same file, page 3 | [State](uml/PantryChef_UML-3-state.png) |
| S2-14 | UML Class (domain model) | same file, page 4 | [Class](uml/PantryChef_UML-4-class.png) |
| S2-15 | ER – core tables | [`database/PantryChef_ER.drawio`](database/PantryChef_ER.drawio), page 1 | [Core ER](database/PantryChef_ER-1-core-database-er.png) |
| S2-15 | ER – identity, history and reliability tables | same file, page 2 | [Support ER](database/PantryChef_ER-2-support-er.png) |
| S2-15 | Database constraints and transaction rules | same file, page 3 | [Constraints](database/PantryChef_ER-3-constraints-and-rules.png) |

All diagrams follow the API contract [`api/openapi.yaml`](../../api/openapi.yaml) (v0.2.0).

## Related documents

These documents are in separate pull requests and are added to this folder when they are merged:

| Task | Document | Pull request |
|---|---|---|
| S2-15 | `database-schema.md` – tables, DDL and transaction outlines | #66 |
| S2-16 | `architecture-decisions.md` – ADR-001 to ADR-011 | #64 |
| S2-17 | `consistency-review.md` – Architecture–SRS–OpenAPI review | #68 |
| S2-23 | `infrastructure-requirements.md` and the deployment view (Emre Boz) | #36 |

## Editing and exporting

- Open a `.drawio` file in [diagrams.net](https://app.diagrams.net) or the draw.io desktop app.
- The C4 and most UML pages were generated from Mermaid; *Arrange → Edit Diagram* on the group shows the
  Mermaid source. Change the source and the shapes together so they stay in sync.
- After a change, export each changed page again as PNG (*File → Export as → PNG*, 150 % zoom, white
  background) with the same file name, so the links in this README stay valid.
