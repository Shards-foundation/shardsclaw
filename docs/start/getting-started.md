---
summary: "Build Shardsclaw from this source repository and run the local development Gateway."
read_when:
  - First time setup from zero
  - You want the fastest path to a working chat
title: "Getting started"
---

Build Shardsclaw from this source repository and run it locally. This guide does not use the Shardsclaw npm package or installer scripts.

## What you need

- **Node.js 24.16.0+ on 24.x, or 26.1.0+** (Node 26 is recommended; use 24.22.1+/26.12.1+ for the security fixes)
- **An existing Claude Code or Codex CLI login, or a provider API key** — onboarding can reuse it

<Tip>
Check your Node version with `node --version`.
**Windows users:** the native Windows Hub app is the easiest desktop path. The
PowerShell installer and WSL2 Gateway paths are also supported. See [Windows](/platforms/windows).
Need to install Node? See [Node setup](/install/node).
</Tip>

## Build and run from source

Shardsclaw does not publish a package or installer from this source repository. Use the versions declared by the checkout's `package.json` and `node-version.mjs`.

```bash
git clone https://github.com/Shards-inc/shardsclaw.git
cd shardsclaw
pnpm install --frozen-lockfile
pnpm build
pnpm ui:build
pnpm dev
```

This builds the repository's development runtime. To invoke the CLI from the checkout, use `pnpm openclaw -- <command>`. The `shardsclaw` executable is the preferred installed name; the existing `openclaw` command and `.openclaw` configuration/state paths remain for compatibility.

For the CLI onboarding flow, see [Onboarding (CLI)](/start/wizard). Use `shardsclaw` where installed; use `pnpm openclaw -- onboard` from the source checkout.

<Accordion title="Advanced: mount a custom Control UI build">
  If you maintain a localized or customized dashboard build, point
  `gateway.controlUi.root` to a directory that contains your built static
  assets and `index.html`.

```bash
mkdir -p "$HOME/.openclaw/control-ui-custom"
# Copy your built static files into that directory.
```

Then set:

```json
{
  "gateway": {
    "controlUi": {
      "enabled": true,
      "root": "${HOME}/.openclaw/control-ui-custom"
    }
  }
}
```

Restart the gateway and reopen the dashboard with the `shardsclaw` CLI.

```bash
shardsclaw gateway restart
shardsclaw dashboard
```

</Accordion>

<Note>
The troubleshooting and reference pages below may show the legacy `openclaw` command or `OPENCLAW_*` environment variables. Those names remain supported for compatibility; Shardsclaw does not rename existing `.openclaw` user data.
</Note>

## If setup does not work

One command turns the current state of your install into a diagnosis you can act on:

```bash
shardsclaw triage
```

It runs read-only health checks, writes a sanitized prompt describing what it found, and then offers to hand that prompt to a coding agent it detects on your machine — Claude Code, Codex CLI, or the built-in Shardsclaw agent — so the agent starts with the diagnosis already loaded. Pick "just print the commands" if you would rather run the handoff yourself.

Nothing leaves your machine until you choose an agent, and secrets, tokens, raw chat payloads, and raw logs are excluded from the prompt.

To read the findings yourself instead, run [`shardsclaw doctor`](/cli/doctor). For symptom-first routes, see [Troubleshooting](/help/troubleshooting).

## What to do next

<Columns>
  <Card title="Connect a channel" href="/channels" icon="message-square">
    Discord, Feishu, iMessage, Matrix, Microsoft Teams, Signal, Slack, Telegram, WhatsApp, Zalo, and more.
  </Card>
  <Card title="Pairing and safety" href="/channels/pairing" icon="shield">
    Control who can message your agent.
  </Card>
  <Card title="Configure the Gateway" href="/gateway/configuration" icon="settings">
    Models, tools, sandbox, and advanced settings.
  </Card>
  <Card title="Browse tools" href="/tools" icon="wrench">
    Browser, exec, web search, skills, and plugins.
  </Card>
</Columns>

<Accordion title="Advanced: environment variables">
  If you run Shardsclaw as a service account or want custom paths:

- `OPENCLAW_HOME` — home directory for internal path resolution
- `OPENCLAW_STATE_DIR` — override the state directory
- `OPENCLAW_CONFIG_PATH` — override the config file path

Full reference: [Environment variables](/help/environment).
</Accordion>

## Related

- [Install overview](/install)
- [Channels overview](/channels)
- [Setup](/start/setup)
- [Personal assistant setup](/start/openclaw) - end-to-end guide to a dedicated number that behaves like an always-on assistant
- [Triage](/cli/triage)
- [Troubleshooting](/help/troubleshooting)
- [Get support](/help/support) - external OpenClaw upstream support and reporting routes, not operated by Shardsclaw
