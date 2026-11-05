# PantryChef – Git Workflow (Git-Flow)

**Course:** BM 321 – Software Engineering
**Team:** 7
**Document Owner:** Emre Boz
**Role:** DevOps and CI/CD Infrastructure Engineer
**Document Status:** Sprint 1 draft – pending team review

This document defines how the team uses branches, issues, pull requests, reviews, checks, and tags. The repository rulesets enforce the protected-branch rules in section 6.

---

## 1. Branch model

The team uses a lightweight Git-Flow model. Only `main` and `develop` are permanent branches.

| Branch | Created from | Merges into | Purpose | Protected |
|---|---|---|---|:---:|
| `main` | — | — | Assessed and released versions only. Each sprint submission is tagged here. | Yes |
| `develop` | `main` | `main` at the end of a sprint | Integrates completed work for the next sprint release. Default branch of the repository. | Yes |
| `feature/<issue>-<short-name>` | `develop` | `develop` | One story, document, defect, or technical task. Short-lived. | No |
| `release/<version>` | `develop` | `main` and `develop` | Optional stabilization before a submission. | No |
| `hotfix/<issue>-<short-name>` | `main` | `main` and `develop` | Optional urgent fix to a released version. | No |

Short feature branches and reviewed pull requests matter more than creating unused branch types. `release/*` and `hotfix/*` are used only when there is a real need.

---

## 2. Naming conventions

### 2.1 Branches

- Format: `feature/<issue-number>-<short-kebab-case-name>`
- Examples: `feature/12-order-create`, `feature/8-openapi-draft`, `feature/5-team-roles-raci`
- Lowercase letters, digits, and hyphens only.
- One branch per issue.

### 2.2 Commits

- Imperative summary of at most 72 characters, for example `Add order state diagram`.
- Reference the issue at the end of the summary: `Add order state diagram (#12)`.
- Each commit contains one focused change.

### 2.3 Tags

- Sprint submissions: `sprint-1`, `sprint-2`, `sprint-3`.
- Final release: `v1.0.0` (Semantic Versioning).

---

## 3. Everyday workflow

1. **Issue first.** Make sure an issue exists for the work. Use a template (User story, Task, or Bug), assign yourself, and add the sprint milestone and labels.
2. **Create a branch from the latest `develop`:**

   ```bash
   git checkout develop
   git pull
   git checkout -b feature/12-order-create
   ```

3. **Commit your work:**

   ```bash
   git add docs/system-vision.md
   git commit -m "Add order state diagram (#12)"
   ```

4. **Push the branch:**

   ```bash
   git push -u origin feature/12-order-create
   ```

5. **Open a pull request into `develop`.** Fill in the template, write `Closes #12` in the description, and request at least one teammate as reviewer.
6. **Address review comments** by pushing more commits to the same branch.
7. **Merge** after one approval and passing checks. The branch is deleted automatically after the merge.

Open the pull request as soon as the work is reviewable, ideally within a few days.

If `develop` has moved on while you worked, update your branch before merging:

```bash
git checkout develop
git pull
git checkout feature/12-order-create
git merge develop
git push
```

---

## 4. Issues

- Every change starts with an issue that states its purpose, owner, and acceptance evidence.
- Templates: **User story** for backlog items, **Task** for Sprint tasks such as `S1-08`, **Bug report** for defects.
- Title prefix: the Sprint task ID or story ID, for example `[S1-08] Prepare initial OpenAPI YAML` or `[US-03] Waiter creates an order`.
- Milestones: one per sprint (`Sprint 1`, `Sprint 2`, `Sprint 3`).

### 4.1 Labels

| Label | Use |
|---|---|
| `sprint-1` | Work planned for Sprint 1 |
| `user-story` | Backlog user story |
| `task` | Technical or documentation task |
| `bug` | Defect |
| `documentation` | Project documents |
| `api` | OpenAPI contract |
| `testing` | Test cases and test automation |
| `devops` | Repository, CI/CD, and infrastructure |
| `priority: high`, `priority: medium`, `priority: low` | Priority |

---

## 5. Pull requests and reviews

### 5.1 Author

- Targets `develop` (release and hotfix branches target `main`).
- Links the issue with `Closes #<number>`.
- Summarizes the change and includes evidence: validation output, test results, screenshots, or review notes.
- Requests at least one teammate as reviewer.

### 5.2 Reviewer

- Checks correctness, clarity, evidence, and impact on the API contract and on the agreed order workflow (Pending → Preparing → Ready → Delivered).
- Approves, or requests changes with concrete comments.
- Authors cannot approve their own pull requests.

### 5.3 Merge method

| Pull request | Merge method |
|---|---|
| `feature/*` → `develop` | **Squash and merge** (one commit per pull request) |
| `develop` → `main`, `release/*` → `main`, `hotfix/*` → `main` | **Create a merge commit** (keeps the history of `develop` on `main`) |

Rebase merging is disabled in the repository settings.

---

## 6. Protection rules

These rules are enforced by GitHub repository rulesets (Settings → Rules → Rulesets).

| Rule | `main` | `develop` |
|---|:---:|:---:|
| Changes only through pull requests (direct pushes blocked) | ✓ | ✓ |
| At least 1 approving review | ✓ | ✓ |
| Required status check `OpenAPI lint` must pass | ✓ | ✓ |
| Force pushes blocked | ✓ | ✓ |
| Branch deletion blocked | ✓ | ✓ |
| Merge commit only | ✓ | — |

Sprint and release tags (`sprint-*`, `v*`) cannot be deleted or moved once pushed.

No one is on the bypass list, including repository administrators. Every team member uses an individual GitHub account; shared accounts are not allowed.

---

## 7. Continuous integration

The `CI` workflow (`.github/workflows/ci.yml`) runs on every pull request into `main` or `develop` and on every push to those branches.

- **OpenAPI lint** validates `api/openapi.yaml` with Redocly CLI using the `minimal` ruleset in `redocly.yaml`. Structural errors, such as invalid fields or broken `$ref` links, fail the check. Style findings are reported as warnings.
- Until `api/openapi.yaml` exists, the check passes with a notice.

Run the same check locally before pushing (requires Node.js):

```bash
npx @redocly/cli@2.64.1 lint api/openapi.yaml
```

---

## 8. Sprint release

At the end of each sprint:

1. Confirm that all sprint pull requests are merged into `develop`.
2. Open a pull request from `develop` into `main` titled `Sprint 1 release`, get one approval, and merge with **Create a merge commit**.
3. Tag the merge commit on `main` and push the tag:

   ```bash
   git checkout main
   git pull
   git tag -a sprint-1 -m "Sprint 1 submission"
   git push origin sprint-1
   ```

4. Create a GitHub Release from the tag that lists the deliverables, issues, and pull requests.

Use a `release/<version>` branch only when final fixes are needed while others continue on `develop`.

---

## 9. Hotfixes

1. Branch from `main`: `hotfix/<issue>-<short-name>`.
2. Open a pull request into `main`. After the merge, tag a new version if needed.
3. Open a second pull request from `main` into `develop` so the fix also reaches ongoing work.

---

## 10. Traceability

- Issue → branch → commits → pull request → review → merge → tag are linked to each other.
- Pull requests reference their issue with `Closes #...`.
- Sprint submissions are identified by tags on `main`.
- The task board and meeting notes link the relevant issues and pull requests.

---

**Prepared by:** Emre Boz
**Role:** DevOps and CI/CD Infrastructure Engineer
**Sprint:** Sprint 1
