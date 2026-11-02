# Capability Map: Shardsclaw Rebrand

| Module id             | Responsibility                                                                                                                                                                                                                                  | Depends on                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `brand-identity`      | Shardsclaw naming, visual identity, repository-facing metadata, logos/icons and public copy                                                                                                                                                     | —                                                                                |
| `runtime-identifiers` | Package/CLI identifiers, app/service names, configuration/environment identifiers, and generated runtime metadata; preserve existing user data and working compatibility paths unless a safe migration is explicitly specified                  | `brand-identity`                                                                 |
| `public-surface`      | README and repository-owned English docs, examples, UI/help copy, release/install guidance, and repo-facing URLs; do not edit upstream-owned website or generated translations; retain truthful upstream attribution and required legal notices | `brand-identity`, `runtime-identifiers`                                          |
| `delivery-operations` | CI workflows, release/update/distribution settings, repository automation and ownership/config references; ensure Shardsclaw publishing targets only the new repo and do not publish binaries/packages or change live services                  | `runtime-identifiers`                                                            |
| `maintainer-tooling`  | Internal contributor instructions, skills, scripts, tests, fixtures, and checks that encode the old brand, preserving useful upstream history/provenance                                                                                        | `brand-identity`, `runtime-identifiers`, `public-surface`, `delivery-operations` |

Build order: `brand-identity` → `runtime-identifiers` → (`public-surface`, `delivery-operations`) → `maintainer-tooling`.

## Shared constraints

- The deliverable is a Shardsclaw-branded source repository published to `Shards-inc/shardsclaw`; upstream `openclaw/openclaw` is read-only and must never be a push target.
- Preserve the cloned Git history.
- Preserve required licenses, copyright notices, and truthful statements of upstream origin; do not rewrite old changelog entries as though Shardsclaw authored upstream releases.
- Do not alter product behavior unrelated to branding.
- Preserve existing user data and provide compatibility for pre-existing OpenClaw installations wherever a rename would otherwise strand configuration, credentials, state, or upgrades. Do not remove old aliases until migration safety is established.
- Do not publish packages, binaries, app-store releases, deployments, or contact external services as part of this task.
- Verify changes with focused brand scans, generated-file consistency checks, and project checks feasible in this environment. Clearly report unavailable native-platform gates.

## Detailed specifications

- [SPEC-brand-identity.md](SPEC-brand-identity.md)
- [SPEC-runtime-identifiers.md](SPEC-runtime-identifiers.md)
- [SPEC-public-surface.md](SPEC-public-surface.md)
- [SPEC-delivery-operations.md](SPEC-delivery-operations.md)
- [SPEC-maintainer-tooling.md](SPEC-maintainer-tooling.md)
