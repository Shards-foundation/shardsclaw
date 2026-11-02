import type { TranslationMap } from "../lib/types.ts";
import { en } from "./en.ts";

const shared = en.aboutPage;

const enAbout = {
  aboutPage: {
    productName: "Shardsclaw",
    tagline: "Your assistant, on your devices and configured channels.",
    waveHello: "Meet Shardsclaw",
    linksLabel: "Shardsclaw project links",
    linkWebsite: "Project",
    linkDocs: "Documentation",
    linkSupport: "Issues and support",
    linkGitHub: "GitHub",
    linkDiscord: "Discord",
    linkX: "X (Twitter)",
    linkChangelog: "Releases",
    license: "© 2026 OpenClaw Foundation — MIT License.",
    artifactTitle: "Control UI",
    artifactSubtitle: "Identity embedded when this browser artifact was built.",
    artifactDetails: shared.artifactDetails,
    version: "Version",
    commit: shared.commit,
    branch: "Branch",
    built: shared.built,
    unavailable: shared.unavailable,
    copyCommit: shared.copyCommit,
    copyingCommit: "Copying commit hash",
    copiedCommit: shared.copiedCommit,
    copyCommitFailed: "Could not copy commit hash",
    gateway: shared.gateway,
    gatewayVersion: "Connected Gateway version",
    gatewayVersionHint:
      "Reported by the active Gateway connection; separate from this Control UI build.",
  },
} satisfies TranslationMap;

export const registerAboutEnglish = Object.assign(
  () => {
    Object.assign(en.aboutPage, enAbout.aboutPage);
  },
  { catalog: enAbout },
);
