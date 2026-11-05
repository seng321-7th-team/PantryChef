# PantryChef – Git Workflow

**Course:** BM 321 – Software Engineering
**Team:** 7
**Document Owner:** Emre Boz (DevOps and CI/CD Infrastructure Engineer)
**Status:** Draft, Sprint 1

This is how we use branches, issues and pull requests in this repo. Most of the rules below are enforced with GitHub rulesets, so GitHub blocks anything that doesn't follow them.

## 1. Branches

We use a simplified Git-Flow. `main` and `develop` are the only permanent branches.

| Branch | From | Merges into | Used for |
|---|---|---|---|
| `main` | - | - | Submitted versions only. Every sprint submission gets a tag. |
| `develop` | `main` | `main` | Default branch. All finished work goes here first. |
| `feature/<issue>-<name>` | `develop` | `develop` | One issue (story, document, bug or task). |
| `release/<version>` | `develop` | `main` | Optional, only if we need last fixes before a submission. |
| `hotfix/<issue>-<name>` | `main` | `main` and `develop` | Optional, urgent fix on a submitted version. |

Branch names are lowercase with hyphens and start with the issue number, e.g. `feature/12-order-create` or `feature/8-openapi-draft`.

## 2. How to work on something

1. Make sure there is an issue for it (or open one with a template) and assign yourself.
2. Create your branch from the latest `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/12-order-create
   ```
3. Commit and push:
   ```bash
   git add docs/system-vision.md
   git commit -m "Add order state diagram (#12)"
   git push -u origin feature/12-order-create
   ```
4. Open a pull request into `develop`, write `Closes #12` in the description and add a reviewer.
5. Fix review comments on the same branch. When the PR is approved and the check is green it can be merged. The branch is deleted automatically after the merge.

If `develop` changed in the meantime, click **Update branch** on the PR (or merge `develop` into your branch locally).

Commit messages are short and imperative, with the issue number at the end, e.g. `Fix 409 response for cancel (#14)`.

## 3. Issues

Every change starts with an issue. There are three templates: **User story**, **Task** and **Bug report**. Put the task or story ID in the title, like `[S1-08] Prepare initial OpenAPI YAML` or `[US-03] Waiter creates an order`, and add it to the sprint milestone.

Labels:
- `sprint-1`: planned for Sprint 1
- `user-story`, `task`, `bug`: type of work
- `documentation`, `api`, `testing`, `devops`: area
- `priority: high`, `priority: medium`, `priority: low`

## 4. Pull requests and reviews

- PRs go into `develop`. Only release and hotfix PRs go into `main`.
- Link the issue (`Closes #...`) and add some evidence: validation output, test results or screenshots.
- At least one other team member has to approve. You can't approve your own PR.
- The reviewer checks that the change is correct and clear, and that it still matches the API contract and the order workflow (Pending → Preparing → Ready → Delivered).

Merging:
- `feature/*` → `develop`: **Squash and merge**
- `develop` → `main`: **Create a merge commit**, so `main` keeps the history

Rebase merge is turned off.

## 5. Protection rules

Configured in Settings → Rules → Rulesets.

| Rule | `main` | `develop` |
|---|:---:|:---:|
| No direct push, PR required | ✓ | ✓ |
| 1 approval needed | ✓ | ✓ |
| `OpenAPI lint` check must pass | ✓ | ✓ |
| No force push, branch can't be deleted | ✓ | ✓ |
| Merge commit only | ✓ | |

`sprint-*` and `v*` tags can't be deleted or moved. Nobody is on the bypass list, admins included. Everyone uses their own GitHub account.

## 6. CI

`.github/workflows/ci.yml` runs on every PR and push to `main` and `develop`. The **OpenAPI lint** job checks `api/openapi.yaml` with Redocly CLI, using the `minimal` rules from `redocly.yaml`. Real errors like invalid fields or broken `$ref`s fail the check, style issues only show up as warnings. If `api/openapi.yaml` doesn't exist yet, the job is skipped.

To run the same check locally (needs Node.js):

```bash
npx @redocly/cli@2.64.1 lint api/openapi.yaml
```

## 7. End of sprint

1. All sprint PRs are merged into `develop`.
2. Open a PR from `develop` to `main` ("Sprint 1 release"), get an approval and merge it with a merge commit.
3. Tag the result and push the tag:
   ```bash
   git checkout main
   git pull
   git tag -a sprint-1 -m "Sprint 1 submission"
   git push origin sprint-1
   ```
4. Create a GitHub Release from the tag with links to the deliverables, issues and PRs.

## 8. Hotfix

Create `hotfix/<issue>-<name>` from `main` and open a PR into `main`. After it's merged, open a second PR from `main` into `develop` so the fix doesn't get lost.
