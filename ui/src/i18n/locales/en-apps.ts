import type { TranslationMap } from "../lib/types.ts";
import { en } from "./en.ts";

const enApps = {
  appsPage: {
    heroTitle: "Build Shardsclaw for your devices",
    heroTagline:
      "Source for the mobile, watch, and desktop companions lives in this repository. Shardsclaw app-store listings and signed binary releases are not provided here.",
    sectionMobile: "On your phone",
    havePhone: "Already have the app?",
    pairDevice: "Pair your device",
    sectionWatch: "On your wrist",
    sectionDesktop: "On your desktop",
    sectionBrowser: "In your browser",
    sectionCommunity: "Project links",
    badgeBundledIos: "Source included with iOS app",
    badgeBundledAndroid: "Source included with Android app",
    ctaAppStore: "App Store",
    ctaPlayStore: "Google Play",
    ctaDownload: "Download",
    ctaSourceCode: "Source code",
    ctaUpstreamSource: "Open upstream source",
    ctaOpenMac: "Open in Mac app",
    ctaDocs: "Documentation",
    ctaSetupGuide: "Setup guide",
    ctaChromeWebStore: "Chrome Web Store",
    ctaOpenPlugins: "Open Plugins",
    ctaBrowseClawHub: "ClawHub (external)",
    linkDiscord: "Discord community",
    linkDocs: "Documentation",
    linkSupport: "Support",
    linkRepository: "Repository",
    linkIssues: "Issues",
    cards: {
      ios: {
        title: "iPhone",
        desc: "Build the Shardsclaw iOS companion from this source tree to chat, share content, and approve actions.",
      },
      android: {
        title: "Android",
        desc: "Build the Shardsclaw Android companion from this source tree for chat, camera, and Canvas features.",
      },
      appleWatch: {
        title: "Apple Watch",
        desc: "The Apple Watch companion source is included with the iOS project.",
      },
      wearOs: {
        title: "Wear OS",
        desc: "The Wear OS companion source is included with the Android project.",
      },
      macos: {
        title: "macOS",
        desc: "Build the Shardsclaw menu-bar companion from this repository; no signed Shardsclaw download is published here.",
      },
      windows: {
        title: "Windows",
        desc: "The Windows companion is a separate OpenClaw upstream project; this repository does not include a Shardsclaw Windows build.",
      },
      linux: {
        title: "Linux",
        desc: "Build the Shardsclaw native desktop app from this repository; no binary release is published here.",
      },
      chrome: {
        title: "Chrome extension",
        desc: "No Shardsclaw Chrome Web Store listing is provided. See the source documentation for browser-control setup.",
      },
      plugins: {
        title: "Plugins & skills",
        desc: "Extend Shardsclaw with optional plugins and skills; ClawHub is an independent external registry.",
      },
    },
  },
} satisfies TranslationMap;

export const registerAppsEnglish = Object.assign(
  () => {
    Object.assign(en, enApps);
  },
  { catalog: enApps },
);
