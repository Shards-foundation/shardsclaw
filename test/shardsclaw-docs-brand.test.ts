import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

const docsIndex = readFileSync("docs/index.md", "utf8");
const docsConfig = JSON.parse(readFileSync("docs/docs.json", "utf8")) as {
  name: string;
  description: string;
};
const docsNavigation = (
  JSON.parse(readFileSync("docs/docs.json", "utf8")) as {
    navigation: {
      languages: Array<{ tabs: Array<{ tab: string; groups: Array<{ group: string }> }> }>;
    };
  }
).navigation.languages[0]?.tabs;
const contributing = readFileSync("CONTRIBUTING.md", "utf8");
const security = readFileSync("SECURITY.md", "utf8");
const issueConfig = readFileSync(".github/ISSUE_TEMPLATE/config.yml", "utf8");
const bugReport = readFileSync(".github/ISSUE_TEMPLATE/bug_report.yml", "utf8");
const docsBugReport = readFileSync(".github/ISSUE_TEMPLATE/docs_bug_report.yml", "utf8");
const gettingStarted = readFileSync("docs/start/getting-started.md", "utf8");
const installIndex = readFileSync("docs/install/index.md", "utf8");
const wizard = readFileSync("docs/start/wizard.md", "utf8");
const docsAgents = readFileSync("docs/AGENTS.md", "utf8");
const supportPage = readFileSync("docs/help/support.md", "utf8");
const helpIndex = readFileSync("docs/help/index.md", "utf8");
const faqIndex = readFileSync("docs/help/faq.md", "utf8");
const quickStartFaq = readFileSync("docs/help/faq-first-run/quick-start.md", "utf8");
const whyOpenClaw = readFileSync("docs/start/why-openclaw.md", "utf8");
const legacyIntro = readFileSync("docs/start/openclaw.md", "utf8");
const setupGuide = readFileSync("docs/start/setup.md", "utf8");
const installerGuide = readFileSync("docs/install/installer.md", "utf8");
const androidGuide = readFileSync("docs/platforms/android.md", "utf8");
const iosGuide = readFileSync("docs/platforms/ios.md", "utf8");
const gatewayTrustModel = readFileSync("docs/gateway/security/trust-model.md", "utf8");
const requestyGuide = readFileSync("docs/providers/requesty.md", "utf8");
const channelIndex = readFileSync("docs/channels/index.md", "utf8");
const pluginManagement = readFileSync("docs/plugins/manage-plugins.md", "utf8");
const windowsGuide = readFileSync("docs/platforms/windows.md", "utf8");
const linuxGuide = readFileSync("docs/platforms/linux.md", "utf8");
const scriptsAgents = readFileSync("scripts/AGENTS.md", "utf8");

it("presents the repository-owned documentation as Shardsclaw without upstream installers", () => {
  expect(docsConfig.name).toBe("Shardsclaw");
  expect(docsIndex).toContain("# Shardsclaw");
  expect(docsIndex).toContain("independently maintained fork of");
  expect(docsIndex).not.toContain("openclaw.ai/install.sh");
  expect(docsIndex).not.toContain("openclaw.ai/install.ps1");
});

it("routes Shardsclaw contributions to the confirmed project repository", () => {
  expect(contributing).toContain("https://github.com/Shards-inc/shardsclaw/issues");
  expect(contributing).toContain("Shardsclaw maintainers");
});

it("does not route Shardsclaw vulnerability reports to upstream contacts", () => {
  expect(security).toContain("Shardsclaw");
  expect(security).toContain("https://github.com/Shards-inc/shardsclaw/security/advisories/new");
  expect(security).not.toContain("security@openclaw.ai");
  expect(security).not.toContain("https://github.com/openclaw/openclaw/security/advisories/new");
});

it("routes issue intake to Shardsclaw and brands forms without renaming compatibility paths", () => {
  expect(issueConfig).toContain("https://github.com/Shards-inc/shardsclaw/issues/new/choose");
  expect(issueConfig).not.toContain("For official OpenClaw support");
  expect(bugReport).toContain("Shardsclaw version");
  expect(bugReport).toContain("~/.openclaw/openclaw.json");
  expect(bugReport).not.toContain("OpenClaw version");
  expect(docsBugReport).not.toContain("docs.openclaw.ai");
});

