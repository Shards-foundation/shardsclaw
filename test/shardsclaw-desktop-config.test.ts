import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

const config = JSON.parse(readFileSync("apps/linux/src-tauri/tauri.conf.json", "utf8")) as {
  productName: string;
  identifier: string;
  app: { windows: Array<{ title: string }> };
  bundle: {
    createUpdaterArtifacts?: boolean;
    shortDescription: string;
  };
  plugins?: { updater?: { endpoints?: string[]; pubkey?: string } };
};

it("identifies the Linux companion as Shardsclaw without changing its installed-app identifier", () => {
  expect(config.productName).toBe("Shardsclaw");
  expect(config.identifier).toBe("ai.openclaw.linux");
  expect(config.app.windows[0]?.title).toBe("Shardsclaw");
  expect(config.bundle.shortDescription).toBe("Shardsclaw Linux companion");
});

it("does not request OpenClaw-signed updates or build their updater artifacts", () => {
  expect(config.plugins?.updater?.endpoints ?? []).toEqual([]);
  expect(config.plugins?.updater?.pubkey).toBeUndefined();
  expect(config.bundle.createUpdaterArtifacts).toBe(false);
});
