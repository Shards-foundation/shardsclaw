// @vitest-environment node
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { loadControlUiSourceCatalog } from "../../../../scripts/lib/control-ui-i18n-catalog.ts";
import {
  flattenTranslations,
  type TranslationMap,
} from "../../../../scripts/lib/control-ui-i18n-sync-plan.ts";
import { getLazyLocaleCatalog } from "./locale-catalog.ts";
import { loadLazyLocaleTranslation } from "./registry.ts";

const legacyCliCommand =
  /\bopenclaw\s+(?:triage|devices|config|node|agents|gateway|doctor|dashboard|status|users|crabbox|browser|plugins|update)\b/iu;
const appPageLabels = [
  "appsPage.ctaSourceCode",
  "appsPage.ctaUpstreamSource",
  "appsPage.linkRepository",
  "appsPage.linkIssues",
] as const;

it("keeps translated Control UI brand copy aligned with Shardsclaw English sources", async () => {
  const sourceCatalog = loadControlUiSourceCatalog();
  const sourceFlat = flattenTranslations(sourceCatalog);
  const brandedSourceEntries = [...sourceFlat.entries()].filter(
    ([, source]) => /\bShardsclaw\b/iu.test(source) && !/\bOpenClaw\b/iu.test(source),
  );
  const locales = JSON.parse(
    readFileSync("scripts/lib/control-ui-i18n-config.json", "utf8"),
  ) as Array<{ locale: string }>;
  const fallbackBaseline = JSON.parse(
    readFileSync("ui/src/i18n/.i18n/catalog-fallbacks.json", "utf8"),
  ) as { fallbacks: Record<string, string[]> };
  const translationDrift: string[] = [];

  for (const { locale } of locales) {
    const catalog = await loadLazyLocaleTranslation(locale);
    if (!catalog) {
      translationDrift.push(`${locale}: locale catalog not loaded`);
      continue;
    }
    const lazyCatalog = getLazyLocaleCatalog(catalog as TranslationMap);
    const namespaces = new Set(brandedSourceEntries.map(([key]) => key.split(".", 1)[0]!));
    await Promise.all([...namespaces].map((namespace) => lazyCatalog?.load(namespace)));
    const translatedFlat = flattenTranslations(catalog as TranslationMap);
    const approvedFallbackKeys = new Set(
      Object.entries(fallbackBaseline.fallbacks)
        .filter(([, fallbackLocales]) => fallbackLocales.includes(locale))
        .map(([key]) => key),
    );
    for (const [key] of brandedSourceEntries) {
      const translated = translatedFlat.get(key);
      if (translated === undefined) {
        if (!approvedFallbackKeys.has(key)) {
          translationDrift.push(`${locale}:${key}: missing translation`);
        }
        continue;
      }
      if (/\bOpenClaw(?:s)?\b/iu.test(translated) || legacyCliCommand.test(translated)) {
        translationDrift.push(`${locale}:${key}: ${translated}`);
      }
    }
  }

  expect(translationDrift, translationDrift.slice(0, 20).join("\n")).toEqual([]);
});

it("provides locale translations for the source-build app-page links", async () => {
  const locales = JSON.parse(
    readFileSync("scripts/lib/control-ui-i18n-config.json", "utf8"),
  ) as Array<{ locale: string }>;
  const missing: string[] = [];
  for (const { locale } of locales) {
    const catalog = await loadLazyLocaleTranslation(locale);
    if (!catalog) {
      missing.push(`${locale}: locale catalog not loaded`);
      continue;
    }
    await getLazyLocaleCatalog(catalog as TranslationMap)?.load("appsPage");
    const translatedFlat = flattenTranslations(catalog as TranslationMap);
    for (const key of appPageLabels) {
      if (!translatedFlat.has(key)) missing.push(`${locale}:${key}: missing translation`);
    }
  }
  expect(missing, missing.slice(0, 20).join("\n")).toEqual([]);
});

it("keeps the current Swedish Anthropic runtime translation on the Shardsclaw name", () => {
  const key = "chat.modelControls.routes.anthropicApi.detail";
  const source = flattenTranslations(loadControlUiSourceCatalog()).get(key);
  const entries = readFileSync("ui/src/i18n/.i18n/sv.tm.jsonl", "utf8")
    .split("\n")
    .filter(Boolean)
    .map(
      (line) =>
        JSON.parse(line) as {
          segment_id: string;
          segment_ids?: string[];
          text: string;
          translated: string;
        },
    );
  const current = entries.find(
    (entry) =>
      (entry.segment_id === key || entry.segment_ids?.includes(key)) && entry.text === source,
  );
  expect(
    current,
    "the Swedish catalog needs a translation for the current English source",
  ).toBeDefined();
  expect(current?.translated).toContain("Shardsclaw");
  expect(current?.translated).not.toMatch(/\bOpenClaw(?:s)?\b/iu);
});
