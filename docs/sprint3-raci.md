# PantryChef — Sprint 3 RACI Matrix

**Sprint:** Sprint 3 — MVP & CI/CD
**Deadline:** 14 December 2026, 23:59 (Türkiye time)
**Document owner:** Bilgesu Nacak
**Related issue:** [S3-08 — #126](https://github.com/seng321-7th-team/PantryChef/issues/126)
**Reference:** [General team RACI](team-roles-raci.md) · [Sprint 3 project view](https://github.com/orgs/seng321-7th-team/projects/4/views/3)

## Team roles

| Code | Team member | Sprint role |
| --- | --- | --- |
| BU | Burcu Ücük | Product Owner & Requirements Engineer |
| BN | Bilgesu Nacak | Scrum Master & Agile Process Coach |
| AD | Ayşe Dural | Lead Software Architect & Technical Lead |
| BA | Beyzanur Alpay | QA & Test Automation Engineer |
| EB | Emre Boz | DevOps & CI/CD Infrastructure Engineer |
| TC | Tuğçe Çevik | Implementation & Integration Engineer |

## Task responsibilities

The Sprint 3 v2.4 task owner is both responsible and accountable (R/A). The listed reviewer is consulted (C). Other team members are informed (I) through the project board and sprint updates.

| Task | Deliverable | R/A | C · Reviewer | I |
| --- | --- | --- | --- | --- |
| S3-01 | MVP Scope & Out-of-Scope Definition | BU | BN | AD, BA, EB, TC |
| S3-02 | Refined Product Backlog, User Stories & Acceptance Criteria | BU | BA | BN, AD, EB, TC |
| S3-03 | Functional & Non-functional Requirements | BU | AD | BN, BA, EB, TC |
| S3-04 | Figma–User Story Consistency Review | BU | BN | AD, BA, EB, TC |
| S3-05 | Manager Form Validation | BU | TC | BN, AD, BA, EB |
| S3-06 | MVP Acceptance Review | BU | BA | BN, AD, EB, TC |
| S3-07 | Sprint 3 Task Board oluşturma ve yönetme | BN | BU | AD, BA, EB, TC |
| S3-08 | Sprint 3 RACI Matrix | BN | TC | BU, AD, BA, EB |
| S3-09 | Sprint Planning, Stand-up, Review, Retrospective kayıtları | BN | TC | BU, AD, BA, EB |
| S3-10 | GitHub Issues, PR Tracking & Impediment Log | BN | EB | BU, AD, BA, TC |
| S3-11 | MVP Seed Data & Demo Scenario | BN | TC | BU, AD, BA, EB |
| S3-12 | Sprint 3 Deliverables Consistency Review | BN | BA | BU, AD, EB, TC |
| S3-13 | Sprint 3 Submission Package & Teams Upload | BN | BU | AD, BA, EB, TC |
| S3-14 | Architecture–SRS–OpenAPI Consistency Review | AD | BU | BN, BA, EB, TC |
| S3-15 | ER Diagram & Database Schema | AD | EB | BU, BN, BA, TC |
| S3-16 | Order Creation & Stock Reservation | AD | TC | BU, BN, BA, EB |
| S3-17 | Order Status & Stock Deduction | AD | BA | BU, BN, EB, TC |
| S3-18 | Order Cancellation | AD | BA | BU, BN, EB, TC |
| S3-19 | C4 & UML Diagrams, ADR | AD | EB | BU, BN, BA, TC |
| S3-20 | Software Test Plan | BA | BU | BN, AD, EB, TC |
| S3-21 | Unit Test Automation | BA | AD | BU, BN, EB, TC |
| S3-22 | Stock Reservation, Cancellation & Idempotency Test Cases | BA | EB | BU, BN, AD, TC |
| S3-23 | Quality Metrics & NFR Verification Criteria | BA | EB | BU, BN, AD, TC |
| S3-24 | Requirements–Test Traceability Matrix | BA | BU | BN, AD, EB, TC |
| S3-25 | MVP Smoke Test | BA | TC | BU, BN, AD, EB |
| S3-26 | GitHub Actions CI Pipeline | EB | AD | BU, BN, BA, TC |
| S3-27 | Unit Test Coverage Gate | EB | BA | BU, BN, AD, TC |
| S3-28 | Repository Rules & Branch Protection Verification | EB | BN | BU, AD, BA, TC |
| S3-29 | MVP Çalıştırma ve Docker Hazırlığı | EB | AD | BU, BN, BA, TC |
| S3-30 | Sprint 3 Git Tag, GitHub Release & README Links | EB | BN | BU, AD, BA, TC |
| S3-31 | Frontend App Shell | TC | AD | BU, BN, BA, EB |
| S3-32 | Waiter Screen | TC | BU | BN, AD, BA, EB |
| S3-33 | Chef Screen | TC | BU | BN, AD, BA, EB |
| S3-34 | Manager Screen | TC | AD | BU, BN, BA, EB |
| S3-35 | User-flow Implementation & Frontend–Backend Integration | TC | AD | BU, BN, BA, EB |
| S3-36 | Figma Links & UI Documentation | TC | BN | BU, AD, BA, EB |
| S3-37A | Ingredient & Menu Item Management API | TC | AD | BU, BN, BA, EB |
| S3-37B | Recipe Management & Inventory Adjustments API | EB | TC | BU, BN, AD, BA |
| S3-38 | Low-Stock Alerts & Operation History | EB | BA | BU, BN, AD, TC |
| S3-39 | Backend Project Skeleton | AD | EB | BU, BN, BA, TC |
| S3-40 | Authentication & Role Guard | AD | EB | BU, BN, BA, TC |

## Coordination between tasks

- **Seed and setup:** Bilgesu owns the demo data and scenario (S3-11). Emre connects the seed command to setup (S3-29). Seed depends on the backend skeleton (S3-39), schema (S3-15) and authentication (S3-40). The opening-stock step uses the S3-37B adjustment API with `INITIAL_STOCK`. S3-37A is also needed if ingredients are created through the API.
- **Orders and inventory:** Ayşe implements the reservation rules (S3-16), and Tuğçe integrates the UI. Tuğçe owns the ingredient and menu APIs (S3-37A). Emre owns recipes, inventory adjustments and available-portion calculation (S3-37B), plus low-stock alerts and operation history (S3-38).
- **Architecture and delivery:** Ayşe owns C4/UML and ADR updates (S3-19). Emre owns the release (S3-30), and Bilgesu coordinates final consistency and Teams submission (S3-12, S3-13).
- **Release evidence:** Beyzanur prepares the test report, coverage results, and CI evidence for the tagged commit. Emre verifies them.
