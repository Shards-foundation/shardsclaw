---
summary: "Shardsclaw self-service guidance and repository issue and security reporting routes"
read_when:
  - You need help with Shardsclaw setup or a problem the docs did not resolve
  - You want to know where to ask for support or report a bug
  - You are preparing diagnostics to share
title: "Get support"
---

Shardsclaw is an independently maintained fork. The OpenClaw community site is an
upstream resource and is **not operated by Shardsclaw**; this repository does not
advertise a separate support service. For reproducible Shardsclaw defects, use the
[Shardsclaw issue tracker](https://github.com/Shards-inc/shardsclaw/issues).

## Start with self-service help

- [Getting started](/start/getting-started) for installation and onboarding.
- [Troubleshooting](/help/troubleshooting) for a symptom-first diagnosis.
- [FAQ](/help/faq) for common setup and operational questions.
- [Gateway troubleshooting](/gateway/troubleshooting) for connection and service issues.

If those guides do not resolve your problem, check the Shardsclaw issue tracker
for project-specific reports. Upstream OpenClaw community channels may discuss
the upstream project, but are not Shardsclaw support or a place to assume fork
maintainer response.

## What to include

Describe what you were trying to do, what happened, what you expected, and the smallest steps that reproduce the problem. Include your Shardsclaw source revision, operating system, build method, and relevant error text.

Useful diagnostics include:

```bash
openclaw status --all
openclaw gateway status --deep
```

[Shardsclaw triage](/cli/triage) can collect a diagnosis and support archive. Review all diagnostics, screenshots, and archives before posting: remove credentials, tokens, private messages, and other personal information. Do not post your full configuration or state directory.

## Bugs and security reports

- **Reproducible Shardsclaw defects and documentation bugs:** use the [Shardsclaw issue chooser](https://github.com/Shards-inc/shardsclaw/issues/new/choose), with reproduction steps and relevant evidence.
- **Security vulnerabilities:** follow the private reporting instructions in the [Shardsclaw security policy](https://github.com/Shards-inc/shardsclaw/blob/main/SECURITY.md). Do not post vulnerability details in public support topics or public GitHub issues.
