# Spec: Shardsclaw Public Surface

## Objective

Rebrand active public-facing content owned by this source repository—README, canonical English docs, help pages, examples, UI copy, and source-repository URLs—to Shardsclaw. Preserve technical accuracy, compatibility guidance, required notices, and truthful attribution to OpenClaw/upstream authors. Historical changelog entries remain historical records. The published documentation website and generated localized translations are owned outside this checkout and are not modified here.

## Tech Stack

Markdown/MDX and generated documentation in the existing pnpm monorepo; UI components as already present. No new framework, external docs-site project, or hosted service is included.

## Commands

`pnpm docs:list`; `pnpm format:docs:check`; `pnpm lint:docs`; `pnpm lint:templates`; `pnpm docs:check-mdx`; `pnpm docs:check-links`; `pnpm docs:check-config-examples`; `pnpm docs:check-i18n-glossary`; `pnpm check:docs` (confirm exact script availability and feasibility before running).

## Project Structure

`README.md`, canonical English content under `docs/`, UI and app-owned help/copy, examples/snippets, and generated docs indexes. Do not edit `docs/<locale>/**` or `docs/.i18n/**`; translations and the published docs site are maintained in the separate upstream-owned docs repository. For UI and native app strings, change only canonical English/source records, regenerate the required baselines, and never hand-edit generated translations or locale catalogs. `CHANGELOG*`, license files, author credits, and upstream historical references receive special factual/provenance review.

## Code Style

Keep the project’s existing concise, user-oriented American English and command syntax. Example: “Build Shardsclaw from this repository with `pnpm install --frozen-lockfile`.” Do not direct users to an unpublished `shardsclaw` npm package or imply Shardsclaw controls OpenClaw-hosted services. Use relative repository links where possible and confirmed `github.com/Shards-inc/shardsclaw` URLs where an absolute link is required.

## Testing Strategy

Use a tracked-file brand inventory, classify every remaining OpenClaw string, update active English user guidance consistently, then run docs formatting, MDX, links, glossary, and config-example checks. For UI strings, use `pnpm ui:i18n:baseline` and `pnpm ui:i18n:verify`; for native strings use `pnpm native:i18n:baseline` and `pnpm native:i18n:verify`, plus `pnpm android:i18n:check` for Android XML resources. Do not edit generated translations. Review all outbound URLs: point only to confirmed Shardsclaw destinations when they represent Shardsclaw; preserve and label upstream-owned URLs only when needed for lineage/compatibility, otherwise replace them with a valid local/repository link or remove obsolete instructions. Keep factual upstream and historic references in a documented allowlist.

## Boundaries

- Always: keep install/configuration instructions executable and tested; keep legal/provenance statements; use the agreed brand casing; avoid claiming unimplemented compatibility; follow `docs/AGENTS.md` ownership rules.
- Ask first: replacing externally owned domains, download endpoints, OAuth/callback destinations, community links, or app-store URLs.
- Never: edit generated localized translations or upstream docs-site source; redirect users to a nonexistent service; silently rewrite historical release records; remove license/author credits; claim an unpublished package is available.

## Success Criteria

1. Active repository-owned English user-facing content identifies the product as Shardsclaw consistently.
2. Links and examples point to confirmed Shardsclaw destinations or valid local docs; third-party/upstream services are not represented as Shardsclaw-owned.
3. Historical, legal, and compatibility references are retained where truthful/required; generated translations remain untouched.
4. Documentation validation succeeds or specific environment/repo blockers are recorded.

## Open Questions

README and repository links can target `github.com/Shards-inc/shardsclaw`. External docs/domain/community URLs remain unchanged unless needed to remove an incorrect claim and the replacement is confirmed. Do not assume ownership of any existing OpenClaw website or service.
