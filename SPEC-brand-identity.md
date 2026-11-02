# Spec: Shardsclaw Brand Identity

## Objective

Establish a coherent Shardsclaw product identity across repository-level metadata and first-party visual assets. The visible product name is **Shardsclaw** and the CLI/package spelling is `shardsclaw`. Keep product behavior unchanged and preserve required copyright, license, and upstream-origin notices.

## Tech Stack

Existing TypeScript/Node.js monorepo with pnpm; native apps include Swift/iOS/macOS, Kotlin/Android, and Linux UI assets. Visual assets and generated resources follow existing project pipelines.

## Commands

Baseline and focused validation: `pnpm format:check`; relevant asset-generation/check commands identified from repository scripts and owning docs during implementation. Full repository validation is selected after the change inventory is known; no publishing command is in scope.

## Project Structure

Root metadata and README; `docs/assets/` brand banners and hero imagery; `apps/` platform-specific icons and artwork; UI assets and generated asset pipelines. Update canonical sources and regenerate derived assets rather than hand-editing generated output.

## Code Style

Keep public copy in the project’s existing American English style and use consistent casing: “Shardsclaw” for the product, `shardsclaw` for executable/package/config identifiers, and “OpenClaw” only where a factual upstream/legal/provenance reference is necessary. Example: “Build Shardsclaw from this source checkout with `pnpm install --frozen-lockfile && pnpm build`.” Do not claim Shardsclaw authored upstream history or imply an npm package is published.

## Testing Strategy

Inventory image dimensions/formats and brand asset use before edits. Verify all referenced assets exist, render representative README/docs/app assets, run asset generation/checks, formatting, and focused existing brand tests. Add/update tests only where an existing test contract asserts old product branding. Scan for residual old names and review each match against an explicit allowlist for legal notices, historical records, or compatibility identifiers.

## Boundaries

- Always: preserve license/copyright and truthful upstream provenance; maintain image formats, dimensions, and asset-generation conventions; do not change product behavior.
- Ask first: new brand design direction, new asset-generation dependency, or asset licensing/source decision not supplied by existing assets.
- Never: erase upstream attribution, represent upstream releases as Shardsclaw-authored, or hand-edit generated assets when a canonical source exists.

## Success Criteria

1. Repository-facing product copy and canonical visual identity use Shardsclaw consistently.
2. Required notices and historically accurate provenance remain intact.
3. All replaced assets are valid, referenced, and generated through the project’s canonical process.
4. Existing brand-related checks pass or any environment limitation is documented.

## Open Questions

Rights decision: the [official OpenClaw brand-kit source](https://github.com/openclaw/carapace/tree/main/brand-kit) and [Carapace rights guidance](https://carapace.design/resources/brand-and-assets/) state that public availability is not a redistribution license and prohibit copying logos, mascot artwork, photos, or illustrations without recorded permission. Do not adapt or redistribute those assets without permission. The user approved an original faceted shard-and-claw mark in midnight blue, electric teal, and silver; do not use a lobster mascot or imitate OpenClaw artwork.