it("does not present upstream install scripts or packages as Shardsclaw onboarding", () => {
  for (const content of [docsIndex, gettingStarted, wizard]) {
    expect(content).not.toContain("https://openclaw.ai/install.sh");
    expect(content).not.toContain("https://openclaw.ai/install.ps1");
    expect(content).not.toContain("npx openclaw@latest");
  }
  expect(gettingStarted).toContain("https://github.com/Shards-inc/shardsclaw.git");
  expect(wizard).toContain("compatibility");
});

it("warns that inherited install instructions are OpenClaw upstream-only", () => {
  const sourceOnlyWarning = installIndex.indexOf(
    "does not publish a Shardsclaw installer or package",
  );
  expect(sourceOnlyWarning).toBeGreaterThanOrEqual(0);
  expect(sourceOnlyWarning).toBeLessThan(installIndex.indexOf("https://openclaw.ai/install.sh"));
});

it("labels inherited install pages as upstream-only in navigation", () => {
  expect(
    docsNavigation?.find((tab) => tab.tab === "Install")?.groups.map((group) => group.group),
  ).toContain("OpenClaw upstream installation reference (not Shardsclaw)");
});

it("does not describe the upstream docs website as a Shardsclaw publishing destination", () => {
  expect(docsAgents).toContain("not a Shardsclaw documentation site");
  expect(docsAgents).toContain("upstream OpenClaw only");
});

it("distinguishes upstream support and first-run downloads from Shardsclaw-owned routes", () => {
  expect(supportPage).toContain("not operated by Shardsclaw");
  expect(supportPage).toContain("Shardsclaw issue tracker");
  expect(supportPage).not.toContain("For official OpenClaw support");
  expect(helpIndex).toContain("not operated by Shardsclaw");
  expect(faqIndex).toContain("adapted from upstream OpenClaw documentation");
  expect(quickStartFaq).toContain("upstream-only");
});

it("does not present inherited mobile apps or hosted security contacts as Shardsclaw-owned", () => {
  expect(androidGuide).toContain("upstream OpenClaw");
  expect(iosGuide).toContain("upstream OpenClaw");
  expect(gatewayTrustModel).not.toContain("security@openclaw.ai");
  expect(gatewayTrustModel).toContain("Shardsclaw security policy");
});

it("does not send Shardsclaw provider requests with OpenClaw attribution", () => {
  expect(requestyGuide).not.toContain("https://openclaw.ai");
  expect(requestyGuide).not.toContain("X-Title: OpenClaw");
});

it("labels inherited governance and platform setup claims as upstream-only", () => {
  expect(whyOpenClaw).toContain("not a description or promise of Shardsclaw");
  expect(setupGuide).toContain("OpenClaw.app and published/global installs are upstream-only");
  expect(installerGuide).toContain("not a Shardsclaw installer");
  expect(installerGuide.indexOf("upstream-only")).toBeLessThan(
    installerGuide.indexOf("OpenClaw ships three installer scripts"),
  );
});

it("does not present upstream plugin ownership as a Shardsclaw official catalog", () => {
  expect(docsIndex).not.toContain("official plugins install on demand");
  expect(legacyIntro).toContain("upstream OpenClaw reference");
});

it("marks inherited channel packages, plugin packages, and desktop downloads as upstream-only", () => {
  expect(channelIndex).toContain("upstream OpenClaw package");
  expect(pluginManagement).toContain("This reference is inherited from upstream OpenClaw.");
  expect(windowsGuide).toContain("not Shardsclaw");
  expect(linuxGuide).toContain("not Shardsclaw");
});

it("routes active maintainer guidance to the Shardsclaw skill path", () => {
  for (const content of [contributing, scriptsAgents]) {
    expect(content).toContain("shardsclaw-pr-maintainer");
    expect(content).not.toContain("openclaw-pr-maintainer");
  }
});
