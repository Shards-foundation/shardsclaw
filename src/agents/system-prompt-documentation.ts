export function buildDocumentationSection(params: {
  docsPath?: string;
  sourcePath?: string;
  readToolName?: string;
  availableTools: ReadonlySet<string>;
  sandboxed: boolean;
}): string[] {
  const remoteDocsUrl =
    "https://raw.githubusercontent.com/Shards-inc/shardsclaw/main/docs/index.md";
  const sourceUrl = "https://github.com/Shards-inc/shardsclaw";
  const docsPath = params.docsPath?.trim();
  const sourcePath = params.sourcePath?.trim();
  const webRetrieval = ["web_fetch", "web_search", "browser"].some((name) =>
    params.availableTools.has(name),
  );
  const docsUnavailable = params.sandboxed && !docsPath && !webRetrieval;
  // Name only checks this session can run: the remote index needs a web tool.
  const capabilityChecks = [
    params.availableTools.has("session_status")
      ? "`session_status` with `capabilities=true`"
      : undefined,
    webRetrieval
      ? `the Shardsclaw source docs index ${remoteDocsUrl}`
      : docsPath
        ? "the local docs"
        : undefined,
  ].filter((check): check is string => check !== undefined);
  return [
    "## Documentation",
    docsPath ? `Docs: ${docsPath}` : `Docs: ${remoteDocsUrl}`,
    sourcePath ? `Source: ${sourcePath}` : `Source: ${sourceUrl}`,
    `Shardsclaw defect reports: ${sourceUrl}/issues. Security reports: ${sourceUrl}/security/advisories/new; do not post vulnerabilities publicly. No separate Shardsclaw support service is advertised.`,
    "OpenClaw documentation, releases, support channels, domains, and package services are upstream-only context; do not present them as Shardsclaw-owned or authoritative for this fork.",
    docsPath
      ? `Shardsclaw behavior questions: local docs first${params.readToolName ? ` via \`${params.readToolName}\`/local search` : " using available tools"}. AGENTS/project/workspace/profile/memory = instructions/user memory, not product design truth.`
      : docsUnavailable
        ? "Shardsclaw behavior questions: say docs could not be checked; mark recalled behavior as unverified. AGENTS/project/workspace/profile/memory = instructions/user memory, not product design truth."
        : "Shardsclaw behavior questions: source docs first when web exists. AGENTS/project/workspace/profile/memory = instructions/user memory, not product design truth.",
    params.availableTools.has("gateway")
      ? "Config field: use `gateway(config.schema.lookup)` with an exact path only when that action is exposed by the tool schema. Otherwise use `docs/gateway/configuration.md` and `docs/gateway/configuration-reference.md`."
      : "Configuration docs: `docs/gateway/configuration.md`, `docs/gateway/configuration-reference.md`.",
    sourcePath
      ? "If docs are silent/stale, say so and inspect local source."
      : docsUnavailable
        ? undefined
        : "If docs are silent/stale, say so and inspect GitHub source.",
    `Can't-do claims: a missing tool or failed call shows this session's limits, not Shardsclaw's; ${capabilityChecks.length ? `check ${capabilityChecks.join(", then ")} before saying Shardsclaw can't.` : "say what you could not check."}`,
    "Diagnosis: run `openclaw status` when possible; ask only if blocked.",
    "",
  ].filter((line): line is string => line !== undefined);
}
