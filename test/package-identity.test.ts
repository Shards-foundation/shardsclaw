import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

type PackageIdentity = {
  name: string;
  bin: Record<string, string>;
  homepage: string;
  bugs: { url: string };
  repository: { url: string };
  author: string;
  license: string;
};

function readPackageIdentity(): PackageIdentity {
  return JSON.parse(readFileSync("package.json", "utf8")) as PackageIdentity;
}

it("exposes Shardsclaw repository metadata and keeps the legacy OpenClaw command alias", () => {
  const manifest = readPackageIdentity();

  expect(manifest.bin).toMatchObject({
    shardsclaw: "openclaw.mjs",
    openclaw: "openclaw.mjs",
  });
  expect(manifest.homepage).toBe("https://github.com/Shards-inc/shardsclaw#readme");
  expect(manifest.bugs.url).toBe("https://github.com/Shards-inc/shardsclaw/issues");
  expect(manifest.repository.url).toBe("git+https://github.com/Shards-inc/shardsclaw.git");
  expect(manifest.author).toBe("OpenClaw Foundation (https://openclaw.org)");
  expect(manifest.license).toBe("MIT");
});

it("keeps the root package self-reference stable for internal workers", () => {
  expect(readPackageIdentity().name).toBe("openclaw");
});

it("identifies the source launcher as Shardsclaw on its version fast path", () => {
  const env = { ...process.env };
  delete env.OPENCLAW_CONTAINER;

  const output = execFileSync(process.execPath, ["openclaw.mjs", "--version"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env,
  });

  expect(output).toMatch(/^Shardsclaw \d{4}\.\d+\.\d+ \([0-9a-f]+\)\n$/u);
});
