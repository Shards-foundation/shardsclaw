# Shardsclaw

<p align="center">
  <img src="ui/public/favicon.svg" alt="Shardsclaw faceted shard mark" width="160">
</p>

**Your assistant across the devices and channels you choose.**

Shardsclaw is an open-source, self-hosted AI assistant built around a Gateway. The Gateway connects the agent runtime with configured messaging channels, the Control UI, command-line tools, and supported companion apps. Model providers and extensions are configurable.

Shardsclaw is an independently maintained fork of [OpenClaw](https://github.com/openclaw/openclaw). This repository preserves upstream history and required copyright, license, author, and contributor attribution. Shardsclaw is not the OpenClaw Foundation’s official project, and this repository does not claim ownership of OpenClaw-hosted sites, downloads, community spaces, or services.

## Start here

- [Build and run from source](#build-from-source)
- [Installation and upgrade documentation](docs/install/index.md)
- [Gateway guide](docs/gateway/index.md)
- [Channels](docs/channels/index.md)
- [Control UI](docs/web/control-ui.md)
- [Security policy](SECURITY.md)

## Build from source

Use the Node.js and pnpm versions declared by this repository (`node-version.mjs` and `package.json`). A published Shardsclaw package or installer is not provided by this source checkout.

```bash
git clone https://github.com/Shards-inc/shardsclaw.git
cd shardsclaw
pnpm install --frozen-lockfile
pnpm build
pnpm ui:build
pnpm dev
```

For contribution and test instructions, see [CONTRIBUTING.md](CONTRIBUTING.md) and the owner guides in this repository.

## Compatibility

This rebrand does not rename existing installation data or wire contracts. Existing OpenClaw-compatible state and configuration names—including `.openclaw`, `openclaw.json`, `OPENCLAW_*` environment variables, and protocol/service identifiers—remain in place where required for compatibility. Do not rename an existing data directory or change those identifiers as part of a visual or package rebrand.

## Upstream attribution

Shardsclaw’s source and commit history derive from OpenClaw. Upstream copyright and author notices, the MIT license, historical release records, and contributor credit are retained; see [LICENSE](LICENSE) and the [OpenClaw upstream repository](https://github.com/openclaw/openclaw). Contributor and sponsor acknowledgments in the original project remain attributable to that project and are not represented as Shardsclaw sponsorship.

## License

The source is distributed under the MIT License. Keep the included license and third-party notices with any redistribution.
