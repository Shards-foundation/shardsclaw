// @vitest-environment node
import { createEffect, createRoot, flush } from "@solidjs/signals";
import { expect, it, vi } from "vitest";
import { registerEnglishCatalog, t } from "../../lib/reactive/i18n.ts";
import { registerBoardDocumentEnglish } from "../locales/en-board-document.ts";
import { registerBoardWebsiteEnglish } from "../locales/en-board-website.ts";
import { registerBoardEnglish } from "../locales/en-board.ts";
import { registerBrowserEnglish } from "../locales/en-browser.ts";
import { registerChatSessionEnglish } from "../locales/en-chat-session.ts";
import { en } from "../locales/en.ts";
import { loadLazyLocaleTranslation } from "./registry.ts";
import { captureI18nStateForTesting } from "./translate.test-support.ts";
import { i18n } from "./translate.ts";

const englishLocaleModules = import.meta.glob("../locales/en-*.ts", { eager: true }) as Record<
  string,
  Record<string, unknown>
>;

function collectMessageStrings(value: unknown, seen = new WeakSet<object>()): string[] {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectMessageStrings(entry, seen));
  }
  if (!value || typeof value !== "object" || seen.has(value)) {
    return [];
  }
  seen.add(value);
  return Object.values(value).flatMap((entry) => collectMessageStrings(entry, seen));
}

const englishMessageStrings = [
  ...collectMessageStrings(en),
  ...Object.values(englishLocaleModules).flatMap((module) =>
    Object.values(module).flatMap((exported) => {
      if (typeof exported !== "function" || !("catalog" in exported)) {
        return [];
      }
      return collectMessageStrings((exported as { catalog: unknown }).catalog);
    }),
  ),
];

vi.hoisted(() => vi.resetModules());

it("registers shared session copy before optional copy while preserving namespace identities", async () => {
  const restoreI18n = captureI18nStateForTesting();
  const details = en.chat.sessionDetails;
  const diff = en.chat.sessionDiff;
  const agentUpdate = en.chat.pendingInputs.agentUpdate;
  const suggestionState = en.chat.sessionSuggestions.state;
  try {
    await i18n.setLocale("en");
    expect(t("chat.sessionDetails.progressOptions")).toBe("Task progress options");
    expect(t("chat.sessionDiff.title")).toBe("Changes");
    expect(t("chat.activityPills.label")).toBe("chat.activityPills.label");

    registerEnglishCatalog(registerChatSessionEnglish);
    expect(t("chat.savedConversation", { status: "Reconnecting…" })).toBe(
      "Saved conversation · Reconnecting…",
    );
    expect(en).toMatchObject(registerChatSessionEnglish.catalog);
    expect(t("chat.activityPills.label")).toBe("chat.activityPills.label");
    expect(t("chat.sessionDiff.modeUnified")).toBe("chat.sessionDiff.modeUnified");
    expect(t("chat.workspaceFiles.showFiles")).toBe("Show session files");
    const { registerChatSessionOptionalEnglish } =
      await import("../locales/en-chat-session-optional.ts");
    registerEnglishCatalog(registerChatSessionOptionalEnglish);
    expect(t("chat.activityPills.label")).toBe("Session activity");
    expect(t("chat.sessionDiff.modeUnified")).toBe("Unified");
    expect(en.chat.sessionDetails).toBe(details);
    expect(en.chat.sessionDiff).toBe(diff);
    expect(en.chat.pendingInputs.agentUpdate).toBe(agentUpdate);
    expect(en.chat.sessionSuggestions.state).toBe(suggestionState);
  } finally {
    await restoreI18n();
  }
});

it("keeps the browser translation key stable while branding its visible label", () => {
  const browserCatalog = registerBrowserEnglish.catalog as { browser: Record<string, string> };
  expect(browserCatalog.browser.openWithinOpenClaw).toBe("Open in Shardsclaw");
});

