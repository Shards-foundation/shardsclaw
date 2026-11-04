# Shardsclaw Rebrand — Verification and Publication Audit

**Audit date:** 2026-11-02
**Prepared on branch:** `chore/shardsclaw-rebrand`
**Publication target:** [Shards-inc/shardsclaw](https://github.com/Shards-inc/shardsclaw), public as requested
**Publication state as of 2026-11-04:** published publicly to `Shards-inc/shardsclaw`; the full-history rebrand is on the default `main` branch and the temporary staging ref was removed

## Scope and lineage

The rebrand is based on source snapshot `1485127247484e77ce18e2bf048ee57bf9cded57`, which had 121,766 reachable commits before the new rebrand commit. The change is additive; no ancestor is rewritten. At audit time, upstream `origin/main` had advanced four commits beyond the captured snapshot. Those later commits are not included: the approved rebrand and its verification are scoped to the captured source tree, and importing unrelated changes would require a new audit.

The target path returned 404 during the authenticated pre-publication check. The approved publication is a first push to that exact public repository, without initializing a separate README or license and without force. The existing upstream remote remains unchanged.

## Publication status as of 2026-11-04

The public target was created without a seed README or license. The initial full-history push attempted a 9.74 GiB pack and failed with HTTP 500. Following GitHub's [2 GiB push-limit guidance](https://docs.github.com/en/get-started/using-git/troubleshooting-the-2-gb-push-limit) and [repository push-rate guidance](https://docs.github.com/en/repositories/creating-and-managing-repositories/repository-limits), a resumable sequence of 24 non-force first-parent checkpoints was prepared, with a 10-second pause between pushes. All checkpoints completed and were verified at the remote staging ref, which reached rebrand commit `717f4743559f06d58ac7498a443dec8544bb1753`.

The first 119.86 MiB checkpoint was initially rejected because the then-active GitHub App credentials lacked `workflows` permission to create or update `.github/workflows/ci.yml`; neither credential created a remote ref. After reconnection, GitHub's live installation permission map included `workflows:write`. The full-history rebrand commit was then published to `main` with a non-force push and verified at `717f4743559f06d58ac7498a443dec8544bb1753`. GitHub had made the temporary staging branch the default, so the default was changed to `main` before the staging ref was removed.

Final checks confirmed that `main` is the public repository's default branch and contains rebrand commit `717f4743559f06d58ac7498a443dec8544`; the temporary staging ref is absent. GitHub-created Dependabot branches remain in the repository and were not altered.

The change covers public documentation and project metadata, product identity and original shard-and-claw artwork, UI and mobile display/localization surfaces, provider attribution, maintainer guidance, and safeguards against inherited publishing workflows writing to upstream destinations.

## Preservation and attribution decisions

The existing MIT license, author/copyright notices, and historical credits remain intact. The root manifest's self-identity remains unchanged because runtime bootstrap imports rely on it; the preferred Shardsclaw executable, legacy command alias, and direct launcher identity are covered by `test/package-identity.test.ts`. Persistent data locations, environment-variable keys, protocol/package identifiers, and platform signing or bundle identities remain unchanged, with compatibility tests covering the preserved behavior.

Upstream-owned installers, services, app stores, domains, and catalogs are identified as upstream-only rather than represented as Shardsclaw-owned. Inherited release and publishing jobs remain guarded from writing outside the upstream repository. The new artwork is original; no upstream logo, mascot, or illustration was reused.

## Residual-reference scan

The detailed residual-match policy and end-state counts are in [`rebrand-inventory.md`](rebrand-inventory.md). Using the same tracked-text and tracked-path scope, the final scan found 366,826 matching text lines across 40,044 tracked files and 3,126 tracked paths. This nonzero volume is expected: the inventory classifies retained compatibility identifiers, legal/provenance and historical records, generated/vendor/test fixtures, and externally controlled references. These counts are not treated as a zero-match acceptance test; no stale active Shardsclaw identity remained in the audited product surfaces.

## Verification evidence

**Focused rebrand regressions — PASS.** Seven test files passed, with 44 tests covering documentation identity and ownership boundaries, package metadata and launcher identity, retained desktop/data compatibility, localized app branding and assets, all-locale UI copy, and workflow write guards.

**Package build — PASS with notice.** `pnpm build:package` exited 0 after restoring the required root self-identity. Its output also printed a chat-boot size notice of 1246.8 KiB against 1246.7 KiB. The controlled base comparison is recorded below; the build notice was not suppressed.

**Control UI performance comparison — PASS.** `pnpm ui:check-performance:base 1485127247484e77ce18e2bf048ee57bf9cded57` exited 0. Chat boot JavaScript measured 1,275,818 B against a 1,276,669 B limit (851 B headroom), an increase of 783 B gzip from the source baseline; requests remained 20. Chat boot CSS increased 73 B gzip, with requests unchanged at 3.

**Formatting and Markdown — PASS.** `pnpm format:check` passed. Markdownlint over the approved capability map/specifications, inventory, docs, and README reported 0 issues across 1,404 files. `git diff --check` passed.

**Documentation checks — PASS.** MDX validation, docs lint, template lint, link audit, config-example validation, localization glossary, and maintainer-file size checks all exited 0.

**Localization — PASS.** Canonical UI sync ran with translation-provider access disabled; verification reported no missing fallback keys across 21 UI locales. `ui:i18n:verify`, `native:i18n:verify` (4,543 entries unchanged), and `android:i18n:check` (21 locales) passed.

## Limitations and non-blocking findings

**Dependabot alerts — follow-up.** During publication, GitHub reported 40 vulnerability alerts on the default branch: 1 critical, 12 high, 21 moderate, and 6 low. Dependency remediation was outside the scope of this rebrand; GitHub-generated Dependabot branches were left untouched.

**Full unit suite — BLOCKED before tests.** `pnpm test:unit` did not start because its protective preflight exited 2 with: “Cannot verify that test preparation is separate from managed Gateway artifacts. Use the existing isolated test runner; no checkout artifacts were rebuilt.” This is recorded as blocked before test execution, not as a test failure.

**Workflow validation — two inherited warnings.** `pnpm check:workflows` exited 1 for two `ref-version-mismatch` findings in unchanged files: `.github/workflows/ci-check-arm-testbox.yml:104` and `.github/workflows/node-runtime-conformance.yml:152`. Fork-specific workflow-safety regressions passed.

**Secret scan — bounded pattern check only.** No dedicated secret-scanning binary was installed. The staged-diff scan for common high-confidence credential formats found 0 candidates, and the staged path check found 0 sensitive key/database/environment filenames. This is not a claim of comprehensive secret scanning.

**Workspace command probe — not available here.** The checkout does not install its own root package binaries into `node_modules/.bin`, so `pnpm exec shardsclaw --version` is unavailable in this workspace. Package-identity tests verify the bin metadata and invoke the source launcher directly.

No code, translations, or workflow guards were changed after the passing focused suite and package build; the inventory and audit documents were formatted and linted separately before publication.
