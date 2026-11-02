# Spec: Shardsclaw Delivery Operations

## Objective

Adapt repository automation and delivery configuration so the new public source repository is correctly identified as `Shards-inc/shardsclaw`, while preventing accidental pushes/releases to upstream or unconfigured external destinations. Source-history publication is authorized; package, binary, app-store, deployment, or live-service publication is not.

## Tech Stack

Git/GitHub, GitHub Actions and existing repository CI/release scripts, package/build metadata, and any existing update/distribution automation. Preserve the project’s current workflow technology.

## Commands

Inspect `CONTRIBUTING.md`, `.github/` workflows, release contracts, package scripts, and all remote/default-branch references. Validate with `pnpm check:workflows`, relevant repository ownership/config checks, `pnpm format:check`, and focused static scans (verify command availability). Before push, inspect remotes, branch, status, diff, secrets scan, and commit history.

## Project Structure

`.github/` workflows and repository config; release/update scripts and metadata; Git remotes and documentation; package publishing configuration. Review all action permissions, triggers, secrets, and destinations as existing behavior, changing only brand/target identity necessary for safe operation.

## Code Style

Follow existing workflow conventions and minimize behavior changes. Example invariant: release scripts must not acquire a Shardsclaw package destination merely from changing a package name; registry publication remains disabled/out of scope until separately configured and authorized.

## Testing Strategy

Static-check workflow syntax and project workflow checks; trace every push/publish/deploy action and target. Confirm default checkout/remote links point to the new repo where intended, upstream is not a push target, no secrets were added, and no workflows are manually dispatched accidentally by this task. Push only the preserved-history source repository to the user-confirmed public target after verification.

## Boundaries

- Always: preserve commit history; use a feature branch and non-force push; ensure all pushes target `Shards-inc/shardsclaw`; check target status/existence and branch conflicts before creating/pushing.
- Ask first: enabling package/release/deploy workflows, configuring secrets, changing public domains, force-pushing, or changing any third-party integration.
- Never: push to `openclaw/openclaw`; force-push; publish binaries/packages/apps; modify production/live service settings; expose credentials.

## Success Criteria

1. GitHub source repository `Shards-inc/shardsclaw` receives the reviewed Shardsclaw source and preserved history.
2. Repository automation does not target upstream and does not trigger unapproved non-source releases.
3. Workflow/config validation and pre-push hygiene pass, with any unsupported checks disclosed.
4. Final report states destination, branch, commit, validation evidence, and remaining configuration not controlled by this task.

## Open Questions

Before pushing, inspect whether the existing `Shards-inc/shardsclaw` repository is absent or empty. If it already contains unrelated history/content or its default branch differs, stop and request direction rather than overwrite or force-push. Public repository creation is included in the user’s explicit request only if the target does not yet exist.