it.each([
  {
    register: registerBoardDocumentEnglish,
    activeKey: "kindWebsite",
    activeText: "Webseite",
    fallbackKey: "kindReport",
    fallbackText: "Report",
  },
  {
    register: registerBoardWebsiteEnglish,
    activeKey: "websiteOpen",
    activeText: "Webseite öffnen",
    fallbackKey: "websiteEmbedHint",
    fallbackText: "If this site does not load here, open it in a new tab.",
  },
  {
    register: registerBoardEnglish,
    activeKey: "appLoading",
    activeText: "App wird wiederhergestellt…",
    fallbackKey: "errorDetail",
    fallbackText: "The problem is contained to this card.",
  },
])(
  "invalidates public t for lazy $activeKey fallback without replacing active translations",
  async ({ register, activeKey, activeText, fallbackKey, fallbackText }) => {
    const install = vi.fn(register);
    const restoreI18n = captureI18nStateForTesting();
    const originalGerman = await loadLazyLocaleTranslation("de");
    const widget = en.board.widget;
    const labels: (readonly string[])[] = [];
    let dispose = () => {};
    try {
      i18n.registerTranslation("de", { board: { widget: { [activeKey]: activeText } } });
      await i18n.setLocale("de");
      dispose = createRoot((stop) => {
        createEffect(
          () => [t(`board.widget.${activeKey}`), t(`board.widget.${fallbackKey}`)],
          (value) => {
            labels.push(value);
          },
        );
        return stop;
      });
      flush();
      expect(labels).toEqual([[activeText, `board.widget.${fallbackKey}`]]);

      registerEnglishCatalog(install);
      flush();
      expect(labels.at(-1)).toEqual([activeText, fallbackText]);
      expect(en.board.widget).toBe(widget);
      const count = labels.length;
      registerEnglishCatalog(install);
      flush();
      expect(labels).toHaveLength(count);
      expect(install).toHaveBeenCalledTimes(1);
    } finally {
      dispose();
      if (originalGerman) {
        i18n.registerTranslation("de", originalGerman);
      }
      await restoreI18n();
    }
  },
);

function isKnownExternalOpenClawReference(message: string): boolean {
  return (
    /\b(upstream|compatible)\b/iu.test(message) ||
    /\bOpenClaw Foundation\b/iu.test(message) ||
    /\bOpenClaw upstream project\b/iu.test(message) ||
    /\b(?:Official )?OpenClaw mobile (?:app|apps|pairing)\b/iu.test(message) ||
    /\bOpenClaw release track\b/iu.test(message) ||
    /\bOpenClaw APIs?\b/iu.test(message) ||
    /\bOpenClaw app and CLI\b/iu.test(message) ||
    /\bOpenClaw (?:extension|CLI)\b/iu.test(message) ||
    /\b(?:Chrome|Chrome Web Store)[^.!?]*\bOpenClaw\b/iu.test(message) ||
    /\bOpenClaw\b[^.!?]*\b(?:Chrome|Chrome Web Store)\b/iu.test(message) ||
    /\bexternal OpenClaw CLI\b/iu.test(message) ||
    /\bremote OpenClaw browser profile\b/iu.test(message)
  );
}

it("keeps Shardsclaw as the English Control UI identity while preserving upstream references", () => {
  const unqualifiedUpstreamBrand = englishMessageStrings.filter(
    (message) => /\bOpenClaw\b/u.test(message) && !isKnownExternalOpenClawReference(message),
  );
  const unqualifiedUpstreamCliExamples = englishMessageStrings.filter(
    (message) =>
      /\bopenclaw\s+(?:triage|devices|config|node|agents|gateway|doctor|dashboard|status|users|crabbox|browser|plugins|update)\b/iu.test(
        message,
      ) && !isKnownExternalOpenClawReference(message),
  );

  expect(unqualifiedUpstreamBrand.length).toBe(0);
  expect(unqualifiedUpstreamCliExamples.length).toBe(0);
  expect(englishMessageStrings).toContain("Connect to Shardsclaw");
});
