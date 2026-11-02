# Spec: Shardsclaw Runtime Identifiers

## Objective

Move active, user-visible and distribution-facing runtime identifiers to Shardsclaw where a safe, supported transition exists, including package/CLI identity and generated metadata. Preserve existing installations, configuration, credentials, user data, protocol interoperability, and upgrade paths. Compatibility names may remain as explicit aliases or storage/protocol identifiers where changing them would break users or clients.

## Tech Stack

TypeScript/Node.js ESM with pnpm; generated package/build metadata; Rust crates and Swift/Kotlin/Linux native projects; project-owned config/state migration and compatibility contracts.

## Commands

Inspect project validation guidance with `pnpm docs:list`. Candidate baseline commands: `pnpm check`, `pnpm format:check`, `pnpm test` (if defined; confirm exact script in package.json), `pnpm build:package`, plus owner-specific generator checks. Native build commands are platform-dependent and will be attempted only where prerequisites exist.

## Project Structure

Root `package.json` and lockfiles; CLI entry points; `src/` config, state, and runtime owners; `apps/` native identifiers and display names; `crates/`; schemas/generated outputs; tests and scripts. Exact owners and downstream callers must be inventoried before changes.

## Code Style

Follow the existing strict ESM/TypeScript and native-language conventions. Example compatibility contract: `shardsclaw` is the preferred new command; an `openclaw` alias is retained only if existing users or documented integrations need it, with both routed to one implementation rather than divergent code paths.

## Testing Strategy

Before editing, inventory package names, executable aliases, config/environment variable prefixes, state paths, app bundle/package identifiers, service names, protocol fields, OAuth/callback identifiers, generated metadata, and tests. For every identifier, classify it as display-only, new-install name, persistent-data key/path, external integration contract, or legal/historical reference. Test clean install/build, existing config/state discovery, migration/alias behavior where applicable, generated-file checks, and key command invocations. Do not rename a persistent or externally registered identifier without proving backward compatibility and control of the destination.

## Boundaries

- Always: preserve existing user data and safe upgrade behavior; keep protocol compatibility; update generated artifacts via their generator; keep behavior unchanged except the intended brand/alias.
- Ask first: destructive config/state migration, app signing/store identity change, registered OAuth/service-domain changes, external package publication, added dependency, or any breaking public identifier change.
- Never: delete old state, change a production endpoint, rotate secrets, publish a package, or strand existing users by changing an identifier without a verified migration.

## Success Criteria

1. New-install user-facing package/CLI identity is Shardsclaw wherever technically safe.
2. Existing OpenClaw configuration, state, credentials, and integrations remain discoverable/usable; tests prove the compatibility path.
3. No competing implementations or stale generated metadata remain.
4. Platform-specific limitations and any deliberately retained legacy identifiers are recorded with reasons.

## Open Questions

During inventory, determine which bundle identifiers and external identifiers are controlled by Shards-inc versus third parties. Keep such identifiers unchanged unless ownership and migration can be proven; do not assume repository access grants control of app-store, OAuth, domain, or package-registry records.
