# Contributing to Shardsclaw

Welcome to the Shardsclaw project.

## Quick Links

- **GitHub:** https://github.com/Shards-inc/shardsclaw
- **Vision:** [`VISION.md`](VISION.md)
- **Issues and pull requests:** https://github.com/Shards-inc/shardsclaw/issues
- **Upstream OpenClaw community:** https://community.openclaw.ai/ (external; not operated by Shardsclaw)

## Maintainers

Shardsclaw is an independently maintained fork of OpenClaw. The OpenClaw Foundation team and Core Maintainers are listed on the
[upstream people page](https://www.openclaw.org/people); they are not Shardsclaw maintainers.

## How to Contribute

1. **Bugs & small fixes** → Open a PR!
2. **New features / architecture** → Start a GitHub issue in this repository or discuss the proposal in your pull request. Most features should be third-party plugins using the plugin SDK.
3. **Refactor-only PRs** → Tie refactoring to a concrete fix or explain the user/maintenance value; isolated refactors may be declined.
4. **Test/CI-only PRs for known `main` failures** → Avoid a standalone change that only suppresses a known failure. Report it in an issue and include a fix with a concrete behavior change where possible.
5. **Questions and setup help** → Use the Shardsclaw issue tracker. There is no separate Shardsclaw community channel configured yet; the upstream OpenClaw community is external and does not provide Shardsclaw support.

## Issue, PR, and Contact Routing

Start from this routing map before creating GitHub items:

| Situation                                                | Use                                                                                                 | Required evidence                                                                                                   |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Product bug, regression, crash, or behavior defect       | [Bug report](https://github.com/Shards-inc/shardsclaw/issues/new?template=bug_report.yml)           | Repro steps, expected vs actual behavior, version, OS, model/provider route when relevant, logs/screenshots, impact |
| Documentation bug or missing/contradictory docs          | [Docs bug report](https://github.com/Shards-inc/shardsclaw/issues/new?template=docs_bug_report.yml) | Affected docs path or URL, verification steps, expected docs content, actual docs content, impact, evidence         |
| New feature, architecture change, or product improvement | [Feature request](https://github.com/Shards-inc/shardsclaw/issues/new?template=feature_request.yml) | Problem, proposed solution, alternatives, impact, examples or prior art                                             |
| Onboarding, setup help, or general support question      | Use the [Shardsclaw issue tracker](https://github.com/Shards-inc/shardsclaw/issues/new/choose)      | State that the report is a question and include the relevant version/source revision                                |
| Security vulnerability                                   | See [Report a Vulnerability](#report-a-vulnerability) below                                         | Do not file public issues for private security reports                                                              |
| PR for an existing or newly filed issue                  | Use the [PR template](.github/pull_request_template.md)                                             | Visible `Closes #<issue>` or `Related: #<issue>`, problem, shipped solution, user impact, validation evidence       |

For agent-authored or otherwise non-trivial work, create or reuse the issue first, then open the PR against it. Bugs and very small fixes may go straight to PR, but still link existing context when it exists and fill out the PR template.

Do not guess who to tag. Let issue forms, labels/automation, and `.github/CODEOWNERS` route the work. Mention a maintainer only when an owned path or documented responsibility is directly relevant and you need a decision; otherwise rely on normal review. For coordinated change sets, discuss the plan in the relevant Shardsclaw issue before splitting work into multiple pull requests.

## Pull-request scope

Shardsclaw has no repository-specific PR-count limit or automatic close policy documented. Keep pull requests focused and discuss large coordinated changes in the relevant Shardsclaw issue first.

## Source dependencies

Run `pnpm install --frozen-lockfile` from the workspace root. Source checkouts use
pnpm's isolated linker, which keeps dependencies in `node_modules/.pnpm` and links
them into each workspace package. On supported macOS volumes, this also lets pnpm
reuse whole-package APFS clones instead of importing every file separately.

Installation also prepares Kysely declarations from the SQL schemas in `src/state`.
The generated files live in ignored `.artifacts/kysely/`; build, typecheck,
type-aware lint, and test entrypoints refresh them automatically, including after an install with
`--ignore-scripts`. Unchanged inputs reuse the declarations without rewriting
them. `pnpm db:kysely:check` checks schema projection and generator contracts.
Sparse core, script, and root-test lint prepare only the available schemas and
retire declarations for omitted schemas. Normal source generation, verification,
and extension-boundary builds still require complete schemas.

Give each source checkout its own physical dependency installation. Tooling does
not automatically link a missing `node_modules` to another checkout. Existing
borrowed installs can still serve direct Node tooling. Normal pnpm install checks
the checkout-root `node_modules`, the explicitly configured root module directory,
and their `.pnpm` directories before reconciliation, refusing borrowed links there.
Preserve that donor and create an independently owned install instead of removing
or reinstalling through its link. Explicit hydrated module directories remain
supported when the workspace link points to the configured physical directory.
This admission check runs through `pnpm:devPreinstall`; `--ignore-scripts` skips
it. The check does not lock paths against concurrent replacement, inspect every
workspace package's dependencies, or validate every alternate pnpm directory setting.

When updating a checkout that used the hoisted layout, stop builds, tests, and
watchers using that checkout's dependencies before running the install command.
Do not change the linker while other jobs are using the same `node_modules`.
Declare dependencies in the package that imports them; root tooling and tests
must declare their own development dependencies rather than rely on hoisting.

## Before You PR

- Use **Node 24.22.1+ LTS** or **Node 26.12.1+** for source checkouts. Older Node releases can truncate SQLite TEXT reads; Node 22, 23, and 25 are unsupported. See [Node install guidance](docs/install/node.md) if your local version is too old.
- Local tests and `pnpm dev` use the pinned Bun fork declared by this repository. See [local development tools](docs/reference/test/local.md) for supported platforms, automatic staging, runtime/tool overrides, and fallbacks, and [CI runtime selection](docs/ci/pipeline.md) for CI policy.
- Test locally with a Shardsclaw source checkout.
- An explicit maintainer repair-and-land request covers internal database scheduling, admission, and lifecycle decisions. The implementer owns the design and its verification. Get separate design acceptance when changing public contracts, schemas, durability, retention, or permissions; see the [database schema review checkpoint](docs/reference/database-schemas.md#review-checkpoint-for-material-changes).
- External PRs must describe the user, product, or operational problem in **What Problem This Solves** and include useful validation in **Evidence**. Focused tests, CI results, screenshots, recordings, terminal output, live observations, redacted logs, and artifact links all count. Reviewers will inspect the code, tests, and CI; use the PR body to explain intent and make validation easy to understand.
- Follow the [PR template](.github/pull_request_template.md): lead with the plain-language problem and concrete user impact, then a brief explanation and useful evidence. Keep technical inventories in the diff or optional details, not the opening summary. Keep important risks, migrations, required actions, and evidence gaps visible; do not invent a user benefit for internal-only work.
- When a reviewer asks for more context or evidence, edit the PR description instead of only replying in a new comment. Keep **What Problem This Solves**, **User Impact**, **Why This Change Was Made**, and **Evidence** current; a short comment can point reviewers to the update, but the PR body should remain the durable explanation for maintainers and bots.
- Keep PRs takeover-ready: open them from a branch maintainers can push to. For fork PRs, leave GitHub's **Allow edits by maintainers** option enabled so maintainers can finish urgent fixes or merge prep when needed. If GitHub shows **Allow edits and access to secrets by maintainers**, enable it only when that workflow/secrets access is acceptable and say so in the PR.
- Do not edit the generated `CHANGELOG.md` index or release-owned `CHANGELOG/**` entries and contribution records in normal PRs or at merge. Initial changelogs are generated at release time from merged PRs and commits; keep release-note context in PR bodies or commit messages until then. Explicit release-docs publication changes follow the [release artifact procedure](.agents/skills/openclaw-changelog-update/SKILL.md#post-release-docs-mirrors).
- Run focused tests for touched code (`pnpm test <file> --maxWorkers=1`) and targeted typecheck, lint, and format checks. Build when the change affects build output or package boundaries. Open a ready PR once focused proof passes; PR CI runs the full suite.
- When adding a maintained standalone command or dynamically loaded child, keep Knip's graph aligned with the real execution path. A command invoked by a package script, workflow, Docker scenario, or documentation—or a child executed as a spawned, preloaded, or worker process entrypoint through an exact path—is an exact Knip entry (`repositoryScriptEntries` in `config/knip.config.ts` for root repository scripts). When a child is instead reached as a computed module edge from a parent, use the existing source-derived consumer projection that owns that edge, such as `config/knip-dynamic-consumers.mjs` for root scripts; do not declare the child as an independent root solely to suppress a finding or mask it with an ignore or wildcard. Run `pnpm deadcode:unused-files` on the exact candidate; `pnpm check:changed` and [ordinary PR CI](docs/ci/scope-and-routing/selection.md#pr-vs-hourly-vs-release) do not run this unused-file proof. If unrelated existing findings keep the aggregate scan red, verify and report whether your owned paths appear rather than calling the aggregate a pass.
- After PR CI fails, run `pnpm test:ci-failed <pr>` and read the failure classification. Fix new failures, use `pnpm test:ci-failed <pr> --run` until those pass locally, then push once. Do not rerun CI just to chase green or run the full local suite. Pre-existing failures follow the [failure-table landing rule](.agents/skills/shardsclaw-pr-maintainer/references/landing.md#red-main-and-inherited-failures).
- For iterative local commits after running equivalent targeted validation for the touched surface, `git commit --no-verify` skips commit hooks.
- For extension/plugin changes, run the fast local lane first:
  - `pnpm test:extension <extension-name>`
  - `pnpm test:extension --list` to see valid extension ids
  - If you changed shared plugin or channel surfaces, run `pnpm test:contracts`
  - For targeted shared-surface work, use `pnpm test:contracts:channels` or `pnpm test:contracts:plugins`
  - These commands also cover the shared integration/smoke files that the default unit lane skips
  - For broader runtime changes, select focused tests that cover the touched contracts; PR CI runs the wider lanes (`pnpm test:extensions`, `pnpm test:channels`, or `pnpm test`) before landing
- If you touched bundled-plugin boundaries in shared code, run the matching inventories:
  - `node --import tsx scripts/check-src-extension-import-boundary.mts --json` for `src/**`
  - `node --import tsx scripts/check-sdk-package-extension-import-boundary.mts --json` for `src/plugin-sdk/**` and `packages/**`
  - `node --import tsx scripts/check-test-helper-extension-import-boundary.mts --json` for `test/helpers/**`
- Shared test helpers must use `src/test-utils/bundled-plugin-public-surface.ts` instead of repo-relative `extensions/**` imports. Keep plugin-local deep mocks inside the owning bundled plugin package.
- Local review is strongly encouraged for contributors: use autoreview or optional local ClawSweeper. Follow the [local review route](docs/reference/pull-request-review-flow.md#local-review-before-a-pr) for public setup, maintainer requirements, and review evidence. Address actionable findings before asking for review.
- Do not submit refactor-only PRs unless a maintainer explicitly requested that refactor for an active fix or deliverable.
- Do not submit test or CI-config fixes for failures already red on `main` CI. If a failure is already visible in the [Shardsclaw main branch CI runs](https://github.com/Shards-inc/shardsclaw/actions), it's a known issue the maintainers are tracking, and a PR that only addresses those failures may be closed. If you spot a _new_ regression not yet shown in main CI, report it as an issue first.
- Do not submit test-only PRs that just try to make known `main` CI failures pass. Test changes are acceptable when they are required to validate a new fix or cover new behavior in the same PR.
- Check that CI checks pass
- Keep PRs focused (one thing per PR; do not mix unrelated concerns)
- Describe what & why
- **Include screenshots** — one showing the problem/before, one showing the fix/after (for UI or visual changes)
- Use American English spelling and grammar in code, comments, docs, and UI strings

## Security-sensitive changes

Changes to authentication, credentials, secret handling, sandboxing, or execution
permissions receive a security-review notice with the affected files and review
guidance. A PR author with a GitHub user account and repository `maintain` or
`admin` access needs no additional security approval. Other authors need a
command comment from a user with either role:

- `/allow-security-sensitive-change` for sensitive product changes.
- `/allow-dependencies-change` for dependency changes that require approval.

Wait for the guard notice to show the current PR commit, then post the applicable
command on its own line in a new PR comment. Use only command lines in that
comment. If both guards require approval, post both commands; they can be on
separate lines in one comment. A later push requires a new comment after the
notices update. Editing an older comment does
not grant fresh approval. Deleting the comment or removing a command revokes that
command's approval. Normal GitHub **Approve** reviews and labels do not satisfy
these command requirements.

PR updates, approval comment events, and CI completion run security review
automatically. Approval comments update the review result without rerunning the
test suite. Missing approval fails the check. Automation using a GitHub user
account follows the same role checks; GitHub App bot identities do not qualify.
Open PRs targeting the same branch must have distinct head commits. GitHub shares
commit statuses across PRs, so duplicate heads block security approval. Close the
duplicate PR or push a distinct commit; security review evaluates automatically.

The human-readable [security review policy](.github/security-review-policy.yml)
lists sensitive product categories, review guidance, exclusions, and dependency
paths. Changes to that inventory require SecOps approval.

Security policy, CodeQL, and the security-review enforcement files listed in
[CODEOWNERS](.github/CODEOWNERS) require independent approval from the configured
security code owner, including on maintainer-authored PRs. A
maintainer approval of product code does not replace that code-owner requirement.
Normal project review and release-owner requirements still apply.
The existing maintainer CI bypass can override a missing command approval, but
does not bypass the separate code-owner review requirement.

See [security review checks](docs/ci/pipeline.md#security-review-checks)
for check behavior and enforcement setup.

## Local commit hook

`pnpm format` and the formatting hook share the [local development tool selector](docs/reference/test/local.md).
Use `OPENCLAW_FORMAT_TOOL=oxfmt pnpm format` to force oxfmt. The linked reference
covers the pinned fork, supported platforms, overrides, fallbacks, and CI parity.
Dedicated artifact formatters are listed in the [formatter caller inventory](scripts/README.md#formatting-and-lint-selection).

The normal `pnpm install` setup enables the repository's pre-commit formatting hook
when `core.hooksPath` is unset. Existing hook selections, including an explicitly
empty value, are preserved. Git scopes initialization to the current checkout.
With multiple worktrees, automatic setup requires `extensions.worktreeConfig`;
otherwise Git reports a warning and installation continues without changing hook
settings. The repository owner can enable per-worktree configuration following
[Git's configuration guidance](https://git-scm.com/docs/git-worktree#_configuration_file).

The hook's optional content guard reads a private UTF-8 file selected by
the native Git setting `hooks.blockedLiteralsFile`. Keep one literal per nonempty
line in a file outside the checkout, such as
`~/.config/openclaw/blocked-literals.txt`, then configure this checkout:

```bash
git config --local hooks.blockedLiteralsFile "$HOME/.config/openclaw/blocked-literals.txt"
```

Git metadata is another safe untracked location for the private file. Never put
private rule contents in tracked files or PRs. With no setting, the content guard
is disabled and formatting runs normally; a configured empty path or missing,
unreadable, empty, or invalid file blocks the commit.

When configured, the guard checks case-sensitive literal substrings before
formatting and again after formatting restages files. Each scan checks the full
staged contents of added, modified, and type-changed files, including rename
destinations and unchanged lines within modified files. Docs, tests, generated
files, and binary files are included; no tracked file is exempt.

If the hook blocks a commit, remove the matching content and restage the reported
files. Unchanged historical files and deletions are not scanned. Submodule contents
and symlink targets are not searched. This is a local safeguard, not CI or server
enforcement: bypassing or disabling hooks also bypasses this check.

## Review Conversations Are Author-Owned

After your PR receives reviewer feedback, read the [pull request review flow](docs/reference/pull-request-review-flow.md) for proof guidance, re-review requests, and review conversation follow-up.

## Control UI

The Control UI uses **Solid 2** and native primitives, not Lit or decorator-based
reactive fields. Before changing UI code, read the [Control UI guide](ui/AGENTS.md)
and the [Solid skill](.agents/skills/solid/SKILL.md) for the current patterns and
validation requirements.

## AI/Vibe-Coded PRs Welcome! 🤖

Built with Codex, Claude, or other AI tools? **Welcome!** No AI-assistance label or disclosure is required.

Please include in your PR:

- [ ] Include a concise **Evidence** section with the most useful validation. Reviewers will inspect the code, tests, and CI rather than relying on the PR body alone.
- [ ] Confirm you understand what the code does
- [ ] Follow the [local review route](docs/reference/pull-request-review-flow.md#local-review-before-a-pr), address actionable findings, and record the outcome or unavailable-tool gap
- [ ] Follow the [pull request review flow](docs/reference/pull-request-review-flow.md) after reviewer feedback

AI PRs are first-class citizens here and follow the same quality and review standards as any other PR.

## Roadmap and issue selection

Shardsclaw has no separate public roadmap yet. Check the [Shardsclaw issue tracker](https://github.com/Shards-inc/shardsclaw/issues) for current proposals and issues labeled `good first issue`. The upstream OpenClaw roadmap and ClawHub are external and are not Shardsclaw planning or support channels.

## Maintainers

Shardsclaw does not publish a maintainer application email or a guaranteed review-response time. The existing `CODEOWNERS` file still contains inherited OpenClaw upstream teams; it does not identify Shardsclaw maintainers. Use the repository's public issue and pull-request process, and do not send private information to upstream OpenClaw contacts.

## Report a Vulnerability

We take security reports seriously. For this fork, use [GitHub Security Advisories](https://github.com/Shards-inc/shardsclaw/security/advisories/new) when private vulnerability reporting is enabled. Do not publish an unpatched vulnerability in a public issue or pull request; if the private route is unavailable, contact a Shardsclaw repository administrator through GitHub and request a private channel without including sensitive details. Reports concerning upstream OpenClaw or ClawHub should go to their respective operators.

- **Shardsclaw core CLI, gateway, and companion apps** — [Shards-inc/shardsclaw](https://github.com/Shards-inc/shardsclaw)
- **OpenClaw upstream or ClawHub** — contact the respective upstream project through its official reporting channel; those channels are not operated by Shardsclaw.

### Required in Reports

1. **Title**
2. **Severity Assessment**
3. **Impact**
4. **Affected Component**
5. **Technical Reproduction**
6. **Demonstrated Impact**
7. **Environment**
8. **Remediation Advice**

Reports without reproduction steps, demonstrated impact, and remediation advice will be deprioritized. Given the volume of AI-generated scanner findings, we need reports that researchers have checked and understand.
