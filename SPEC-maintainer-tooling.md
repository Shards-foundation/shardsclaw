# Spec: Shardsclaw Maintainer Tooling

## Objective

Update active maintainer instructions, repository-local skills, scripts, tests, fixtures, and internal checks that embed the old product identity so they support Shardsclaw consistently. Preserve useful upstream attribution, legal notices, and records that document OpenClaw’s historical authorship.

## Tech Stack

Existing repository-specific Markdown instructions/skills, Node.js/TypeScript scripts, shell tooling, tests, snapshots, and CI checks. No new dependency or tooling framework is planned.

## Commands

Use the owning project guidance and `pnpm docs:list`. Candidate validation: `pnpm format:check`, `pnpm check:agents-md-size`, relevant unit tests via the project’s runner, `pnpm check:workflows`, and `pnpm check` (confirm exact scope and environment feasibility before running).

## Project Structure

`AGENTS.md` and nested instructions; `.agents/skills/`; scripts; tests/fixtures/snapshots; generated catalogs, schemas, and metadata. Maintain canonical files and regenerate generated outputs using their owning scripts.

## Code Style

Keep instructions actionable, concise, and aligned with existing conventions; update canonical sources rather than duplicate rules. Example: use “Shardsclaw” for current product instructions while referring to “OpenClaw upstream” only for lineage, preserved compatibility identifiers, or exact historical context.

## Testing Strategy

Search all tracked text and pathnames, categorize remaining matches as active branding, required provenance/legal text, historical record, retained compatibility contract, or unrelated substring. Update active references and tests that assert branding; leave historical/legal/compatibility matches with documented justification. Run focused tests and generators/checks, ensuring no stale references are hidden by broad replacement or ignored directories.

## Boundaries

- Always: obey nearest scoped instructions; retain test intent; use canonical generators; preserve useful upstream procedural guidance that is not brand-specific.
- Ask first: removing upstream attribution, deleting/replacing skills or contribution processes, or changing test coverage unrelated to brand identity.
- Never: mass-replace strings in binary/generated/vendor content without understanding ownership; weaken checks to silence old-name findings; delete historical records to make scans clean.

## Success Criteria

1. Active maintainer materials teach contributors to build and publish Shardsclaw, not OpenClaw.
2. Remaining OpenClaw references have a clear, reviewed justification; file-path renames preserve all imports/workflow links.
3. Tests and generated assets/checks are updated consistently and pass where environment permits.
4. Changes remain brand-scoped and do not alter unrelated product behavior.

## Open Questions

Any repository-local skill or workflow that assumes access to the OpenClaw upstream organization, protected secrets, official service domains, or signing assets must be identified and left safely disabled/unmodified unless Shards-inc ownership and equivalent configuration are established.
