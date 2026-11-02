import { readFileSync, readdirSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
import { expect, it } from "vitest";

const mark = readFileSync("ui/public/favicon.svg", "utf8").match(
  /<svg\b[^>]*>([\s\S]*?)<\/svg>/u,
)?.[1];

if (!mark) {
  throw new Error("The canonical Shardsclaw SVG mark could not be read.");
}

function renderExpectedIcon(size: number, background: string | null, scale: number) {
  const offset = (120 * (1 - scale)) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 120 120">${background ? `<rect width="120" height="120" fill="${background}"/>` : ""}<g transform="translate(${offset} ${offset}) scale(${scale})">${mark}</g></svg>`;
  return Buffer.from(new Resvg(svg).render().asPng());
}

const androidResourceRoot = "apps/android/app/src/main/res";
const androidLocalizedBrandStrings = [
  `${androidResourceRoot}/values/strings.xml`,
  ...readdirSync(androidResourceRoot)
    .filter((entry) => entry.startsWith("values-"))
    .map((entry) => `${androidResourceRoot}/${entry}/strings.xml`),
].flatMap((file) => {
  let xml: string;
  try {
    xml = readFileSync(file, "utf8");
  } catch {
    return [];
  }
  return [
    ...xml.matchAll(
      /<string name="(app_name|about_build_commit_clipboard_label|about_build_timestamp_clipboard_label)"[^>]*>(.*?)<\/string>/gs,
    ),
  ].map(([, key, value]) => ({ file, key, value }));
});

it("ships the Shardsclaw mark in Android's high-density legacy launcher icon", () => {
  expect(readFileSync("apps/android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png")).toEqual(
    renderExpectedIcon(144, "#0D1628", 0.82),
  );
});

it("ships a transparent Shardsclaw mark in Android's adaptive foreground", () => {
  expect(
    readFileSync("apps/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png"),
  ).toEqual(renderExpectedIcon(432, null, 0.66));
});

it("ships the Shardsclaw mark as the iOS marketing icon", () => {
  expect(readFileSync("apps/ios/Sources/Assets.xcassets/AppIcon.appiconset/1024.png")).toEqual(
    renderExpectedIcon(1024, "#0D1628", 0.82),
  );
});

it("uses Shardsclaw in Android display and build-attribution labels across locales", () => {
  const appNames = androidLocalizedBrandStrings.filter(({ key }) => key === "app_name");
  const staleBrandLabels = androidLocalizedBrandStrings.filter(({ value }) =>
    /OpenClaw/i.test(value),
  );

  expect(appNames.length).toBeGreaterThan(1);
  expect(appNames.every(({ value }) => /^Shardsclaw(?:\s|[-])/u.test(value))).toBe(true);
  expect(staleBrandLabels).toEqual([]);
});
